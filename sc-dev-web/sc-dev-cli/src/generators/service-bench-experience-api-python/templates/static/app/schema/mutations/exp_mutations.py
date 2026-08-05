# imports
import strawberry
from ..types.input_object import InputObject, InputSchema
from ..types.object import Object
from marshmallow import EXCLUDE
from logging_setup import LogUtil, LogType, LogLevel

# Define the Mutation resolver
@strawberry.type
class ExpMutation:
    @strawberry.mutation(name="update_objects") # name is optional
    def updateObject(self, input: InputObject) -> Object:
        LogUtil.log(LogType.APPLICATION, LogLevel.INFO, "Mutation updateObject called", input=input.__dict__)
        try:
            LogUtil.log(LogType.SYSTEM, LogLevel.DEBUG, "Validating input with Marshmallow")
            # Validate with Marshmallow
            schema = InputSchema()
            validated_data = schema.load(input.__dict__)
            LogUtil.log(LogType.APPLICATION, LogLevel.INFO, "Input validated successfully", status="success")
            # Logic to be written
            new_object = InputObject(**validated_data)
            LogUtil.log(LogType.APPLICATION, LogLevel.INFO, "Object updated successfully", object=new_object)
            return new_object
        except Exception as e:
            LogUtil.log(LogType.ERROR, LogLevel.ERROR, "Error in updateObject mutation", e)
            LogUtil.log(LogType.ERROR, LogLevel.FATAL, "Fatal error in updateObject", e)
            raise e
        