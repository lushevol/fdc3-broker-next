# imports
from flask import Blueprint, current_app, request, json
from app.services.process_service import *
from logging_setup import LogUtil, LogType, LogLevel

process_route = Blueprint("process_route", __name__)

@process_route.route("/objects/<id>", methods=["GET"])
def get_object_by_id(id: int):
    LogUtil.log(LogType.APPLICATION, LogLevel.INFO, f"Route {request.path} accessed", user=request.remote_addr)
    if request.method == "GET":
        try:
            LogUtil.log(LogType.SYSTEM, LogLevel.DEBUG, "Calling ProcessService.get_object_by_id", id=id)
            # to use app config it has to be in context
            # print(current_app.config)
            result = ProcessService.get_object_by_id(id)
            LogUtil.log(LogType.APPLICATION, LogLevel.INFO, "Successfully retrieved object", id=id, status="success")
            return result
        except Exception as e:
            LogUtil.log(LogType.ERROR, LogLevel.ERROR, "Error retrieving object", e, id=id, errorCode=500)
            LogUtil.log(LogType.ERROR, LogLevel.FATAL, "Fatal error in get_object_by_id", e, id=id)
            return json.dumps({"status": "failed", "message": [], "error": str(e)})
    else:
        LogUtil.log(LogType.ERROR, LogLevel.WARN, "Unsupported method for /objects/<id>", method=request.method)
        return json.dumps({"status": "failed", "message": [], "error": "not supported"})
