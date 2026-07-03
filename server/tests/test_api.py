import os
import sys
from datetime import datetime
from unittest.mock import MagicMock, patch

# Add the server directory to python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

import unittest
from fastapi.testclient import TestClient
from app.main import app

class TestAPIEndpoints(unittest.TestCase):
    
    def setUp(self):
        self.client = TestClient(app)

    def test_root_endpoint(self):
        """Test that the API root endpoint returns a status online message."""
        response = self.client.get("/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["status"], "online")

    @patch("app.routers.freelancers.get_db_cursor")
    def test_create_freelancer_success(self, mock_db_cursor):
        """Test successful freelancer onboarding API endpoint with valid data."""
        # Setup mock database response
        mock_cursor = MagicMock()
        mock_cursor.fetchone.return_value = (1, datetime.now())
        mock_db_cursor.return_value.__enter__.return_value = mock_cursor

        payload = {
            "name": "Arjun Dev",
            "email": "arjun.dev@example.com",
            "linkedin_url": "https://www.linkedin.com/in/arjun-dev",
            "primary_skill": "Machine Learning",
            "experience": 4,
            "hourly_rate": 55.00
        }

        response = self.client.post("/api/freelancers/", json=payload)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json()["name"], "Arjun Dev")
        self.assertEqual(response.json()["email"], "arjun.dev@example.com")
        self.assertEqual(response.json()["id"], 1)

    def test_create_freelancer_invalid_email(self):
        """Test freelancer onboarding API validation errors for invalid emails."""
        payload = {
            "name": "Arjun Dev",
            "email": "not-an-email",
            "linkedin_url": "https://www.linkedin.com/in/arjun-dev",
            "primary_skill": "Machine Learning",
            "experience": 4,
            "hourly_rate": 55.00
        }
        response = self.client.post("/api/freelancers/", json=payload)
        self.assertEqual(response.status_code, 422)  # Unprocessable Entity (Validation Error)

    def test_create_freelancer_invalid_linkedin(self):
        """Test freelancer onboarding API validation errors for invalid LinkedIn URLs."""
        payload = {
            "name": "Arjun Dev",
            "email": "arjun@example.com",
            "linkedin_url": "https://www.facebook.com/arjun",  # Invalid platform
            "primary_skill": "Machine Learning",
            "experience": 4,
            "hourly_rate": 55.00
        }
        response = self.client.post("/api/freelancers/", json=payload)
        self.assertEqual(response.status_code, 422)

    @patch("app.routers.jobs.get_db_cursor")
    def test_create_job_success(self, mock_db_cursor):
        """Test successful client job posting API endpoint with valid data."""
        # Setup mock database response
        mock_cursor = MagicMock()
        mock_cursor.fetchone.return_value = (1, datetime.now())
        mock_db_cursor.return_value.__enter__.return_value = mock_cursor

        payload = {
            "title": "Need Python Developer",
            "description": "We need a Python developer to build custom FastAPI endpoints.",
            "budget": 45.00
        }

        response = self.client.post("/api/jobs/", json=payload)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json()["title"], "Need Python Developer")
        self.assertEqual(response.json()["id"], 1)

    def test_create_job_invalid_budget(self):
        """Test job creation validation errors for non-positive budget limits."""
        payload = {
            "title": "Need Python Developer",
            "description": "We need a Python developer to build custom FastAPI endpoints.",
            "budget": -10.00  # Invalid budget
        }
        response = self.client.post("/api/jobs/", json=payload)
        self.assertEqual(response.status_code, 422)

if __name__ == "__main__":
    unittest.main()
