from __future__ import annotations

from pathlib import Path


ROOT = Path("/home/cloud/workspace/python/LMS-coding-platform/docs/ui")


def box(width: int, lines: list[str]) -> str:
    width = max(width, max((len(line) for line in lines), default=0) + 2)
    top = "┌" + "─" * width + "┐"
    bottom = "└" + "─" * width + "┘"
    body = []
    for line in lines:
        body.append("│" + line.ljust(width) + "│")
    return "\n".join([top, *body, bottom])


def center(text: str, width: int) -> str:
    if len(text) >= width:
        return text[:width]
    left = (width - len(text)) // 2
    right = width - len(text) - left
    return " " * left + text + " " * right


def row(left: str, right: str, left_w: int = 18, right_w: int = 44) -> str:
    left = left[:left_w].ljust(left_w)
    right = right[:right_w].ljust(right_w)
    return f"│ {left}│ {right}│"


def compose(header: str, body: list[str], footer: str | None = None, width: int = 66) -> str:
    inner = width - 2
    lines = ["┌" + "─" * inner + "┐"]
    lines.append(f"│{center(header, inner)}│")
    lines.append("├" + "─" * inner + "┤")
    lines.extend(body)
    if footer is not None:
        lines.append("├" + "─" * inner + "┤")
        lines.append(f"│{center(footer, inner)}│")
    lines.append("└" + "─" * inner + "┘")
    return "\n".join(lines)


def full_width(label: str, width: int = 66) -> str:
    return f"│{center(label, width - 2)}│"


def split_view(left: str, right: str, footer: str | None = None) -> str:
    width = 66
    lines = ["┌" + "─" * (width - 2) + "┐"]
    lines.append(full_width("HEADER", width))
    lines.append("├" + "─" * (width - 2) + "┤")
    for idx, (l, r) in enumerate(zip(left.split("\n"), right.split("\n"))):
        if idx == 0:
            lines.append(f"│ {l.ljust(16)}│ {r.ljust(44)}│")
        else:
            lines.append(f"│ {l.ljust(16)}│ {r.ljust(44)}│")
    if footer:
        lines.append("├" + "─" * (width - 2) + "┤")
        lines.append(full_width(footer, width))
    lines.append("└" + "─" * (width - 2) + "┘")
    return "\n".join(lines)


def auth_layout(title: str) -> str:
    return compose(
        title,
        [
            "│ ┌──────────────────────────────┐ ┌──────────────────────────┐ │",
            "│ │ LEFT BACKGROUND              │ │ RIGHT BACKGROUND         │ │",
            "│ │ illustration / accent panel   │ │ form surface / card      │ │",
            "│ └──────────────────────────────┘ └──────────────────────────┘ │",
            "│ ┌──────────────────────────────┐ ┌──────────────────────────┐ │",
            "│ │ ILLUSTRATION CONTAINER       │ │ LOGO + BACK CONTAINER    │ │",
            "│ │ large art / decorative block │ │ logo / back navigation   │ │",
            "│ └──────────────────────────────┘ └──────────────────────────┘ │",
            "│ ┌────────────────────────────────────────────────────────────┐ │",
            "│ │ WELCOME SECTION: title / helper text / inputs / CTA / err  │ │",
            "│ └────────────────────────────────────────────────────────────┘ │",
        ],
    )


def dashboard_layout(title: str, sidebar: str = "SIDEBAR", main: str = "MAIN CONTENT") -> str:
    return compose(
        title,
        [
            "│ HEADER                                                       │",
            "│ PAGE TITLE                                                   │",
            "│ ┌──────────────────────────┐ ┌─────────────────────────────┐ │",
            f"│ │ {sidebar.ljust(24)}│ │ {main.ljust(27)}│ │",
            "│ │ profile / nav / filters  │ │ cards / charts / tables    │ │",
            "│ │ quick actions / summary   │ │ detail panes / bottom area │ │",
            "│ └──────────────────────────┘ └─────────────────────────────┘ │",
        ],
        footer="FOOTER",
    )


