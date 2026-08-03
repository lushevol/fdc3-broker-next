import sys
import os
# Add the parent directory to the system path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
# Now you can import app
from main import app
import unittest

class APITestCase(unittest.TestCase):
   def setUp(self):
       # Set up the test client before each test.
       self.client = app.test_client()
       self.client.testing = True

   def test_get_object_by_id(self):
       os.environ['DOMAIN_JOB_ITAM'] = '55313'
       os.environ['DOMAIN_JOB_NAME'] = 'my-job'
       os.environ['PING_SOURCE_NAME'] = 'test_ping_source'

       # Test the GET /
       response = self.client.post("/", json={
           "jobId": 123,
           "forceStop": False,
           "jobDefinitionId": 456,
           "jobDefinitionStatus": "ACTIVE",
           "jobStatus": "RUNNING"
       }, headers = {
           "Ce-Id": "1234",
           "Ce-Specversion": "1.0",
           "ce-type": "55313-my-job-taska",
           "ce-source": "/apis/v1/namespaces/test_itam/pingsources/test_ping_source"
       })
       self.assertEqual(response.status_code, 200)
       self.assertEqual(response.json["jobStatus"], "COMPLETED")
       self.assertEqual(response.headers["ce-type"], "55313-my-job")

if __name__ == '__main__':
   unittest.main()