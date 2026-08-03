# imports
from flask import current_app, jsonify

from app.dto.job_dto import JobDto
from logging_setup import LogUtil, LogType, LogLevel

class ProcessService:
    @staticmethod
    def handle_task_a(jobDto: JobDto):
        try:
            LogUtil.log(LogType.APPLICATION, LogLevel.INFO, f"Starting handle event a with jobDefinitionId={jobDto.jobDefinitionId}", status="success")
            # to use app config it has to be in context
            # print(current_app.config)
            output = {"id":id,"name":"Hello World"}
            LogUtil.log(LogType.APPLICATION, LogLevel.INFO, f"Completed handle event a with jobDefinitionId={jobDto.jobDefinitionId}", status="success")
        except Exception as e:
            LogUtil.log(LogType.ERROR, LogLevel.FATAL, "A fatal error occurred", e)

    @staticmethod
    def handle_task_b(jobDto: JobDto):
        try:
            LogUtil.log(LogType.APPLICATION, LogLevel.INFO, f"Starting handle event b with jobDefinitionId={jobDto.jobDefinitionId}", status="success")
            # to use app config it has to be in context
            # print(current_app.config)
            output = {"id":id,"name":"Hello World"}
            LogUtil.log(LogType.APPLICATION, LogLevel.INFO, f"Completed handle event b with jobDefinitionId={jobDto.jobDefinitionId}", status="success")
        except Exception as e:
            LogUtil.log(LogType.ERROR, LogLevel.FATAL, "A fatal error occurred", e)
