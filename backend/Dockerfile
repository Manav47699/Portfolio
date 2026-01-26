# Base image( this is the most commonly used one for python projects)
FROM python:3.11-slim

# Environment settings
ENV PYTHONUNBUFFERED=1

# Working directory inside container. Docker creates the 'app' folder
WORKDIR /app

# Install system dependencies (safe minimum for ML)
RUN apt-get update && apt-get install -y \
    build-essential \
    git \
    && rm -rf /var/lib/apt/lists/*

# Copy dependencies and install
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY . .

# FastAPI port
EXPOSE 8000

# Start FastAPI app from chat.py
CMD ["uvicorn", "chat:app", "--host", "0.0.0.0", "--port", "8000"]
