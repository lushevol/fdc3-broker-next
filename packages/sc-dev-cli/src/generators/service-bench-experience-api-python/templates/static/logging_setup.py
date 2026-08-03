import logging
import json
import yaml
import os
from logging import StreamHandler, FileHandler, Formatter, LoggerAdapter
from logging.handlers import RotatingFileHandler, TimedRotatingFileHandler
from enum import Enum, auto
import inspect

# Define enums for log types and severity levels
class LogType(Enum):
    APPLICATION = "ApplicationLog"
    ERROR = "ErrorLog"
    SYSTEM = "SystemLog"
    TRANSACTION = "TransactionLog"
    SECURITY = "SecurityLog"
    AUDIT = "AuditLog"

class LogLevel(Enum):
    TRACE = 10  # Custom level, Python's logging module does not have TRACE by default
    DEBUG = 10
    INFO = 20
    WARN = 30
    ERROR = 40
    FATAL = 50

# Define custom log level TRACE
logging.addLevelName(LogLevel.TRACE.value, 'TRACE')

class JsonFormatter(Formatter):
    def __init__(self, json_format=None):
        super().__init__()
        self.json_format = json_format or {
            'timestamp': 'asctime',
            'logType': 'name',
            'logLevel': 'levelname',
            'serviceName': 'serviceName',
            'methodName': 'methodName',
            'message': 'message',
            'context': 'context'
        }

    def format(self, record):
        log_record = {}
        for key, attr in self.json_format.items():
            if hasattr(record, attr):
                log_record[key] = getattr(record, attr)
            else:
                log_record[key] = None
        log_record['timestamp'] = self.formatTime(record, self.datefmt)
        log_record['message'] = record.getMessage()
        if record.exc_info:
            log_record['exception'] = self.formatException(record.exc_info)
        return json.dumps(log_record)

class CustomFormatter(Formatter):
    def __init__(self, fmt=None):
        super().__init__(fmt)

    def format(self, record):
        formatted_message = super().format(record)
        if hasattr(record, 'context') and record.context:
            context_str = ", ".join(f"{key}={value}" for key, value in record.context.items())
            formatted_message += f" | context: {context_str}"
        return formatted_message

# Load configuration from YAML file
with open('logging_config.yaml', 'r') as config_file:
    config = yaml.safe_load(config_file)

# Create loggers for each log type
loggers = {}
for log_type in LogType:
    log_type_name = log_type.value
    if log_type_name not in config['loggers']:
        raise KeyError(f"Logger configuration for {log_type_name} not found in logging_config.yaml")
    logger_config = config['loggers'][log_type_name]
    logger = logging.getLogger(log_type_name)
    logger.setLevel(getattr(logging, logger_config['level']))

    for handler_config in logger_config['handlers']:
        if handler_config['type'] == 'console':
            handler = StreamHandler()

        if handler_config['format'] == 'json':
            handler.setFormatter(JsonFormatter(handler_config.get('json_format')))
        else:
            handler.setFormatter(CustomFormatter(handler_config.get('text_format', '%(asctime)s [%(methodName)s] %(levelname)s [%(name)s] %(serviceName)s - %(message)s')))

        logger.addHandler(handler)

    loggers[log_type] = logger

# Ensure dynamically created loggers have handlers
def add_handlers(logger, log_type):
    if not logger.hasHandlers():
        log_type_name = log_type.value
        if log_type_name not in config['loggers']:
            raise KeyError(f"Logger configuration for {log_type_name} not found in logging_config.yaml")
        logger_config = config['loggers'][log_type_name]

        for handler_config in logger_config['handlers']:
            if handler_config['type'] == 'console':
                handler = StreamHandler()

            if handler_config['format'] == 'json':
                handler.setFormatter(JsonFormatter(handler_config.get('json_format')))
            else:
                handler.setFormatter(CustomFormatter(handler_config.get('text_format', '%(asctime)s [%(methodName)s] %(levellevel)s [%(name)s] %(serviceName)s - %(message)s')))

            logger.addHandler(handler)

# Logging utility class
class LogUtil:
    @staticmethod
    def log(log_type: LogType, level: LogLevel, message: str, exception: Exception = None, **context):
        logger_temp = loggers[log_type]

        # Capture the calling class and method
        frame = inspect.currentframe().f_back
        calling_class = "Global"
        calling_method = frame.f_code.co_name

        current_frame = inspect.currentframe()
        caller_frame = current_frame.f_back
        while caller_frame:
            if 'self' in caller_frame.f_locals:
                caller_instance = caller_frame.f_locals['self']
                calling_class = caller_instance.__class__.__name__
                calling_method = caller_frame.f_code.co_name
                break
            caller_frame = caller_frame.f_back

        log_message = {
            'serviceName': calling_class,
            'methodName': calling_method,
            'message': message,
            'context': context
        }

        logger = LoggerAdapter(logger_temp, {'serviceName': calling_class, 'methodName': calling_method, 'context': context})

        if level == LogLevel.TRACE:
            if exception:
                logger.log(LogLevel.TRACE.value, message, exc_info=exception)
            else:
                logger.log(LogLevel.TRACE.value, message)
        elif level == LogLevel.DEBUG:
            if exception:
                logger.debug(message, exc_info=exception)
            else:
                logger.debug(message)
        elif level == LogLevel.INFO:
            if exception:
                logger.info(message, exc_info=exception)
            else:
                logger.info(message)
        elif level == LogLevel.WARN:
            if exception:
                logger.warning(message, exc_info=exception)
            else:
                logger.warning(message)
        elif level == LogLevel.ERROR:
            if exception:
                logger.error(message, exc_info=exception)
            else:
                logger.error(message)
        elif level == LogLevel.FATAL:
            if exception:
                logger.critical(message, exc_info=exception)
            else:
                logger.critical(message)