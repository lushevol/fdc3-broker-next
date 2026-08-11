# imports
import strawberry
from typing import List
from ..types.object import Object
from logging_setup import LogUtil, LogType, LogLevel

# Define the Query resolver
@strawberry.type
class ExpQuery:
    @strawberry.field(name="get_objects") # name is optional
    def objects(self) -> List[Object]:
        LogUtil.log(LogType.APPLICATION, LogLevel.INFO, "Query get_objects called")
        try:
            LogUtil.log(LogType.SYSTEM, LogLevel.DEBUG, "Preparing sample data for get_objects")
            # Sample data - in real scenario, fetch from DB or other sources
            output = [
                Object(id="10", name="TEST"),
            ]
            LogUtil.log(LogType.APPLICATION, LogLevel.INFO, "Successfully retrieved objects", count=len(output))
            return output
        except Exception as e:
            LogUtil.log(LogType.ERROR, LogLevel.ERROR, "Error in get_objects query", e)
            LogUtil.log(LogType.ERROR, LogLevel.FATAL, "Fatal error in get_objects", e)
            raise e