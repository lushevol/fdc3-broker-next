import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

import pytest
import strawberry
from app.schema.mutations.exp_mutations import ExpMutation
from app.schema.queries.exp_queries import ExpQuery
from app.schema.types.input_object import InputObject
from app.schema.types.object import Object

@pytest.fixture
def exp_mutation():
    return ExpMutation()

@pytest.fixture
def exp_query():
    return ExpQuery()

def test_update_object_valid(exp_mutation):
    input_data = InputObject(id=1, name="Test Name")
    result = exp_mutation.updateObject(input_data)
    assert isinstance(result, InputObject)
    assert result.id == 1
    assert result.name == "Test Name"

def test_expquery_objects(exp_query):
    result = exp_query.objects()
    assert isinstance(result, list)
    assert len(result) == 1
    obj = result[0]
    assert hasattr(obj, "id")
    assert hasattr(obj, "name")
    assert obj.id == "10"
    assert obj.name == "TEST"