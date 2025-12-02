from api.AviationSafetyAPI import AviationSafetyAPI
from services.InMemoryDatabase import InMemoryDatabase

class Server:
    def __init__(self):
        self.database = InMemoryDatabase()


server = Server()
webApp = AviationSafetyAPI(db=server.database).get_app()