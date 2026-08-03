# import sys and os to set up project root
import sys
import os
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

# import flask and dependencies
from flask import Flask, json, request
from flask_cors import CORS
from flask_compress import Compress

# import strawberry-graphql and dependencies
import strawberry
from strawberry.flask.views import GraphQLView
from strawberry.extensions import QueryDepthLimiter, MaxAliasesLimiter, MaxTokensLimiter, AddValidationRules

# import graphql and dependencies
from graphql.validation import NoSchemaIntrospectionCustomRule

# import combined Query, Mutation class
from app.schema.query import Query
from app.schema.mutation import Mutation

# import logging utilities
from logging_setup import LogUtil, LogType, LogLevel

# import stream routes
from app.routes.exp_stream_route import exp_stream_route

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

# Graphql Security Extensions
GRAPHQL_EXTENSIONS=[
            QueryDepthLimiter(max_depth=app.config['GRAPHQL_MAX_DEPTH']),
            MaxAliasesLimiter(max_alias_count=app.config['GRAPHQL_MAX_ALIAS_COUNT']),
            MaxTokensLimiter(max_token_count=app.config['GRAPHQL_MAX_TOKEN_COUNT']),
        ]
# Disable Introspection
if app.config['GRAPHQL_DISABLE_INTROSPECTION']:
    GRAPHQL_EXTENSIONS.append(AddValidationRules([NoSchemaIntrospectionCustomRule]))
# Define Schema
SCHEMA = strawberry.Schema(
        query=Query, 
        mutation=Mutation, 
        extensions=GRAPHQL_EXTENSIONS
    )

# Add the GraphQL view
app.add_url_rule(
    '/graphql',
    view_func=GraphQLView.as_view(
        'graphql_view',
        schema=SCHEMA,
        graphiql=app.config['GRAPHQL_ENABLE_INTERFACE'], # Enables the GraphiQL interface
    )
)

@app.route('/q/health/live', methods=['GET'])
def get_liveness():
    return json.dumps({"status": "success", "message": []})

@app.route('/q/health/ready', methods=['GET'])
def get_readiness():
    return json.dumps({"status": "success", "message": []})

# register stream router
app.register_blueprint(exp_stream_route, url_prefix=app.config['URL_PREFIX'])

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
