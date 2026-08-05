# imports
import os

from flask import Blueprint, current_app, request, json, jsonify
from app.services.process_service import *
from app.dto.job_dto import *
from cloudevents.http import from_http
from logging_setup import LogUtil, LogType, LogLevel

process_route = Blueprint("process_route", __name__)

@process_route.route("", methods=["POST"])
def handle_cloud_event():
    if request.method == "POST":
        try:
            event = from_http(request.headers, request.get_data())
            LogUtil.log(LogType.SYSTEM, LogLevel.DEBUG, "Received Cloud Event", event=event)

            jobDtoInput = JobDto.from_dict(event.data)
            if event.get_attributes()["type"] == os.getenv("DOMAIN_JOB_ITAM") + "-" + os.getenv("DOMAIN_JOB_NAME") + "-taska":
                ProcessService.handle_task_a(jobDtoInput)
            elif event.get_attributes()["type"] == os.getenv("DOMAIN_JOB_ITAM") + "-" + os.getenv("DOMAIN_JOB_NAME") + "-taskb":
                ProcessService.handle_task_b(jobDtoInput)
            else:
                LogUtil.log(LogType.ERROR, LogLevel.ERROR, "Does not support event type" + event.get_attributes()["type"])
                raise Exception("Does not support event type" + event.get_attributes()["type"])

            # Process the cloud event here
            LogUtil.log(LogType.APPLICATION, LogLevel.INFO, "Successfully processed Cloud Event", status="success")
            jobDto = JobDto(
                jobDefinitionId=90001,
                jobId=10001,
                jobStatus=JobStatus.COMPLETED,
                jobDefinitionStatus=JobDefinitionStatus.ACTIVE,
                forceStop=False,
            )

            reponseHeaders = {
                "ce-id": event.get_attributes()["id"],
                "ce-specversion": event.get_attributes()["specversion"],
                "ce-type": os.getenv("DOMAIN_JOB_ITAM") + "-" + os.getenv("DOMAIN_JOB_NAME"),
                "ce-source": "/apis/v1/namespaces/" + os.getenv("DOMAIN_JOB_ITAM") + "/pingsources/" + os.getenv("PING_SOURCE_NAME"),
                "Content-Type": "application/json"
            }

            LogUtil.log(LogType.SYSTEM, LogLevel.DEBUG, "Before response", jobDto=jobDto.to_dict())
            return jsonify(jobDto.to_dict()), 200, reponseHeaders
        except Exception as e:
            LogUtil.log(LogType.ERROR, LogLevel.ERROR, "Error processing Cloud Event", e)
            LogUtil.log(LogType.ERROR, LogLevel.FATAL, "Fatal error in handle_cloud_event", e)
            return json.dumps({"status": "failed", "message": [], "error": str(e)}), 404
