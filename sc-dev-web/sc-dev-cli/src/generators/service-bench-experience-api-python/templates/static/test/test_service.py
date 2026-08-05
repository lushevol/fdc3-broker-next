import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

import pytest
from flask import Flask
from app.services.exp_stream_service import ExpStreamService
from types import SimpleNamespace

class FileService:
    def __init__(self, filename):
        self.filename = filename

@pytest.fixture
def app():
    app = Flask(__name__)
    return app

def test_get_file_success(app):
    file = FileService("test.txt")
    with app.app_context():
        response = ExpStreamService.get_file(file)
        data = response.get_json()
        assert data["status"] == "success"
        assert data["message"]["filename"] == "test.txt"

def test_get_file_exception(app):
    class NoFilename:
        pass
    file = NoFilename()
    with app.app_context():
        response = ExpStreamService.get_file(file)
        data = response.get_json()
        assert data["status"] == "failed"
        assert "Errormessage" in data