from fastapi import FastAPI
from services.InMemoryDatabase import InMemoryDatabase

class AviationSafetyAPI:
    def __init__(self, db: InMemoryDatabase):
        self.db = db
        self.app = FastAPI()
        self.add_routes(self.app)


    def add_routes(self, app: FastAPI):
        """Add API routes to the FastAPI app."""
        @app.get("/api/aviation-safety/query")
        async def query_aviation_safety_data(year: int, page: int = 1, page_size: int = 50):
            """Query aviation safety data by year with pagination."""
            data = self.db.query_data(year=year, page=page, page_size=page_size)
            return data.to_json(orient="records")
        
        @app.get("/api/test")
        async def test_endpoint():
            """A simple test endpoint to verify the API is working."""
            return {"status": "OK"}
        
    def get_app(self) -> FastAPI:
        """Get the FastAPI app instance."""
        return self.app
