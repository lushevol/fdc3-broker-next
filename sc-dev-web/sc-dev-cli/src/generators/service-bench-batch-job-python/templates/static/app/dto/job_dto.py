from enum import Enum
from dataclasses import dataclass, field
from typing import Optional, List
from datetime import datetime

from dataclasses_json import dataclass_json

class JobStatus(str, Enum):
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"
    CANCELLED = "CANCELLED"
    RUNNING = "RUNNING"

class JobDefinitionStatus(str, Enum):
    ACTIVE = "ACTIVE"
    SUSPENDED = "SUSPENDED"
    DELETED = "DELETED"

class JobLogDto:
    description: str
    createdDate: datetime

@dataclass_json
@dataclass
class JobDto:
    jobDefinitionId: int
    jobDefinitionStatus: JobDefinitionStatus
    jobId: Optional[str] = None
    forceStop: Optional[bool] = False

    jobStatus: Optional[JobStatus] = None
    executionReferenceId: Optional[str] = None
    result: Optional[str] = None
    jobLogs: List[JobLogDto] = field(default_factory=list)
