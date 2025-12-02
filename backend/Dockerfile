# Stage 1: Build Angular
# FROM node:18 AS frontend-build
# WORKDIR /frontend
# COPY frontend/ .
# RUN npm install && npm run build --configuration production

# Stage 2: Backend with FastAPI
FROM python:3.14-slim
WORKDIR /server

# Install backend dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY server/ ./

# # Copy built Angular files into backend
# COPY --from=frontend-build /frontend/dist/my-angular-app ./frontend/dist/my-angular-app

# Expose port
EXPOSE 8000

# Run FastAPI
WORKDIR /server
CMD ["uvicorn", "main:webApp", "--host", "0.0.0.0", "--port", "8000"]