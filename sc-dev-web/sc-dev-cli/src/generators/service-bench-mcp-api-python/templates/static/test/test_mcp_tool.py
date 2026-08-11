"""
Tests for time_tool — mirrors McpToolTest.java in the Java MCP template.

Run with:
    pytest test/
    pytest test/ --junitxml=./coverage/out_report.xml
    coverage run -m pytest test/ && coverage html
"""
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from datetime import datetime
from app.tools.time_tool import get_server_time, get_time_with_timezone


class TestGetServerTime:
    def test_returns_iso8601_string(self):
        result = get_server_time()
        # Should parse without raising an exception
        parsed = datetime.fromisoformat(result)
        assert parsed is not None

    def test_includes_timezone_info(self):
        result = get_server_time()
        parsed = datetime.fromisoformat(result)
        assert parsed.tzinfo is not None


class TestGetTimeWithTimeZone:
    def test_valid_timezone_asia_singapore(self):
        result = get_time_with_timezone("Asia/Singapore")
        parsed = datetime.fromisoformat(result)
        assert parsed is not None

    def test_valid_timezone_america_new_york(self):
        result = get_time_with_timezone("America/New_York")
        parsed = datetime.fromisoformat(result)
        assert parsed is not None

    def test_invalid_timezone_returns_error_message(self):
        result = get_time_with_timezone("Invalid/Timezone")
        # Should return an error string, not raise an exception
        assert isinstance(result, str)
        assert len(result) > 0
