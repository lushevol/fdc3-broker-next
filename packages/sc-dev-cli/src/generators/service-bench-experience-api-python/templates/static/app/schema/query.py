# imports
import strawberry

# Import queries as needed
from .queries.exp_queries import ExpQuery
from .queries.process_queries import ProcessQuery

@strawberry.type
class Query(ExpQuery, ProcessQuery):  # Inherit from multiple query classes
   pass