from src.app import app


def test_teacher_feature_routes_are_registered() -> None:
    teacher_paths = {
        path for path in app.openapi()["paths"] if path.startswith("/api/teacher")
    }

    assert {
        "/api/teacher/courses",
        "/api/teacher/courses/{course_id}/moderation-history",
        "/api/teacher/lessons/{lesson_id}/quizzes",
        "/api/teacher/problems/{problem_id}",
    } <= teacher_paths
    assert app.openapi()["paths"]["/api/teacher/lessons/{lesson_id}/contents"]["post"][
        "operationId"
    ].startswith("bind_lesson_content_")
