# Stage 1: Build Angular
FROM node:20 AS frontend-build
WORKDIR /frontend/aviation-safety-frontend
COPY frontend/aviation-safety-frontend/ ./
RUN npm install --force && npm run build

# Stage 2: Backend with FastAPI
FROM python:3.14-slim
WORKDIR /backend/server
# Install backend dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
# Copy backend code
COPY backend/server/ ./
# Copy built Angular files into backend
WORKDIR /backend/www/
COPY --from=frontend-build /backend/www/ .
# Expose port
EXPOSE 8000
# Run FastAPI
WORKDIR /backend/server
CMD ["uvicorn", "main:webApp", "--host", "0.0.0.0", "--port", "8000"]