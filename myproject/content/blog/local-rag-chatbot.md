---
title: How to build a local chatbot with RAG
description: Run a private chatbot in your terminal that answers questions from your own CSV file, using Ollama, LangChain and Chroma.
date: 2025-11-26
number: 2
repo: https://github.com/Manav47699/local_chatbot_ollama_langchain_RAG_FastAPI
tags: [ai, rag, ollama, langchain]
---

Retrieval-Augmented Generation (RAG) lets a small local model answer questions about *your* data: the relevant rows are retrieved from a vector database and handed to the model as context. Everything here runs on your own machine.

### Install the dependencies

```bash
pip install pandas             # Load CSV datasets
pip install langchain          # Prompts, chains, message templates, etc.
pip install langchain-ollama   # Connects LangChain to your local Ollama models
pip install langchain-chroma   # Vector database for RAG
```

### Pull the Ollama models

These are the models I used: a small chat model and an embedding model.

```bash
ollama pull qwen2.5:1.5b         # used in main.py
ollama pull mxbai-embed-large    # used in vector.py
```

> [!NOTE]
> Run these in a terminal (Ctrl + Alt + T on Ubuntu).

### Prepare your CSV

Put the knowledge you want the bot to know into a CSV file and load it with pandas.

### Build the vector database

Run `vector.py` to create embeddings for every row of your CSV.

> [!WARNING]
> If a database already exists, or you've switched embedding models, delete the old one first or you'll get mismatched vectors:
>
> ```bash
> rm -rf YOURDATABASENAME
> # e.g. rm -rf chrome_langchain_db
> ```

### Chat

Run `main.py` and start asking questions.