def catalog_layout(title: str, aside: str = "FILTERS", content: str = "CARD GRID") -> str:
    return compose(
        title,
        [
            "│ HEADER                                                       │",
            "│ PAGE TITLE                                                   │",
            "│ ┌──────────────────────────┐ ┌─────────────────────────────┐ │",
            f"│ │ {aside.ljust(24)}│ │ {content.ljust(27)}│ │",
            "│ │ search / filter / sort   │ │ article / card grid         │ │",
            "│ │ price / tags / checkboxes│ │ empty state / pagination    │ │",
            "│ └──────────────────────────┘ └─────────────────────────────┘ │",
            "│ REVIEWS / PAGINATION / FOOTER                                │",
        ],
        footer="FOOTER",
    )


def workspace_layout(title: str, left: str, right: str) -> str:
    return compose(
        title,
        [
            "│ HEADER                                                       │",
            "│ PAGE TITLE / TOP CONTROLS                                    │",
            "│ ┌──────────────────────────┐ ┌─────────────────────────────┐ │",
            f"│ │ {left.ljust(24)}│ │ {right.ljust(27)}│ │",
            "│ │ navigation / tree        │ │ editor / preview / review  │ │",
            "│ │ toolbar / tabs / filters  │ │ submit / run / actions     │ │",
            "│ └──────────────────────────┘ └─────────────────────────────┘ │",
            "│ BOTTOM ACTION BAR / FOOTER                                   │",
        ],
        footer="FOOTER",
    )


def single_panel_layout(title: str, panel: str = "MAIN PANEL", footer: bool = True) -> str:
    return compose(
        title,
        [
            "│ HEADER / PAGE TITLE                                          │",
            "│ ┌───────────────────────────────────────────────────────────┐ │",
            f"│ │ {panel.ljust(57)}│ │",
            "│ │ content blocks / cards / tables / forms / detail panels   │ │",
            "│ │ preserve Figma layer order in the grouped section stack   │ │",
            "│ └───────────────────────────────────────────────────────────┘ │",
        ],
        footer="FOOTER" if footer else None,
    )


def home_layout(title: str) -> str:
    return compose(
        title,
        [
            "│ HERO / NAV / BRANDING                                        │",
            "│ ┌───────────────────────────────────────────────────────────┐ │",
            "│ │ main container / hero / call to action                    │ │",
            "│ └───────────────────────────────────────────────────────────┘ │",
            "│ ┌───────────────────────────────────────────────────────────┐ │",
            "│ │ feature bands / course grids / testimonials               │ │",
            "│ └───────────────────────────────────────────────────────────┘ │",
            "│ ┌───────────────────────────────────────────────────────────┐ │",
            "│ │ blog / favorites / footer / support blocks               │ │",
            "│ └───────────────────────────────────────────────────────────┘ │",
        ],
        footer="FOOTER",
    )


def teacher_dashboard_layout(title: str) -> str:
    return compose(
        title,
        [
            "│ HEADER                                                       │",
            "│ PAGE TITLE                                                   │",
            "│ ┌──────────────────────────┐ ┌─────────────────────────────┐ │",
            "│ │ PROFILE COMPONENT        │ │ DASHBOARD SUMMARY           │ │",
            "│ │ INSTRUCTOR SIDEBAR       │ │ revenue / students / courses│ │",
            "│ │ nav / avatar / role      │ │ charts / tables / actions   │ │",
            "│ └──────────────────────────┘ └─────────────────────────────┘ │",
            "│ space-y-6 SECTION STACK / FOOTER                            │",
        ],
        footer="FOOTER",
    )


def student_dashboard_layout(title: str) -> str:
    return compose(
        title,
        [
            "│ HEADER                                                       │",
            "│ PAGE TITLE                                                   │",
            "│ ┌──────────────────────────┐ ┌─────────────────────────────┐ │",
            "│ │ PROFILE COMPONENT - STUDENT│ │ STUDENT DASHBOARD         │ │",
            "│ │ STUDENT SIDEBAR           │ │ heatmap / progress / cards │ │",
            "│ │ avatar / nav / stats      │ │ recent activity / sections │ │",
            "│ └──────────────────────────┘ └─────────────────────────────┘ │",
            "│ bottom sections / footer                                      │",
        ],
        footer="FOOTER",
    )


