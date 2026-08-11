# imports
from flask import Blueprint, request, json
from app.services.exp_stream_service import *
from logging_setup import LogUtil, LogType, LogLevel

exp_stream_route = Blueprint("exp_stream_route", __name__)

@exp_stream_route.route("/filetransfer", methods = ['POST'])
def get_file():
    LogUtil.log(LogType.APPLICATION, LogLevel.INFO, f"Route {request.path} accessed", user=request.remote_addr)
    if request.method == "POST":
        try:
            LogUtil.log(LogType.SYSTEM, LogLevel.DEBUG, "Calling ExpStreamService.filetransfer")
            file = request.files['file'] 
            LogUtil.log(LogType.APPLICATION, LogLevel.INFO, "Successfully retrieved file", status="success")
            return ExpStreamService.get_file(file)
        except Exception as e:
            LogUtil.log(LogType.ERROR, LogLevel.ERROR, "Error retrieving file", e, errorCode=500)
            LogUtil.log(LogType.ERROR, LogLevel.FATAL, "Fatal error in get_file", e)
            return json.dumps({"status": "failed", "message": [], "error": str(e)})
    else:
        LogUtil.log(LogType.ERROR, LogLevel.WARN, "Unsupported method for /filetransfer", method=request.method)
        return json.dumps({"status": "failed", "message": [], "error": "not supported"})
