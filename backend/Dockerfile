# Base image
FROM python:3.11-slim

# Print logs immediately (good for Docker & cloud)
ENV PYTHONUNBUFFERED=1

# Working directory inside container
WORKDIR /app

# System dependencies for ML libraries
RUN apt-get update && apt-get install -y \
    build-essential \
    git \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# FastAPI port (documentation)
EXPOSE 8000

# Run FastAPI (Render-compatible)
CMD ["sh", "-c", "uvicorn chat:app --host 0.0.0.0 --port ${PORT:-8000}"]























# the below code is for local running. but for deploying, we need to make the port dynamic and now local
# # Base image( this is the most commonly used one for python projects)
# FROM python:3.11-slim

# # this orders python to print the logs direclty instead of storing in the memory. this is mainly useful for debugging.
# ENV PYTHONUNBUFFERED=1

# # Working directory inside container. Docker creates the 'app' folder
# WORKDIR /app

# # Install system dependencies (safe minimum for ML)
# #this block does the following -> Prepare a Linux environment capable of compiling Python ML libraries, then clean up to keep the image small.
# RUN apt-get update && apt-get install -y \
#     build-essential \
#     git \
#     && rm -rf /var/lib/apt/lists/*

# # Copy dependencies and install
# COPY requirements.txt .
# RUN pip install --no-cache-dir -r requirements.txt

# # Copy backend code
# COPY . .

# # FastAPI port
# EXPOSE 8000

# # Start FastAPI app from chat.py
# CMD ["uvicorn", "chat:app", "--host", "0.0.0.0", "--port", "8000"]