def student_profile_layout(title: str) -> str:
    return compose(
        title,
        [
            "│ HEADER                                                       │",
            "│ PAGE TITLE                                                   │",
            "│ ┌───────────────────────────────────────────────────────────┐ │",
            "│ │ PROFILE COMPONENT - STUDENT                               │ │",
            "│ │ editable fields / stats / avatar / save actions           │ │",
            "│ └───────────────────────────────────────────────────────────┘ │",
        ],
        footer="FOOTER",
    )


def student_favorites_layout(title: str) -> str:
    return compose(
        title,
        [
            "│ HEADER                                                       │",
            "│ PAGE TITLE                                                   │",
            "│ ┌───────────────────────────────────────────────────────────┐ │",
            "│ │ FILTER / SORT STRIP                                        │ │",
            "│ ├───────────────────────────────────────────────────────────┤ │",
            "│ │ ARTICLE CARDS / FAVORITE ITEMS                              │ │",
            "│ │ each card: thumbnail / title / meta / remove action        │ │",
            "│ ├───────────────────────────────────────────────────────────┤ │",
            "│ │ BOTTOM SECTION                                             │ │",
            "│ └───────────────────────────────────────────────────────────┘ │",
        ],
        footer="FOOTER",
    )


def course_detail_layout(title: str) -> str:
    return compose(
        title,
        [
            "│ HEADER                                                       │",
            "│ ┌───────────────────────────────────────────────────────────┐ │",
            "│ │ BACKGROUND + HERO IMAGE / HEADER STRIP                    │ │",
            "│ ├───────────────────────────────────────────────────────────┤ │",
            "│ │ DETAILS                                                     │ │",
            "│ │ course title / teacher / CTA / price / summary             │ │",
            "│ ├───────────────────────────────────────────────────────────┤ │",
            "│ │ TABPANEL / CONTENT AREAS                                   │ │",
            "│ │ overview / curriculum / reviews                            │ │",
            "│ └───────────────────────────────────────────────────────────┘ │",
        ],
        footer="FOOTER",
    )


def course_catalog_layout(title: str) -> str:
    return compose(
        title,
        [
            "│ HEADER                                                       │",
            "│ PAGE TITLE                                                   │",
            "│ ┌──────────────────────────┐ ┌─────────────────────────────┐ │",
            "│ │ ASIDE                    │ │ ARTICLE GRID                │ │",
            "│ │ search / tags / price    │ │ multiple course cards       │ │",
            "│ │ filters / sort / rating   │ │ pagination / empty state    │ │",
            "│ └──────────────────────────┘ └─────────────────────────────┘ │",
            "│ RANGE SECTION / REVIEWS SECTION / PAGINATION                │",
        ],
        footer="FOOTER",
    )


def oj_problem_list_layout(title: str) -> str:
    return compose(
        title,
        [
            "│ TOP ANNOUNCEMENT BAR                                         │",
            "│ HEADER                                                       │",
            "│ PAGE BANNER                                                  │",
            "│ ┌──────────────────────────┐ ┌─────────────────────────────┐ │",
            "│ │ PAGE CONTENT CONTAINER   │ │ problem filters / tags      │ │",
            "│ │ problem table / cards    │ │ search / sort / difficulty  │ │",
            "│ └──────────────────────────┘ └─────────────────────────────┘ │",
            "│ FOOTER                                                       │",
        ],
        footer="FOOTER",
    )


def home_layout(title: str, variant: str = "generic") -> str:
    if variant == "home-1":
        sections = [
            "Navigation",
            "Hero Section",
            "Top Courses & Categories",
            "Our Benefits",
        ]
    elif variant == "home-2":
        sections = [
            "Main Container",
            "Favourite Course",
            "Testimonials Section",
            "Blog Section",
        ]
    elif variant == "home-3":
        sections = [
            "Background",
            "Container / heart / feature blocks",
            "Main Container stack",
        ]
    elif variant == "home-4":
        sections = [
            "Ornament / decorative layer",
            "View all Courses",
            "Main Container blocks",
            "Footer",
        ]
    elif variant == "home-5":
        sections = [
            "Navbar / Header",
            "Courses Container",
            "Main Container blocks",
        ]
    elif variant == "home-6":
        sections = [
            "Navbar / Footer",
            "Main Container blocks",
            "Supporting containers",
        ]
    else:
        sections = [
            "Hero / Main container",
            "Feature bands",
            "Secondary content",
        ]
    body = ["│ HERO / NAV / BRANDING                                        │"]
    for section in sections:
        body.extend([
            "│ ┌───────────────────────────────────────────────────────────┐ │",
            f"│ │ {section.ljust(57)}│ │",
            "│ └───────────────────────────────────────────────────────────┘ │",
        ])
    return compose(title, body, footer="FOOTER")


