# imports 
import os
from flask import request, jsonify

class Event:
    def __init__(self):
        self.body = request.get_data()
        self.headers = request.headers
        self.method = request.method
        self.query = request.args
        self.path = request.path

class Context:
    def __init__(self):
        self.app = app
        self.hostname = os.getenv('HOSTNAME', 'localhost')
