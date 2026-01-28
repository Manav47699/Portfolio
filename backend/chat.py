# chat.py
import os
import cohere
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from huggingface_hub import InferenceClient
from langchain_chroma import Chroma
from langchain_core.embeddings import Embeddings

# -----------------------------
# Load environment variables
# -----------------------------
load_dotenv()

COHERE_API_KEY = os.getenv("COHERE_API_KEY")
HF_API_KEY = os.getenv("HF_API_KEY")
CONTACT_EMAIL = os.getenv("CONTACT_EMAIL", "acharyamanav7@gmail.com")

if not COHERE_API_KEY or not HF_API_KEY:
    raise ValueError("Missing API keys in .env file")

# -----------------------------
# Cohere Embeddings Wrapper
# -----------------------------
class CohereEmbeddings(Embeddings):
    def __init__(self, api_key: str):
        self.client = cohere.Client(api_key)

    def embed_documents(self, texts):
        response = self.client.embed(
            model="embed-v4.0",
            texts=texts,
            input_type="search_document"
        )
        return response.embeddings

    def embed_query(self, text):
        response = self.client.embed(
            model="embed-v4.0",
            texts=[text],
            input_type="search_query"
        )
        return response.embeddings[0]

embeddings = CohereEmbeddings(COHERE_API_KEY)

# -----------------------------
# Load ChromaDB
# -----------------------------
vectorstore = Chroma(
    persist_directory="chroma_db",
    embedding_function=embeddings
)
retriever = vectorstore.as_retriever(search_kwargs={"k": 3})

# -----------------------------
# Hugging Face LLM
# -----------------------------
llm = InferenceClient(
    model="meta-llama/Llama-3.1-8B-Instruct",
    token=HF_API_KEY
)

# -----------------------------
# FastAPI app
# -----------------------------
app = FastAPI()

# Allow CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # for local dev
        "https://www.manavacharya.com.np/"  # your Vercel frontend
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# -----------------------------
# Request model
# -----------------------------
class ChatRequest(BaseModel):
    question: str

# -----------------------------
# Chat endpoint
# -----------------------------
@app.post("/chat")
def chat(req: ChatRequest):
    user_query = req.question

    # 1️⃣ Retrieve context from ChromaDB
    try:
        docs = retriever.invoke(user_query)
    except Exception as e:
        print("Error retrieving from Chroma:", e)
        docs = []

    context = "\n\n".join(doc.page_content for doc in docs) if docs else ""

    # 2️⃣ Prepare messages
    system_message = (
        "You are a friendly portfolio assistant chatbot. "
        "Answer general questions normally. "
        "If the user asks about Manav (personal info, projects, hobbies, contacts), "
        "use ONLY the provided context. "
        f"If the context does not contain the answer, say: 'I don't have that information. You can contact Manav at {CONTACT_EMAIL}.'"
    )
    user_message = f"Context:\n{context}\n\nUser question:\n{user_query}"

    messages = [
        {"role": "system", "content": system_message},
        {"role": "user", "content": user_message}
    ]

    # 3️⃣ Generate LLM response
    try:
        response = llm.chat_completion(
            messages=messages,
            max_tokens=300,
            temperature=0.5
        )
        answer = response.choices[0].message["content"].strip()
    except Exception as e:
        print("Error generating answer:", e)
        answer = "Sorry, I cannot generate an answer right now."

    return {"answer": answer}

# -----------------------------
# Run with: uvicorn chat:app --reload --port 8000
# -----------------------------
