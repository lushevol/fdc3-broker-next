import sys
import os
# Add the parent directory to the system path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
# Now you can import app
from main import app
import pytest

@pytest.fixture
def client():
    app.testing = True
    with app.test_client() as client:
        yield client
        
def test_get_items(client):
    # Test the GET /api/process/v1/objects/1 endpoint
    response = client.get('/api/process/v1/objects/1')
    assert response.status_code == 200
    assert response.json ==  {"message": {"id": "1","name": "Hello World"},"status": "success"}