def instructor_layout(title: str) -> str:
    return compose(
        title,
        [
            "│ HEADER                                                       │",
            "│ PAGE TITLE                                                   │",
            "│ ┌──────────────────────────┐ ┌─────────────────────────────┐ │",
            "│ │ FILTER PANEL             │ │ INSTRUCTOR GRID / LIST      │ │",
            "│ │ categories / search      │ │ cards / profile detail      │ │",
            "│ │ sort / checkbox filters   │ │ actions / pagination        │ │",
            "│ └──────────────────────────┘ └─────────────────────────────┘ │",
        ],
        footer="FOOTER",
    )


def auth_screen_layout(title: str) -> str:
    return auth_layout(title)


def section_header(title: str, route: str, diagram: str) -> str:
    return f"# {title}\n\nRoute: {route}\n\nWireframe\n```text\n{diagram}\n```\n"


SECTIONS = [
    ("instructors", [
        ("Instructor Grid", "/instructors", instructor_layout),
        ("Instructor List", "/instructors/list", instructor_layout),
        ("Instructor Details", "/instructors/:id", instructor_layout),
    ]),
    ("std", [
        ("STD-01 _ Student Dashboard", "/student/dashboard", student_dashboard_layout),
        ("STD-03 _ Student Dashboard Profile", "/student/profile", student_profile_layout),
        ("STD-05 _ Student Favorites", "/student/favorites", student_favorites_layout),
        ("STD-02 _ Student Dashboard Enrolled Course", "/student/enrolled-courses", student_dashboard_layout),
        ("Student - Dashbaord - My Quiz Attempts", "/student/quiz-attempts", student_favorites_layout),
        ("Main", "N/A", single_panel_layout),
    ]),
    ("class", [
        ("CLASS-01", "/classroom/:courseId", workspace_layout),
    ]),
    ("quiz", [
        ("QUIZ-01 _ Quiz Attempt", "/quizzes/:quizId/attempt", workspace_layout),
        ("QUIZ-02 _ Quiz Preview", "/quizzes/:quizId/preview", single_panel_layout),
    ]),
    ("prog", [
        ("PROG-01.1 _ Problem Preview", "/problems/:slug", workspace_layout),
        ("PROG-01.3 _ Problem Preview _ Video", "/problems/:slug/video", workspace_layout),
        ("PROG-01.2 _ Problem Preview_Reading", "/problems/:slug/reading", workspace_layout),
    ]),
    ("auth-01", [
        ("Teacher Registration", "/teacher/register", auth_screen_layout),
    ]),
    ("ad", [
        ("AD - 01", "/admin/teacher-applications/:id", single_panel_layout),
    ]),
    ("pay", [
        ("PAY-02_Check Out", "/checkout", single_panel_layout),
        ("PAY-01_Shopping Cart", "/cart", single_panel_layout),
    ]),
    ("tc", [
        ("TC-02_Teacher Profile", "/teacher/profile", single_panel_layout),
        ("TC-03_View Student", "/teacher/students", dashboard_layout),
        ("TC-04_Earnings", "/teacher/earnings", dashboard_layout),
        ("TC-01_Teacher Dashboard", "/teacher/dashboard", teacher_dashboard_layout),
        ("TC-05_Teacher Course Enrollment", "/teacher/courses/:courseId/enrollments", workspace_layout),
        ("TC-06_Teacher Lesson Content Builder", "/teacher/lesson-contents/builder", workspace_layout),
        ("TC-07_Teacher_Curriculum_Reorder", "/teacher/courses/:courseId/curriculum/reorder", workspace_layout),
        ("TC-08_Teacher_Submission_Review", "/teacher/submissions/:submissionId", workspace_layout),
        ("TC-09_Teacher_Student_Progress", "/teacher/courses/:courseId/students/:studentId/progress", workspace_layout),
        ("TC-10_Teacher_Course_Students", "/teacher/courses/:courseId/students", single_panel_layout),
        ("TC-11_Teacher_Course_Builder", "/teacher/courses/builder/:courseId", single_panel_layout),
        ("TC-13_Teacher_Lesson_Content_Preview", "/teacher/lesson-contents/:id/preview", single_panel_layout),
        ("TC-14_Teacher_Coding_Problem_Management", "/teacher/problems", single_panel_layout),
    ]),
    ("oj", [
        ("OJ-01 _ Problem List", "/problems", oj_problem_list_layout),
        ("OJ-02 _ Online Judge Workspace", "/problems/:slug/workspace", workspace_layout),
        ("OJ-03 _ Submission History", "/submissions", single_panel_layout),
        ("OJ-03 _ Submission History", "/submissions/:id", single_panel_layout),
        ("Submission History Detail", "/submissions/:id/detail", single_panel_layout),
    ]),
    ("int", [
        ("INT-01_AI Interview", "/interview", workspace_layout),
        ("INT-02_Interview Report", "/interview/:id/report", dashboard_layout),
    ]),
    ("homepages", [
        ("Home Page 1", "/home-page-1", lambda t: home_layout(t, "home-1")),
        ("Home Page 2", "/home-page-2", lambda t: home_layout(t, "home-2")),
        ("Home Page 3", "/home-page-3", lambda t: home_layout(t, "home-3")),
        ("Home Page 4", "/home-page-4", lambda t: home_layout(t, "home-4")),
        ("Home Page 5", "/home-page-5", lambda t: home_layout(t, "home-5")),
        ("Home Page 6", "/home-page-6", lambda t: home_layout(t, "home-6")),
    ]),
    ("course", [
        ("COURSE-01 _ Course Catalog", "/courses", course_catalog_layout),
        ("COURSE-01.1 _ Empty State", "/courses", course_catalog_layout),
        ("COURSE-02 _ Course Detail", "/courses/:slug", course_detail_layout),
        ("COURSE-02.1", "/courses/:slug/overview", course_detail_layout),
        ("COURSE-02.2", "/courses/:slug/curriculum", course_detail_layout),
        ("COURSE-03.3", "/courses/:slug/reviews", course_detail_layout),
    ]),
    ("auth-02-student-registration", [
        ("Login", "/auth/login", auth_screen_layout),
        ("Register", "/auth/register", auth_screen_layout),
        ("Forgot Password", "/auth/forgot-password", auth_screen_layout),
        ("Set Password", "/auth/reset-password", auth_screen_layout),
        ("Lock Screen", "/auth/lock", auth_screen_layout),
    ]),
    ("auth-03-otp-verification", [
        ("OTP", "/auth/verify-otp", auth_screen_layout),
    ]),
]


