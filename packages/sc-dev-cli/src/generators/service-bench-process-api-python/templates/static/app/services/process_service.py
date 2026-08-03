# imports
from flask import current_app, jsonify
from logging_setup import LogUtil, LogType, LogLevel

class ProcessService:
    @staticmethod
    def get_object_by_id(id:int):
        try:
            LogUtil.log(LogType.APPLICATION, LogLevel.INFO, f"Starting get_object_by_id with id={id}", status="success")
            # to use app config it has to be in context
            # print(current_app.config)
            output = {"id":id,"name":"Hello World"}
            LogUtil.log(LogType.APPLICATION, LogLevel.INFO, f"Completed get_object_by_id with id={id}", status="success")
            # Optional
            # LogUtil.log(LogType.TRANSACTION, LogLevel.INFO, "Transaction log example")
            # LogUtil.log(LogType.SECURITY, LogLevel.INFO, "Security log example", securityLevel="high")
            # LogUtil.log(LogType.AUDIT, LogLevel.INFO, "Audit log example", user="auditor", action="view")
            return jsonify({"status":"success","message":output})
        except Exception as e:
            LogUtil.log(LogType.ERROR, LogLevel.FATAL, "A fatal error occurred", e)
            return jsonify({"status":"failed","message":[],"Errormessage":str(e)})
        
