# imports
import strawberry
import requests
from ..types.object import Object
from logging_setup import LogUtil, LogType, LogLevel

# Define the Query resolver
@strawberry.type
class ProcessQuery:
    @strawberry.field(name="get_api_process_objects") # name is optional
    def get_api_process_objects(self) -> Object:
        LogUtil.log(LogType.APPLICATION, LogLevel.INFO, "Query get_api_process_objects called")
        try:
            LogUtil.log(LogType.SYSTEM, LogLevel.DEBUG, "Calling external API for process objects")
            # Sample API call
            response = requests.get("http://localhost:9090/api/process/v1/objects/1")
            LogUtil.log(LogType.SYSTEM, LogLevel.DEBUG, f"API response status: {response.status_code}")
            if response.status_code == 200:
                data = response.json()
                output = {"id":data['message']['id'],"name":data['message']['name']}
                LogUtil.log(LogType.APPLICATION, LogLevel.INFO, "Successfully retrieved process object", object=output)
                # Automatically map the JSON response to the Object dataclass
                return Object(**output)
            else:
                LogUtil.log(LogType.ERROR, LogLevel.WARN, "API call failed", status_code=response.status_code)
                raise Exception(f"API call failed with status code {response.status_code}")
        except Exception as e:
            LogUtil.log(LogType.ERROR, LogLevel.ERROR, "Error in get_api_process_objects query", e)
            LogUtil.log(LogType.ERROR, LogLevel.FATAL, "Fatal error in get_api_process_objects", e)
            raise e