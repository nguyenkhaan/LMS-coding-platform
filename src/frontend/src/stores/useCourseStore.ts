import { create } from 'zustand';

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

const DEFAULT_COURSES: Course[] = [
  {
    id: 'course-1',
    title: 'Python Foundations for Problem Solving',
    slug: 'python-foundations-for-problem-solving',
    field: 'Programming',
    description: 'Master the fundamental concepts of Python and solve algorithms/data structures problems.',
    price: 49.00,
    thumbnail_url: 'https://placehold.co/360x200',
    status: 'DRAFT',
    lastUpdated: '2026-08-23',
    sections: [
      {
        id: 'S-01',
        title: 'Foundations & Basics',
        position: 1,
        lessons: [
          {
            id: 'L-01',
            title: 'Introduction & Python Installation',
            summary: 'Setting up local Python IDEs and basic syntax rules.',
            position: 1,
            contents: [
              {
                id: 'C-01',
                content_type: 'Reading',
                title: 'IDE Setup Guide',
                readingContent: '# IDE Setup Guide\n\nFollow these steps to set up VS Code and Python locally:\n1. Download Python\n2. Install VS Code\n3. Install Python Extension.'
              }
            ]
          },
          {
            id: 'L-02',
            title: 'Variables and Simple Data Types',
            summary: 'Learn about integers, decimals, booleans, and strings.',
            position: 2,
            contents: [
              {
                id: 'C-02',
                content_type: 'Quiz',
                title: 'Data Types Checkpoint Quiz',
                quizDescription: 'Quick checkpoint for python data types.',
                quizQuestions: [
                  {
                    id: 'q-1',
                    questionText: 'Which data type is used for fractional numbers in Python?',
                    choices: ['int', 'float', 'str', 'boolean'],
                    correctAnswerIndex: 1,
                    points: 10
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'S-02',
        title: 'Control Flow structures',
        position: 2,
        lessons: [
          {
            id: 'L-03',
            title: 'If-Else Conditional Decisions',
            summary: 'Understanding branch executions based on condition results.',
            position: 1,
            contents: [
              {
                id: 'C-03',
                content_type: 'Code Problem',
                title: 'Find Maximum of Two Numbers',
                problemSlug: 'find-maximum-of-two-numbers',
                problemStatement: 'Write a program that takes two numbers and returns the maximum.',
                problemInputDescription: 'Two line-separated integers a and b.',
                problemOutputDescription: 'Print the maximum value.',
                problemConstraints: '-10^9 <= a, b <= 10^9',
                problemDifficulty: 'EASY',
                problemPassingScore: 100,
                problemTimeLimitMs: 1000,
                problemMemoryLimitKb: 256000,
                problemSampleTestcases: [
                  { input: '5\n10', output: '10', explanation: '10 is larger than 5.' }
                ],
                problemTags: ['Basic Math', 'Conditional Statements']
              }
            ]
          },
          {
            id: 'L-04',
            title: 'Loops (While & For loops)',
            summary: 'Loop iteration rules and break/continue instructions.',
            position: 2,
            contents: [
              {
                id: 'C-04',
                content_type: 'Reading',
                title: 'Loop Execution Analysis',
                readingContent: 'Detailed notes on python loops execution.'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'course-2',
    title: 'Data Structures & Algorithms in Python',
    slug: 'dsa-python',
    field: 'Algorithms',
    description: 'Deep dive into advanced algorithms, arrays, hash maps, heaps, and tree structures.',
    price: 89.00,
    thumbnail_url: 'https://placehold.co/360x200',
    status: 'APPROVED',
    lastUpdated: '2026-08-20',
    publishedDate: '2026-08-20',
    sections: [
      {
        id: 'dsa-s1',
        title: 'Arrays & Two Pointers',
        position: 1,
        lessons: [
          {
            id: 'dsa-l1',
            title: 'Two Sum & HashMap Optimization',
            summary: 'Learn how to optimize search from O(N^2) to O(N).',
            position: 1,
            contents: [
              {
                id: 'dsa-c1',
                content_type: 'Code Problem',
                title: 'Two Sum Problem',
                problemSlug: 'two-sum',
                problemStatement: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
                problemInputDescription: 'Array nums and integer target.',
                problemOutputDescription: 'Return two indices.',
                problemConstraints: '2 <= nums.length <= 10^4',
                problemDifficulty: 'EASY',
                problemPassingScore: 100,
                problemTimeLimitMs: 1000,
                problemMemoryLimitKb: 256000,
                problemSampleTestcases: [
                  { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'nums[0] + nums[1] == 9.' }
                ],
                problemTags: ['Array', 'Hash Table']
              }
            ]
          }
        ]
      }
    ]
  }
];

export const useCourseStore = create<CourseStore>((set, get) => {
  // Try loading from localStorage
  const getStoredCourses = (): Course[] => {
    if (typeof window === 'undefined') return DEFAULT_COURSES;
    const stored = localStorage.getItem('teacher_courses');
    if (!stored) {
      localStorage.setItem('teacher_courses', JSON.stringify(DEFAULT_COURSES));
      return DEFAULT_COURSES;
    }
    try {
      return JSON.parse(stored);
    } catch {
      return DEFAULT_COURSES;
    }
  };

  const saveToStorage = (courses: Course[]) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('teacher_courses', JSON.stringify(courses));
    }
  };

  return {
    courses: getStoredCourses(),

    loadCourses: () => {
      set({ courses: getStoredCourses() });
    },

    addCourse: (courseData) => {
      const id = `course-${Date.now()}`;
      const newCourse: Course = {
        id,
        title: courseData.title || 'Untitled Course',
        slug: courseData.title ? courseData.title.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-') : `course-${Date.now()}`,
        field: courseData.field || 'Programming',
        description: courseData.description || 'Enter short description here.',
        price: courseData.price || 0,
        thumbnail_url: courseData.thumbnail_url || 'https://placehold.co/360x200',
        status: 'DRAFT',
        sections: [],
        lastUpdated: new Date().toISOString().split('T')[0]
      };
      
      const updated = [...get().courses, newCourse];
      saveToStorage(updated);
      set({ courses: updated });
      return id;
    },

    updateCourse: (id, updates) => {
      const updated = get().courses.map(c => {
        if (c.id === id) {
          const updatedCourse = {
            ...c,
            ...updates,
            lastUpdated: new Date().toISOString().split('T')[0]
          };
          if (updates.status === 'APPROVED' && !c.publishedDate) {
            updatedCourse.publishedDate = new Date().toISOString().split('T')[0];
          }
          return updatedCourse;
        }
        return c;
      });
      saveToStorage(updated);
      set({ courses: updated });
    },

    deleteCourse: (id) => {
      const updated = get().courses.filter(c => c.id !== id);
      saveToStorage(updated);
      set({ courses: updated });
    },

    // Section CRUD
    addSection: (courseId, title) => {
      const updated = get().courses.map(c => {
        if (c.id === courseId) {
          const newSection: Section = {
            id: `S-${Date.now()}`,
            title,
            position: c.sections.length + 1,
            lessons: []
          };
          return { ...c, sections: [...c.sections, newSection] };
        }
        return c;
      });
      saveToStorage(updated);
      set({ courses: updated });
    },

    updateSection: (courseId, sectionId, title) => {
      const updated = get().courses.map(c => {
        if (c.id === courseId) {
          const updatedSections = c.sections.map(s => {
            if (s.id === sectionId) {
              return { ...s, title };
            }
            return s;
          });
          return { ...c, sections: updatedSections };
        }
        return c;
      });
      saveToStorage(updated);
      set({ courses: updated });
    },

    deleteSection: (courseId, sectionId) => {
      const updated = get().courses.map(c => {
        if (c.id === courseId) {
          const updatedSections = c.sections.filter(s => s.id !== sectionId);
          return { ...c, sections: updatedSections };
        }
        return c;
      });
      saveToStorage(updated);
      set({ courses: updated });
    },

    reorderSections: (courseId, sections) => {
      const updated = get().courses.map(c => {
        if (c.id === courseId) {
          return { ...c, sections };
        }
        return c;
      });
      saveToStorage(updated);
      set({ courses: updated });
    },

    // Lesson CRUD
    addLesson: (courseId, sectionId, title, summary) => {
      const updated = get().courses.map(c => {
        if (c.id === courseId) {
          const updatedSections = c.sections.map(s => {
            if (s.id === sectionId) {
              const newLesson: Lesson = {
                id: `L-${Date.now()}`,
                title,
                summary: summary || 'Newly created lesson summary details.',
                position: s.lessons.length + 1,
                contents: []
              };
              return { ...s, lessons: [...s.lessons, newLesson] };
            }
            return s;
          });
          return { ...c, sections: updatedSections };
        }
        return c;
      });
      saveToStorage(updated);
      set({ courses: updated });
    },

    updateLesson: (courseId, sectionId, lessonId, title, summary) => {
      const updated = get().courses.map(c => {
        if (c.id === courseId) {
          const updatedSections = c.sections.map(s => {
            if (s.id === sectionId) {
              const updatedLessons = s.lessons.map(l => {
                if (l.id === lessonId) {
                  return { ...l, title, summary: summary || l.summary };
                }
                return l;
              });
              return { ...s, lessons: updatedLessons };
            }
            return s;
          });
          return { ...c, sections: updatedSections };
        }
        return c;
      });
      saveToStorage(updated);
      set({ courses: updated });
    },

    deleteLesson: (courseId, sectionId, lessonId) => {
      const updated = get().courses.map(c => {
        if (c.id === courseId) {
          const updatedSections = c.sections.map(s => {
            if (s.id === sectionId) {
              const updatedLessons = s.lessons.filter(l => l.id !== lessonId);
              return { ...s, lessons: updatedLessons };
            }
            return s;
          });
          return { ...c, sections: updatedSections };
        }
        return c;
      });
      saveToStorage(updated);
      set({ courses: updated });
    },

    reorderLessons: (courseId, sectionId, lessons) => {
      const updated = get().courses.map(c => {
        if (c.id === courseId) {
          const updatedSections = c.sections.map(s => {
            if (s.id === sectionId) {
              return { ...s, lessons };
            }
            return s;
          });
          return { ...c, sections: updatedSections };
        }
        return c;
      });
      saveToStorage(updated);
      set({ courses: updated });
    },

    // Activity CRUD
    addActivity: (courseId, sectionId, lessonId, activity) => {
      const activityId = `C-${Date.now()}`;
      const newActivity: LessonContent = {
        ...activity,
        id: activityId
      };
      
      const updated = get().courses.map(c => {
        if (c.id === courseId) {
          const updatedSections = c.sections.map(s => {
            if (s.id === sectionId) {
              const updatedLessons = s.lessons.map(l => {
                if (l.id === lessonId) {
                  return { ...l, contents: [...l.contents, newActivity] };
                }
                return l;
              });
              return { ...s, lessons: updatedLessons };
            }
            return s;
          });
          return { ...c, sections: updatedSections };
        }
        return c;
      });
      
      saveToStorage(updated);
      set({ courses: updated });
      return activityId;
    },

    updateActivity: (courseId, sectionId, lessonId, activityId, updates) => {
      const updated = get().courses.map(c => {
        if (c.id === courseId) {
          const updatedSections = c.sections.map(s => {
            if (s.id === sectionId) {
              const updatedLessons = s.lessons.map(l => {
                if (l.id === lessonId) {
                  const updatedContents = l.contents.map(act => {
                    if (act.id === activityId) {
                      return { ...act, ...updates };
                    }
                    return act;
                  });
                  return { ...l, contents: updatedContents };
                }
                return l;
              });
              return { ...s, lessons: updatedLessons };
            }
            return s;
          });
          return { ...c, sections: updatedSections };
        }
        return c;
      });
      saveToStorage(updated);
      set({ courses: updated });
    },

    deleteActivity: (courseId, sectionId, lessonId, activityId) => {
      const updated = get().courses.map(c => {
        if (c.id === courseId) {
          const updatedSections = c.sections.map(s => {
            if (s.id === sectionId) {
              const updatedLessons = s.lessons.map(l => {
                if (l.id === lessonId) {
                  const updatedContents = l.contents.filter(act => act.id !== activityId);
                  return { ...l, contents: updatedContents };
                }
                return l;
              });
              return { ...s, lessons: updatedLessons };
            }
            return s;
          });
          return { ...c, sections: updatedSections };
        }
        return c;
      });
      saveToStorage(updated);
      set({ courses: updated });
    },

    reorderActivities: (courseId, sectionId, lessonId, activities) => {
      const updated = get().courses.map(c => {
        if (c.id === courseId) {
          const updatedSections = c.sections.map(s => {
            if (s.id === sectionId) {
              const updatedLessons = s.lessons.map(l => {
                if (l.id === lessonId) {
                  return { ...l, contents: activities };
                }
                return l;
              });
              return { ...s, lessons: updatedLessons };
            }
            return s;
          });
          return { ...c, sections: updatedSections };
        }
        return c;
      });
      saveToStorage(updated);
      set({ courses: updated });
    }
  };
});
