"""Run the finite Java replay using the existing verification build's classpath."""
import argparse
import os
from pathlib import Path
import subprocess
import xml.etree.ElementTree as ET

parser = argparse.ArgumentParser()
parser.add_argument("--input", type=Path, required=True)
parser.add_argument("--output", type=Path, required=True)
args = parser.parse_args()
directory = Path(__file__).resolve().parent
service = directory.parents[1]
reports = directory.parent / "target" / "surefire-reports"
report = next(reports.glob("TEST-*.xml"), None)
if report is None:
    parser.error("Run the verification build first to obtain its dependency classpath")
classpath = ET.parse(report).find("./properties/property[@name='java.class.path']").get("value")
java_home = os.environ.get("JAVA_HOME", "/opt/homebrew/opt/openjdk@17/libexec/openjdk.jdk/Contents/Home")
subprocess.run([
    str(Path(java_home) / "bin" / "java"), "--class-path", classpath,
    str(directory / "ScenarioReport.java"), str(args.input.resolve()),
    str(service / "src/main/resources/db/migration/V1_0_11__tile_entitlement_provider.sql"),
    str(args.output.resolve()),
], check=True, cwd=service)
