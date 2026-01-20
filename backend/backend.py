from fastapi import FastAPI
from pydantic import BaseModel
from chat_logic import chat_router

app = FastAPI()

class ChatRequest(BaseModel):
    question: str


@app.post("/chat")
def chat(req: ChatRequest):
    answer = chat_router(req.question)
    return {"answer": answer}
