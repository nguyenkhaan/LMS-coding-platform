# Kiểm tra API route
## 3. Teacher Course & Curriculum Creator (`/api/teacher/courses`) 
### 3.1 

```text
   **`GET /api/teacher/courses`**
    *   *Description*: List courses owned/created by the teacher.  
    *   *Response*: List of courses with status (`DRAFT`, `PENDING_REVIEW`, `PUBLISHED`, `ARCHIVED`).  
```

* Về mặt database: Phù hợp, vì course.status đúng với CourseStatus
* Về mặt frontend có các vấn đề sau:
    * Response nên có dạng đặc tả như các dạng sau để FE có đủ thông tin hiển thị giao diện: 

    ```text
        Response:  
        [  
            {  
                id,  
                title,  
                slug,  
                thumbnail_url,  
                price,  
                status,  
                created_at,  
                updated_at  
            }  
        ]  
    ```

  hoặc đầy đủ hơn: 

    ```text
        Response:  
        [  
            {  
                id,  
                title,  
                slug,  
                description,  
                thumbnail_url,  
                field,  
                tags,  
                price,  
                rating,  
                status,  
                created_at,  
                updated_at   
            }   
        ]
    ```

**Đề xuất sửa:** (Giữ nguyên nhưng đảm bảo thông tin cho FE)

```text
    **`GET /api/teacher/courses`**
    *   *Description*: List courses owned/created by the teacher.  
    *   *Response*: List of courses with status (`DRAFT`, `PENDING_REVIEW`, `PUBLISHED`, `ARCHIVED`). 
```

---

### 3.2

```text
    **`POST /api/teacher/courses`**
    *   *Description*: Create a new course workspace.
    *   *Request Body*: `title`, `description`, `price`, `thumbnail_url`.
    *   *Response*: Course details with newly generated `id` and `slug`.
```

* Về các yêu cầu ở frontend:
    * Ở *Request*: so với Database thì trong Database còn có các trường *teacher_id*, *slug*, *field*, *tags*, *status*. 
    -> Vấn đề: thiếu *field (lĩnh vực)* và *tags* để mô tả lĩnh vực khóa học.  
    -> Khắc phục: nên thêm các trường đó vào *Request Body* nên sẽ có các trường sau: 

    ```text
        title  
        description  
        price  
        thumbnail_url  
        field  
        tags  
    ```

**Đề xuất sửa:**

```text
    **`POST /api/teacher/courses`**
    *   *Description*: Create a new course workspace.
    *   *Request Body*: `title`, `description`, `price`, `thumbnail_url`, `field`, `tags`.
    *   *Response*: Course details with newly generated `id` and `slug`.
```
---

### 3.3

```text
    **`PUT /api/teacher/courses/{id}`**
    *   *Description*: Edit metadata of a course.
    *   *Request Body*: `title`, `description`, `price`, `thumbnail_url`, `status`.
    *   *Response*: Updated course details.
```

Database còn các trường như *field* và *tags* cũng nên để vào để có thể update được. 
-> Giải quyết: Thêm hai trường nêu trên vào *Request Body* và *Response*. 

**Đề xuất sửa:**

```text
    **`PUT /api/teacher/courses/{id}`**
    *   *Description*: Edit metadata of a course.
    *   *Request Body*: `title`, `description`, `price`, `thumbnail_url`, `status`, `field`, `tags`.
    *   *Response*: Updated course details.
```
---

### 3.4 

```text
    **`POST /api/teacher/courses/{courseId}/sections`**
    *   *Description*: Add a new chapter section under a course.
    *   *Request Body*: `title`, `position`.
    *   *Response*: Section object details.
```

**Đề xuất sửa:** Đã ổn, giữ như cũ. 

---

### 3.5 

```text
    **`PUT /api/teacher/sections/{sectionId}`**
    *   *Description*: Edit or delete (cascade) section title or position.
    *   *Request Body*: `title`, `position`.
    *   *Response*: Updated section details.
```

Phần mô tả chưa phù hợp với ý nghĩa của HTTP Method được sử dụng. Theo chuẩn:
* PUT được sử dụng để cập nhật (Update) tài nguyên đã tồn tại.
* DELETE được sử dụng để xóa (Delete) tài nguyên.

Do đó, một endpoint sử dụng phương thức PUT không nên đồng thời đảm nhiệm chức năng xóa dữ liệu. Việc gộp cả hai chức năng vào cùng một API sẽ làm cho mục đích của endpoint không rõ ràng, gây khó khăn cho frontend khi tích hợp cũng như làm giảm tính nhất quán của hệ thống.

Nếu frontend muốn xóa section và đồng thời **cascade delete** toàn bộ dữ liệu phụ thuộc của section đó.

Vì vậy, API nên được tách thành hai endpoint với trách nhiệm rõ ràng: 
* PUT /api/teacher/sections/{sectionId}: Cập nhật thông tin của section (title, position).
* DELETE /api/teacher/sections/{sectionId}: Xóa section và thực hiện cascade đối với các dữ liệu phụ thuộc.

**Đề xuất sửa:** bổ sung API, cập nhật lại API cũ

```text
**`DELETE /api/teacher/sections/{sectionId}`**

* *Description*: Delete a section from a course. All lessons and lesson contents belonging to the section are deleted automatically through cascade deletion.
* *Path Parameter*:
    * `sectionId`: ID của section cần xóa.
* *Request Body*: Không có.
* *Response*:
{
  "message": "Section deleted successfully."
}

* *HTTP Status Codes*:
    * `200 OK`: Xóa thành công.
    * `404 Not Found`: Không tìm thấy section.
    * `403 Forbidden`: Người dùng không phải chủ sở hữu khóa học hoặc không có quyền xóa.
```

