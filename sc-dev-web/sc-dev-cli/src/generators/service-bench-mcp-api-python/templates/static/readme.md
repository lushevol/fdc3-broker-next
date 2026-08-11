## get python 3
- download link
    https://axess.sc.net/marketplace/golden-versions/gv-python-v1
- setup artifact path in `.pip` if linux or `pip.ini` if windows

### create env in linux
- python3 -m venv venv
- source venv/bin/activate
- pip install --upgrade pip
- pip install --upgrade setuptools

### create env in windows
- pip install virtualenv
- python -m virtualenv venv
- .\venv\Scripts\activate.bat
- pip install --upgrade pip
- pip install --upgrade setuptools

### package installation
- pip install -r requirements.txt

### start
python main.py

### project structure

| Path | Description |
|------|-------------|
| `main.py` | MCP server entry point — bootstraps FastMCP and registers tools |
| `app/tools/time_tool.py` | Example tools (`get_server_time`, `get_time_with_timezone`) |
| `app/tools/` | Add your own tool modules here |
| `logging_setup.py` | SC logging utilities (`LogUtil`, `LogType`, `LogLevel`) |
| `logging_config.yaml` | Logger configuration (JSON/text format per log type) |
| `requirements.txt` | Python dependencies |
| `env/local/` | Local environment variables |
| `faas-cli.sh` | Local VM build and deploy script |

### add a new tool
**Step 1** — Define a plain function in `app/tools/`:
```python
# app/tools/my_tool.py
from logging_setup import LogUtil, LogType, LogLevel

def greet(name: str) -> str:
    """Return a personalised greeting.

    Args:
        name: The name of the person to greet.
    """
    LogUtil.log(LogType.APPLICATION, LogLevel.INFO, "Calling greet", name=name)
    return f"Hello, {name}! Welcome to Service Bench."
```

**Step 2** — Register with `@mcp.tool()` in `main.py`:
```python
from app.tools.my_tool import greet

@mcp.tool()
def greet_tool(name: str) -> str:
    """Return a personalised greeting.

    Args:
        name: The name of the person to greet.
    """
    return greet(name)
```

**Step 3** — Add tests in `test/`:
```python
# test/test_my_tool.py
import sys, os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from app.tools.my_tool import greet

def test_greet():
    assert greet("Alice") == "Hello, Alice! Welcome to Service Bench."
```

### test
- using pytest
    - run all
        pytest test/
    - coverage
        pytest test/ --junitxml=./coverage/out_report.xml
        coverage run -m pytest test/
        coverage html
- skip coverage
        add next to func def, or condition etc # pragma: no cover

### connect to Claude Desktop (local dev)
1. Start the server: `python main.py`
2. Open Claude Desktop → **Settings** → **Developer** → **Edit Config**
3. Add to `claude_desktop_config.json`:
```json
{
  "mcpServers": {
    "my-mcp-server": {
      "url": "http://localhost:8080/mcp",
      "transport": "streamable-http"
    }
  }
}
```
4. Restart Claude Desktop — your tools will appear in the interface.

### verify server is running
```shell
# list registered MCP tools
curl -X POST http://localhost:8080/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}'

# liveness probe
curl http://localhost:8080/q/health/live

# readiness probe
curl http://localhost:8080/q/health/ready
```

### logging
- refer to https://confluence.global.standardchartered.com/display/RTEC/GF+CATALYST+-+Observability+-+App+Logging+Standardization

### deploy to local vm
```shell
./faas-cli.sh run
```
