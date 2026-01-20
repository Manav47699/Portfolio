import os
from langchain_chroma import Chroma
from langchain_community.embeddings import CohereEmbeddings
from huggingface_hub import InferenceClient

OWNER_EMAIL = os.getenv("OWNER_EMAIL")

embeddings = CohereEmbeddings()
db = Chroma(
    persist_directory="chroma_db",
    embedding_function=embeddings
)

llm = InferenceClient(
    model="mistralai/Mistral-7B-Instruct-v0.2",
    token=os.getenv("HUGGINGFACEHUB_API_TOKEN")
)


def is_personal_question(query: str) -> bool:
    keywords = [
        "you", "your", "owner", "resume", "portfolio",
        "email", "phone", "education", "experience"
    ]
    return any(k in query.lower() for k in keywords)


def generate_general_answer(question: str) -> str:
    prompt = f"Answer the following question clearly:\n\n{question}"
    response = llm.text_generation(prompt, max_new_tokens=300)
    return response.strip()


def generate_rag_answer(question: str) -> str:
    docs = db.similarity_search(question, k=3)

    if not docs:
        return (
            "I don’t have information about this.\n\n"
            f"You can directly contact my owner at {OWNER_EMAIL}"
        )

    context = "\n\n".join(doc.page_content for doc in docs)

    prompt = f"""
You are an assistant answering questions ONLY from the context below.
If the answer is not present, say you do not know.

Context:
{context}

Question:
{question}
"""

    response = llm.text_generation(prompt, max_new_tokens=300)

    if "i don't know" in response.lower():
        return (
            "I don’t have information about this.\n\n"
            f"You can directly contact my owner at {OWNER_EMAIL}"
        )

    return response.strip()


def chat_router(question: str) -> str:
    if is_personal_question(question):
        return generate_rag_answer(question)
    else:
        return generate_general_answer(question)
