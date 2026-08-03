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
       self.app = app.test_client()
       self.app.testing = True
   def test_get_object_by_id(self):
       # Test the GET /api/process/v1/objects/1 endpoint
       response = self.app.get('/api/process/v1/objects/1')
       self.assertEqual(response.status_code, 200)
       self.assertEqual(response.json, {"message": {"id": "1","name": "Hello World"},"status": "success"})

if __name__ == '__main__':
   unittest.main()