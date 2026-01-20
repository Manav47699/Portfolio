import os
import cohere
from dotenv import load_dotenv

from langchain_community.document_loaders import PyPDFLoader
from langchain_community.document_loaders.csv_loader import CSVLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
from langchain_core.embeddings import Embeddings


# -----------------------------
# Load environment variables
# -----------------------------
load_dotenv()
COHERE_API_KEY = os.getenv("COHERE_API_KEY")

if not COHERE_API_KEY:
    raise ValueError("COHERE_API_KEY not found in .env file")


# -----------------------------
# Cohere Embedding Wrapper
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
            model="medium",
            texts=[text],
            input_type="search_query"
        )
        return response.embeddings[0]


embeddings = CohereEmbeddings(COHERE_API_KEY)


# -----------------------------
# Load documents
# -----------------------------
documents = []

pdf_loader = PyPDFLoader("data/resume.pdf")
documents.extend(pdf_loader.load())

csv_loader = CSVLoader(file_path="data/portfolio.csv")
documents.extend(csv_loader.load())

print(f"Loaded {len(documents)} raw documents")


# -----------------------------
# Split documents
# -----------------------------
splitter = RecursiveCharacterTextSplitter(
    chunk_size=500,
    chunk_overlap=50
)

chunks = splitter.split_documents(documents)
print(f"Created {len(chunks)} chunks")


# -----------------------------
# Store in ChromaDB
# -----------------------------
vectorstore = Chroma.from_documents(
    documents=chunks,
    embedding=embeddings,
    persist_directory="chroma_db"
)

vectorstore.persist()

print("✅ Documents embedded and stored in ChromaDB")
