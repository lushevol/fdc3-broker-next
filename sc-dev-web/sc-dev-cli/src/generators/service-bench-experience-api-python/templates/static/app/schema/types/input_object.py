# imports
import strawberry
from marshmallow import Schema,fields,validate

# Define validation schema
class InputSchema(Schema):
   id = fields.Int(required=True, validate=validate.Range(min=1))
   name = fields.Str(required=True)

# Define GraphQL input
@strawberry.input
class InputObject:
   id: int
   name: str