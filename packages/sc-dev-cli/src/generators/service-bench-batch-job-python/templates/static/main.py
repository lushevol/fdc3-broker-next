# import sys and os to set up project root
import sys
import os
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

# import flask and dependencies
from flask import Flask, json, request
from flask_cors import CORS
from flask_compress import Compress

# import logging utilities
from logging_setup import LogUtil, LogType, LogLevel

# import routes
from app.routes.process_route import process_route

# Suppress default Flask/Werkzeug request logging
import logging
log = logging.getLogger('werkzeug')
log.setLevel(logging.ERROR)

# app
app = Flask(__name__)
compress = Compress()
compress.init_app(app)

# Load the base configuration
app.config.from_pyfile('config.py')
# Load the environment-specific configuration
env = os.getenv('SB_ENV_ID', 'local')
app.config.from_pyfile(f'env/{env}/config.py')

@app.route('/q/health/live', methods=['GET'])
def get_liveness():
    return json.dumps({"status": "success", "message": []})

@app.route('/q/health/ready', methods=['GET'])
def get_readiness():
    return json.dumps({"status": "success", "message": []})

# register router
app.register_blueprint(process_route, url_prefix=app.config['URL_PREFIX'])

# Handle MemoryError globally
def handle_memory_error(exc_type, exc_value, exc_traceback):
    if exc_type is MemoryError:
        sys.exit(1)
    else:
        sys.__excepthook__(exc_type, exc_value, exc_traceback)

if __name__ == "__main__":
    # cros
    if 'ALLOWED_DOMAIN' in app.config:
        cors = CORS(app, resources={r"/*": {"origins": app.config['ALLOWED_DOMAIN']}})

    # run
    LogUtil.log(LogType.APPLICATION, LogLevel.INFO, "Starting app on port {}".format(app.config['PORT_NO']))
    app.run(host="0.0.0.0", port=app.config['PORT_NO'])