def main() -> None:
    for folder, items in SECTIONS:
        for title, route, builder in items:
            path = ROOT / folder / f"{title.lower().replace(' ', '-').replace('/', '-').replace(':', '').replace('_', '').replace('--', '-')}.md"
            if title == "Main":
                path = ROOT / folder / "main.md"
            elif title == "Instructor Grid":
                path = ROOT / folder / "instructor-grid.md"
            elif title == "Instructor List":
                path = ROOT / folder / "instructor-list.md"
            elif title == "Instructor Details":
                path = ROOT / folder / "instructor-details.md"
            elif title == "Student - Dashbaord - My Quiz Attempts":
                path = ROOT / folder / "student-dashboard-my-quiz-attempts.md"
            elif title == "STD-01 _ Student Dashboard":
                path = ROOT / folder / "std-01-student-dashboard.md"
            elif title == "STD-03 _ Student Dashboard Profile":
                path = ROOT / folder / "std-03-student-dashboard-profile.md"
            elif title == "STD-05 _ Student Favorites":
                path = ROOT / folder / "std-05-student-favorites.md"
            elif title == "STD-02 _ Student Dashboard Enrolled Course":
                path = ROOT / folder / "std-02-student-dashboard-enrolled-course.md"
            elif title == "CLASS-01":
                path = ROOT / folder / "class-01.md"
            elif title == "QUIZ-01 _ Quiz Attempt":
                path = ROOT / folder / "quiz-01-quiz-attempt.md"
            elif title == "QUIZ-02 _ Quiz Preview":
                path = ROOT / folder / "quiz-02-quiz-preview.md"
            elif title == "PROG-01.1 _ Problem Preview":
                path = ROOT / folder / "prog-01-1-problem-preview.md"
            elif title == "PROG-01.3 _ Problem Preview _ Video":
                path = ROOT / folder / "prog-01-3-problem-preview-video.md"
            elif title == "PROG-01.2 _ Problem Preview_Reading":
                path = ROOT / folder / "prog-01-2-problem-preview-reading.md"
            elif title == "Teacher Registration":
                path = ROOT / folder / "teacher-registration.md"
            elif title == "AD - 01":
                path = ROOT / folder / "ad-01.md"
            elif title == "PAY-02_Check Out":
                path = ROOT / folder / "pay-02-check-out.md"
            elif title == "PAY-01_Shopping Cart":
                path = ROOT / folder / "pay-01-shopping-cart.md"
            elif title == "TC-02_Teacher Profile":
                path = ROOT / folder / "tc-02-teacher-profile.md"
            elif title == "TC-03_View Student":
                path = ROOT / folder / "tc-03-view-student.md"
            elif title == "TC-04_Earnings":
                path = ROOT / folder / "tc-04-earnings.md"
            elif title == "TC-01_Teacher Dashboard":
                path = ROOT / folder / "tc-01-teacher-dashboard.md"
            elif title == "TC-05_Teacher Course Enrollment":
                path = ROOT / folder / "tc-05-teacher-course-enrollment.md"
            elif title == "TC-06_Teacher Lesson Content Builder":
                path = ROOT / folder / "tc-06-teacher-lesson-content-builder.md"
            elif title == "TC-07_Teacher_Curriculum_Reorder":
                path = ROOT / folder / "tc-07-teacher-curriculum-reorder.md"
            elif title == "TC-08_Teacher_Submission_Review":
                path = ROOT / folder / "tc-08-teacher-submission-review.md"
            elif title == "TC-09_Teacher_Student_Progress":
                path = ROOT / folder / "tc-09-teacher-student-progress.md"
            elif title == "TC-10_Teacher_Course_Students":
                path = ROOT / folder / "tc-10-teacher-course-students.md"
            elif title == "TC-11_Teacher_Course_Builder":
                path = ROOT / folder / "tc-11-teacher-course-builder.md"
            elif title == "TC-13_Teacher_Lesson_Content_Preview":
                path = ROOT / folder / "tc-13-teacher-lesson-content-preview.md"
            elif title == "TC-14_Teacher_Coding_Problem_Management":
                path = ROOT / folder / "tc-14-teacher-coding-problem-management.md"
            elif title == "OJ-01 _ Problem List":
                path = ROOT / folder / "oj-01-problem-list.md"
            elif title == "OJ-02 _ Online Judge Workspace":
                path = ROOT / folder / "oj-02-online-judge-workspace.md"
            elif title == "OJ-03 _ Submission History" and route == "/submissions":
                path = ROOT / folder / "oj-03-submission-history.md"
            elif title == "OJ-03 _ Submission History" and route == "/submissions/:id":
                path = ROOT / folder / "oj-03-submission-history-variant.md"
            elif title == "Submission History Detail":
                path = ROOT / folder / "oj-03-submission-history-detail.md"
            elif title == "INT-01_AI Interview":
                path = ROOT / folder / "int-01-ai-interview.md"
            elif title == "INT-02_Interview Report":
                path = ROOT / folder / "int-02-interview-report.md"
            elif title.startswith("Home Page "):
                path = ROOT / folder / f"home-page-{title.split()[-1].lower()}.md"
            elif title == "COURSE-01 _ Course Catalog":
                path = ROOT / folder / "course-01-course-catalog.md"
            elif title == "COURSE-01.1 _ Empty State":
                path = ROOT / folder / "course-01-1-empty-state.md"
            elif title == "COURSE-02 _ Course Detail":
                path = ROOT / folder / "course-02-course-detail.md"
            elif title == "COURSE-02.1":
                path = ROOT / folder / "course-02-1.md"
            elif title == "COURSE-02.2":
                path = ROOT / folder / "course-02-2.md"
            elif title == "COURSE-03.3":
                path = ROOT / folder / "course-03-3.md"
            elif title == "Login":
                path = ROOT / folder / "login.md"
            elif title == "Register":
                path = ROOT / folder / "register.md"
            elif title == "Forgot Password":
                path = ROOT / folder / "forgot-password.md"
            elif title == "Set Password":
                path = ROOT / folder / "set-password.md"
            elif title == "Lock Screen":
                path = ROOT / folder / "lock-screen.md"
            elif title == "OTP":
                path = ROOT / folder / "otp.md"
            else:
                raise RuntimeError(f"Unhandled title: {title}")

            path.parent.mkdir(parents=True, exist_ok=True)
            if builder is workspace_layout:
                left = "NAV / TREE"
                right = "EDITOR / PREVIEW"
                if title in {"QUIZ-01 _ Quiz Attempt"}:
                    left, right = "QUESTION NAV", "QUIZ WORKSPACE"
                elif title.startswith("PROG-01."):
                    left, right = "PROBLEM SIDEBAR", "CONTENT / CODE / VIDEO"
                elif title == "CLASS-01":
                    left, right = "CURRICULUM SIDEBAR", "LESSON CONTENT"
                elif title.startswith("TC-05_"):
                    left, right = "ENROLLMENT LIST", "DETAIL / STATUS PANEL"
                elif title.startswith("TC-06_"):
                    left, right = "CONTENT TEMPLATES", "EDITOR / DRAFT PANEL"
                elif title.startswith("TC-07_"):
                    left, right = "CURRICULUM TREE", "REORDER WORKSPACE"
                elif title.startswith("TC-08_"):
                    left, right = "SUBMISSION LIST", "REVIEW PANEL"
                elif title.startswith("TC-09_"):
                    left, right = "STUDENT LIST", "PROGRESS DASHBOARD"
                elif title.startswith("INT-01_"):
                    left, right = "QUESTION ROUTER", "CHAT WORKSPACE"
                diagram = builder(title, left, right)
            elif builder is single_panel_layout:
                panel = "CONTENT / DETAIL / STATE"
                if title == "AD - 01":
                    panel = "ADMIN REVIEW CONTENT"
                elif title in {"PAY-02_Check Out", "PAY-01_Shopping Cart"}:
                    panel = "PAYMENT / CART CONTENT"
                elif title.startswith("TC-02_"):
                    panel = "TEACHER PROFILE TABLE"
                elif title.startswith("TC-10_"):
                    panel = "ENROLLED STUDENTS TABLE"
                elif title.startswith("TC-11_"):
                    panel = "COURSE BUILDER PANEL"
                elif title.startswith("TC-13_"):
                    panel = "LESSON PREVIEW PANEL"
                elif title.startswith("TC-14_"):
                    panel = "PROBLEM MANAGEMENT PANEL"
                elif title.startswith("OJ-03"):
                    panel = "SUBMISSION HISTORY PANEL"
                elif title == "QUIZ-02 _ Quiz Preview":
                    panel = "QUIZ PREVIEW PANEL"
                diagram = builder(title, panel)
            else:
                diagram = builder(title)
            text = section_header(title, route, diagram)
            path.write_text(text, encoding="utf-8")

    readme = ROOT / "README.md"
    readme.write_text(
        "# UI Wireframes\n\n"
        "Tat ca file trong thu muc nay la wireframe markdown dung ky hieu khhoi de mo ta bo cuc tu Figma.\n"
        "Moi file co format:\n\n"
        "```text\n"
        "Ten man hinh\n"
        "Route: ...\n"
        "Wireframe\n"
        "┌─...─┐\n"
        "│ ... │\n"
        "└─...─┘\n"
        "```\n\n"
        f"Tong so man hinh: {sum(len(items) for _, items in SECTIONS)}\n",
        encoding="utf-8",
    )


if __name__ == "__main__":
    main()
