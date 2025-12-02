import unittest
import pandas as pd
from services.InMemoryDatabase import InMemoryDatabase

class TestInMemoryDatabase(unittest.TestCase):
    _DATA_PATH = "/tests/TestData/AviationTestData.csv"
    def setUp(self):
        self.db = InMemoryDatabase(self._DATA_PATH)

    def test_singleton_behavior(self):
        db2 = InMemoryDatabase(self._DATA_PATH)
        self.assertIs(self.db, db2, "InMemoryDatabase is not a singleton.")

    def test_data_loading(self):
        self.assertIsNotNone(self.db.data, "Data should be loaded.")
        self.assertFalse(self.db.data.empty, "Data should not be empty.")

    def test_query_data(self):
        expected_output = self.db.data.iloc[0:2].sort_values(by="Event.Id", ascending=True)
        output = self.db.query_data(year=2019, page=1, page_size=50)
        pd.testing.assert_frame_equal(output, expected_output, "Query output does not match expected output.")