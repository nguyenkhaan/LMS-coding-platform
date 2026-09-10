import { Course } from '@/features/courses/model/course';

export const MOCK_CLASSROOM_COURSE: Course = {
	id: 101,
	title: 'Python Foundations: From Zero to Mastery',
	slug: 'python-basics',
	price: 49.99,
	status: 'APPROVED',
	teacherId: 1,
	teacherName: 'Alex Johnson',
	createdAt: '2026-08-01',
	sections: [
		{
			id: 1,
			courseId: 101,
			title: 'Chapter 1: Introduction to Python Syntax',
			position: 1,
			lessons: [
				{
					id: 11,
					sectionId: 1,
					title: '1.1 Environment Setup & Variables in Python',
					position: 1,
					contents: [
						{
							id: 111,
							lessonId: 11,
							contentType: 'READING',
							contentId: 1,
							position: 1,
							title: 'Reading: Variables & Data Types',
							isCompleted: true
						},
						{
							id: 112,
							lessonId: 11,
							contentType: 'PROBLEM',
							contentId: 2,
							position: 2,
							title: 'Practice: Reverse String Challenge',
							isCompleted: false
						}
					]
				},
				{
					id: 12,
					sectionId: 1,
					title: '1.2 Conditionals & Control Flow',
					position: 2,
					contents: [
						{
							id: 121,
							lessonId: 12,
							contentType: 'READING',
							contentId: 2,
							position: 1,
							title: 'Reading: If-Else & For-While Loops',
							isCompleted: false
						},
						{
							id: 122,
							lessonId: 12,
							contentType: 'QUIZ',
							contentId: 1,
							position: 2,
							title: 'Quiz: Control Flow Knowledge Check',
							isCompleted: false
						}
					]
				}
			]
		},
		{
			id: 2,
			courseId: 101,
			title: 'Chapter 2: Advanced Data Structures',
			position: 2,
			lessons: [
				{
					id: 21,
					sectionId: 2,
					title: '2.1 Lists, Tuples & Dictionaries',
					position: 1,
					contents: [
						{
							id: 211,
							lessonId: 21,
							contentType: 'READING',
							contentId: 3,
							position: 1,
							title: 'Reading: Memory Optimization with Sets & Dictionaries',
							isCompleted: false
						}
					]
				}
			]
		}
	]
};

export const MOCK_READING_CONTENT: Record<number, string> = {
	1: [
		'# Cấu Trúc Biến Và Kiểu Dữ Liệu Trong Python',
		'',
		'Trong Python, bạn không cần phải khai báo kiểu dữ liệu một cách tường minh. Kiểu dữ liệu sẽ được tự động suy diễn khi bạn gán giá trị cho biến.',
		'',
		'## 1. Các kiểu dữ liệu cơ bản',
		'- **Số nguyên (int):** `age = 25`',
		'- **Số thực (float):** `pi = 3.14159`',
		'- **Chuỗi (str):** `name = "SkillBoost"`',
		'- **Boolean (bool):** `is_active = True`',
		'',
		'## 2. Quy tắc đặt tên biến',
		'- Tên biến phải bắt đầu bằng chữ cái hoặc dấu gạch dưới `_`.',
		'- Tên biến có phân biệt chữ hoa, chữ thường (`total` khác `Total`).',
		'- Nên sử dụng phong cách **snake_case** cho tên biến trong Python.',
		'',
		'```python',
		'# Ví dụ mẫu',
		'user_name = "Alice"',
		'user_score = 98.5',
		'print(f"Học viên {user_name} đạt {user_score} điểm!")',
		'```'
	].join('\\n'),
	2: [
		'# Cấu Trúc Điều Kiện If-Else Và Vòng Lặp',
		'',
		'## 1. Câu lệnh If - Elif - Else',
		'Python sử dụng thụt đầu dòng (indentation) để phân cấp khối lệnh thay vì dùng dấu ngoặc nhọn.',
		'',
		'```python',
		'score = 85',
		'if score >= 90:',
		'    print("Xuất sắc")',
		'elif score >= 70:',
		'    print("Khá")',
		'else:',
		'    print("Cần cố gắng")',
		'```',
		'',
		'## 2. Vòng lặp For và Hàm range()',
		'```python',
		'for i in range(5):',
		'    print(f"Lần lặp thứ {i}")',
		'```'
	].join('\\n')
};