---

### 3.6 

```text
    **`POST /api/teacher/sections/{sectionId}/lessons`**
    *   *Description*: Create a new lesson unit under a section.
    *   *Request Body*: `title`, `summary`, `position`.
    *   *Response*: Lesson object details.
```

**Đề xuất sửa**: Đã ổn, giữ nguyên

---

### 3.7

```text 
    **`PUT /api/teacher/lessons/{lessonId}`**
    *   *Description*: Update lesson info.
    *   *Request Body*: `title`, `summary`, `position`.
    *   *Response*: Updated lesson details.
```

**Đề xuất sửa**: Đã ổn, giữ nguyên

---

### 3.8 

```text
    **`PUT /api/teacher/courses/{courseId}/curriculum/reorder`**
    *   *Description*: Batch update positions of all chapters and lessons simultaneously.
    *   *Request Body*: `reorder_data` (List of `{ item_type: "section"|"lesson", id: int, position: int, parent_id: int }`).
    *   *Response*: `message` (Success).
```
**Đề xuất sửa**: Đã ổn, giữ nguyên

---

### 3.9 

```text 
    **`POST /api/teacher/lessons/{lessonId}/contents`**
    *   *Description*: Create and bind content item (Reading material, Quiz, or Coding problem) to a lesson.
    *   *Request Body*: `content_type` (`READING`, `QUIZ`, `PROBLEM`), `content_id`, `media_url` (optional), `position`.
    *   *Response*: Content metadata details.
```
**Đề xuất sửa**: Đã ổn, giữ nguyên

---

### 3.10

```text 
    **`PUT /api/teacher/lesson-contents/{contentId}`**
    *   *Description*: Modify or delete a content item binding.
    *   *Request Body*: `media_url`, `position`.
    *   *Response*: Updated content details.
```

Về mặt Database thì đã khớp nhưng nếu phần mô tả ghi "Modify or delete" thì nên bổ sung thêm API DELETE. 

**Đề xuất sửa:** Có thể bổ sung thêm DELETE giống trường hợp trên. 

---

## 4. Online Judge (OJ) Problem & Run/Submit Engine (`/api/problems`, `/api/submissions`)
### 4.1

```text
    **`GET /api/problems`**
    *   *Description*: Public list of coding problems (OJ catalog).
    *   *Response*: List of problems (title, slug, difficulty, public status).
```
Đã khớp với Database.

**Đề xuất sửa:** Đã ổn, giữ nguyên

---

### 4.2 

```text 
    **`GET /api/problems/{slug}`**
    *   *Description*: Get detailed problem description statement and metadata.
    *   *Response*: `id`, `title`, `slug`, `statement`, `input_description`, `output_description`, `constraints`, `sample_input`, `sample_output`, `explanation`, `difficulty`.
```

**Đề xuất sửa:** Đã ổn, giữ nguyên

---

### 4.3 

```text 
    **`POST /api/problems/{slug}/run`**
    *   *Description*: Execute code in isolated sandbox against custom user input.
    *   *Request Body*: `source_code`, `language_id`, `stdin`.
    *   *Response*: `stdout`, `runtime_ms`, `memory_kb`, `compile_error`, `status` (`SUCCESS` or `ERROR`).
```

**Đề xuất sửa:** Đã ổn, giữ nguyên

---

### 4.4 

```text
    **`POST /api/problems/{slug}/submit`**
    *   *Description*: Submit code for final grading. Queues execution task to RabbitMQ.
    *   *Request Body*: `source_code`, `language_id`.
    *   *Response*: `submission_id`, `status` (`PENDING`).
```

**Đề xuất sửa:** Đã ổn, giữ nguyên

---

### 4.5 

```text
    **`GET /api/submissions/{submissionId}/status`**
    *   *Description*: Polling endpoint to check testcase execution progress and final results.
    *   *Response*: `status` (`PENDING`, `RUNNING`, `ACCEPTED`, `WRONG_ANSWER`, `TIME_LIMIT_EXCEEDED`, `MEMORY_LIMIT_EXCEEDED`, `RUNTIME_ERROR`, `COMPILE_ERROR`), `score`, `runtime_ms`, `memory_kb`, `details` (Array of testcase executions).
```

**Đề xuất sửa:** Đã ổn, giữ nguyên

---

### 4.6 

```text 
    **`POST /api/teacher/problems`**
    *   *Description*: Teacher creates a new problem template in the bank.
    *   *Request Body*: `title`, `statement`, `input_description`, `output_description`, `constraints`, `difficulty`, `public`.
    *   *Response*: Created problem details.
```

* Về Database: chưa khớp Database do thiếu các trường `sample_input`, `sample_output`, `explanation`. Các trường này rất quan trọng và frontend chắc chắn sẽ có editor cho chúng. 

**Đề xuất sửa:** sửa *Request Body*

```text
    **`POST /api/teacher/problems`**
    *   *Description*: Teacher creates a new problem template in the bank.
    *   *Request Body*: `title`, `statement`, `input_description`, `output_description`, `constraints`, `sample_input`, `sample_output`, `explanation`, `difficulty`, `public`.
    *   *Response*: Created problem details.
``` 

---

### 4.7 

```text
    **`POST /api/teacher/problems/{problemId}/testcases/upload`**
    *   *Description*: Upload testcase files in ZIP form (containing input/output pairs matching `input_xx.in` / `output_xx.out`).
    *   *Request Body*: Multipart Form Data with `.zip` file.
    *   *Response*: Count of uploaded testcases, confirmation message.
```

**Đề xuất sửa:** Đã ổn, giữ nguyên

---





