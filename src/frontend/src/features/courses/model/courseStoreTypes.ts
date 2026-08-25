export interface LessonContent {
  id: string;
  content_type: 'Reading' | 'Quiz' | 'Code Problem';
  title: string;
  media_url?: string;
  // Activity configurations
  // Reading
  readingContent?: string;
  // Quiz
  quizDescription?: string;
  quizQuestions?: Array<{
    id: string;
    questionText: string;
    choices: string[];
    correctAnswerIndex: number;
    points: number;
  }>;
  // Problem
  problemSlug?: string;
  problemStatement?: string;
  problemInputDescription?: string;
  problemOutputDescription?: string;
  problemConstraints?: string;
  problemDifficulty?: 'EASY' | 'MEDIUM' | 'HARD';
  problemPassingScore?: number;
  problemTimeLimitMs?: number;
  problemMemoryLimitKb?: number;
  problemSampleTestcases?: Array<{ input: string; output: string; explanation?: string }>;
  problemTags?: string[];
}

export interface Lesson {
  id: string;
  title: string;
  summary: string;
  position: number;
  contents: LessonContent[];
}

export interface Section {
  id: string;
  title: string;
  position: number;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  field: string;
  description: string;
  price: number;
  thumbnail_url: string;
  status: 'DRAFT' | 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED' | 'ARCHIVED';
  sections: Section[];
  lastUpdated: string;
  publishedDate?: string;
}

interface CourseStore {
  courses: Course[];
  loadCourses: () => void;
  addCourse: (course: Partial<Course>) => string;
  updateCourse: (id: string, updates: Partial<Course>) => void;
  deleteCourse: (id: string) => void;
  
  // Section CRUD
  addSection: (courseId: string, title: string) => void;
  updateSection: (courseId: string, sectionId: string, title: string) => void;
  deleteSection: (courseId: string, sectionId: string) => void;
  reorderSections: (courseId: string, sections: Section[]) => void;
  
  // Lesson CRUD
  addLesson: (courseId: string, sectionId: string, title: string, summary?: string) => void;
  updateLesson: (courseId: string, sectionId: string, lessonId: string, title: string, summary?: string) => void;
  deleteLesson: (courseId: string, sectionId: string, lessonId: string) => void;
  reorderLessons: (courseId: string, sectionId: string, lessons: Lesson[]) => void;
  
  // Activity CRUD
  addActivity: (courseId: string, sectionId: string, lessonId: string, activity: Omit<LessonContent, 'id'>) => string;
  updateActivity: (courseId: string, sectionId: string, lessonId: string, activityId: string, updates: Partial<LessonContent>) => void;
  deleteActivity: (courseId: string, sectionId: string, lessonId: string, activityId: string) => void;
  reorderActivities: (courseId: string, sectionId: string, lessonId: string, activities: LessonContent[]) => void;
}

