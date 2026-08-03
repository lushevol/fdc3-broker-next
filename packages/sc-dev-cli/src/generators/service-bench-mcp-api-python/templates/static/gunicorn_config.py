# gunicorn_config.py
# Required placeholder for Python buildpack (scb-buildpacks/python)

# FastMCP exposes an ASGI app — use uvicorn worker
worker_class = "uvicorn.workers.UvicornWorker"
