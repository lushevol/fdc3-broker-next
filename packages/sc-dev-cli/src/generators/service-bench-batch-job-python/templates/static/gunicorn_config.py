# Gunicorn configuration file
# See: https://docs.gunicorn.org/en/stable/settings.html

# Number of worker processes (CPU-bound: 2-4x CPUs, IO-bound: higher)
workers = 2
# Worker type: 'sync' (default), 'gevent' (async, for websockets/long polling), 'gthread' for threaded workers (good for IO-bound, not CPU-bound), 'uvicorn.workers.UvicornWorker' (for ASGI)
worker_class = "gevent"
# Number of threads per worker (only for 'gthread' worker_class)
threads = 4
# Max simultaneous clients per worker (only for async workers)
worker_connections = 1000
# Worker timeout (seconds before killing unresponsive worker)
timeout = 30
