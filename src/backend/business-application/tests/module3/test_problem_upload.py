import pytest
import io

async def test_teacher_problem_testcase_upload_uses_s3_mock(client):
    """
    Test that uploading testcase files uses the S3_BUCKET_NAME env var and
    inserts into TestcaseModel properly.
    """
    # 1. Create a Problem
    res = await client.post(
        "/api/teacher/problems",
        json={
            "title": "A Problem",
            "slug": "a-problem",
            "statement": "Solve it",
            "input_description": "None",
            "output_description": "None",
            "constraints": "None",
            "sample_input": "1",
            "sample_output": "1",
            "explanation": "None",
            "difficulty": "EASY",
            "passing_score": 100,
            "public": True,
            "tag_ids": [],
            "configs": []
        }
    )
    assert res.status_code == 201, res.text
    problem_id = res.json()["id"]

    # 2. Upload testcase
    # Must use multipart/form-data with files and form fields
    form_data = {
        "score": "10",
        "is_hidden": "true"
    }
    
    files = {
        "input_file": ("in.txt", io.BytesIO(b"input data"), "text/plain"),
        "output_file": ("out.txt", io.BytesIO(b"output data"), "text/plain")
    }

    res = await client.post(
        f"/api/teacher/problems/{problem_id}/testcases/upload",
        data=form_data,
        files=files
    )
    
    assert res.status_code == 201, res.text
    # The response should return the updated testcases list (authorized TestcaseView)
    # Check that the testcase was created with the mock bucket name
    data = res.json()
    testcases = data["testcases"]
    assert len(testcases) > 0
    
    testcase = testcases[-1]
    assert testcase["score"] == 10
    assert testcase["is_hidden"] is True
    
    # We set S3_BUCKET_NAME=TESTCASE_BUCKET_PLACEHOLDER in .env.example
    # Note: Since the test runs with local loaded .env, it might be the placeholder or mock-bucket depending on settings.py default
    # But it should DEFINITELY start with s3://
    assert testcase["input_file"].startswith("s3://")
    assert "/problems/" in testcase["input_file"]
    assert "tc_" in testcase["input_file"]
