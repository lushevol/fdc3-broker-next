import sys
import os
# Add the parent directory to the system path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# import
import pytest
from flask import Flask
import strawberry
from strawberry.flask.views import GraphQLView
import json
from app.schema.queries.process_queries import ProcessQuery

@pytest.fixture
def client():
    schema = strawberry.Schema(query=ProcessQuery)
    app = Flask(__name__)
    app.add_url_rule("/graphql", view_func=GraphQLView.as_view("graphql", schema=schema))
    # Provide a way to access Flask's test client in the tests
    with app.test_client() as client:
        yield client

# Helper function to perform a GraphQL query
def perform_graphql_query(client, query):
    response = client.post("/graphql", json={"query": query})
    return json.loads(response.data)

def test_get_api_process_objects(client, mocker):
    # Define the mock response from the external API
    mock_api_data = {
        "message": {
            "id": "1",
            "name": "Hello World"
        },
        "status": "success"
    }

    # Mock the requests.get function to return the mock joke data
    mocker.patch("requests.get", return_value=mocker.Mock(status_code=200, json=lambda: mock_api_data))

    # Perform the GraphQL query
    query = """
    {
        get_api_process_objects {
            id
            name
        }
    }
    """

    result = perform_graphql_query(client, query)

    # Check if the result matches the mock data
    expected_response = {
        "data": {
            "get_api_process_objects": {
                "id": 1,
                "name": "Hello World"
            }
        }
    }
    assert result == expected_response