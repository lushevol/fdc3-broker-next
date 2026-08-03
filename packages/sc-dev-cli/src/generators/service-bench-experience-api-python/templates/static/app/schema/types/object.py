# imports
import strawberry

# Define GraphQL types
@strawberry.type
class Object:
   id: int
   name: str