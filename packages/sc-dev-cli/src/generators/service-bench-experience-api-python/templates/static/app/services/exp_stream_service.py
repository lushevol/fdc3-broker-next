# imports
from flask import jsonify
from logging_setup import LogUtil, LogType, LogLevel

class ExpStreamService:
    @staticmethod
    def get_file(file):
        try:
            LogUtil.log(LogType.APPLICATION, LogLevel.INFO, f"Starting get_file with filename={file.filename}", status="success")
            output = {"filename":file.filename}
            LogUtil.log(LogType.APPLICATION, LogLevel.INFO, f"Completed get_file with filename={file.filename}", status="success")
            return jsonify({"status":"success","message":output})
        except Exception as e:
            LogUtil.log(LogType.ERROR, LogLevel.FATAL, "A fatal error occurred", e)
            return jsonify({"status":"failed","message":[],"Errormessage":str(e)})
