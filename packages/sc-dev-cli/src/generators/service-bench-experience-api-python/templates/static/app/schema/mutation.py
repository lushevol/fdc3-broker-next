# imports
import strawberry

# Import  as needed
from .mutations.exp_mutations import ExpMutation

@strawberry.type
class Mutation(ExpMutation):  # Inherit from multiple mutation classes
   pass