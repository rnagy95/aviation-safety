import unittest
from fastapi.testclient import TestClient
from api.AviationSafetyAPI import AviationSafetyAPI
from services.InMemoryDatabase import InMemoryDatabase
from datetime import datetime


class TestAviationSafetyAPI(unittest.TestCase):
    def setUp(self):
        self.test_db = InMemoryDatabase(
            data_path="/tests/TestData/AviationTestData.csv"
        )
        test_app = AviationSafetyAPI(db=self.test_db).get_app()
        self.client = TestClient(test_app)

    def test_endpoint(self):
        response = self.client.get("/api/test")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {"status": "OK"})

    def test_query(self):
        data_copy = self.test_db.data.copy()
        data_copy["Event.Date"] = data_copy["Event.Date"].apply(lambda x: datetime.strftime(x, "%Y-%m-%dT%H:%M:%S"))
        expected_output = {
            "status": "OK",
            "length": 2,
            "data": data_copy.iloc[0:2]
            .fillna("")
            .sort_values(by="Event.Id", ascending=True)
            .to_dict(orient="records"),
        }
        response = self.client.get(
            "/api/aviation-safety/query",
            params={"year": 2019, "page": 1, "page_size": 50},
        )
        self.assertEqual(
            response.status_code, 200, "Query endpoint did not return status 200."
        )
        output = response.json()

        self.assertEqual(
            output, expected_output, "Query output does not match expected output."
        )
