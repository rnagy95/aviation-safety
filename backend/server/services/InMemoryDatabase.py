import numpy as np
import pandas as pd
import os
from datetime import datetime


class InMemoryDatabase:
    """This class is a singleton in-memory database for loading, storing and querying Aviation Data"""

    _instance = None
    _INITIALIZED_FLAG = False

    def __new__(cls, *args, **kwargs):
        if not cls._instance:
            cls._instance = super(InMemoryDatabase, cls).__new__(cls)
        return cls._instance

    def __init__(self, data_path: str = "/assets/AviationData.csv"):
        if not self._INITIALIZED_FLAG:
            self.data = self._load_data(data_path)
            self.initialized = True

    def query_data(self, year: int, page: int, page_size: int) -> pd.DataFrame:
        """Query the in-memory database based on the year."""
        start_date = pd.to_datetime(datetime(year, 1, 1))
        end_date = pd.to_datetime(datetime(year + 1, 1, 1))
        result = (
            self.data[
                (self.data["Event.Date"] >= start_date)
                & (self.data["Event.Date"] < end_date)
            ]
            .sort_values(by="Event.Id", ascending=True)
            .iloc[(page - 1) * page_size : page * page_size]
        )
        return result

    def _load_data(self, path: str) -> pd.DataFrame:
        """Load data from a CSV file into the in-memory database."""
        working_directory = os.getcwd()
        full_path = working_directory + path
        data = pd.read_csv(full_path, encoding="mac_roman")
        data["Event.Date"] = pd.to_datetime(data["Event.Date"])
        return data
