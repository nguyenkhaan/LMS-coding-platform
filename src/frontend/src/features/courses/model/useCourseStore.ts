import { create } from 'zustand';
import { DEFAULT_COURSES } from './defaultCourses';
import type { Course, CourseStore, Lesson, LessonContent, Section } from './courseStoreTypes';

export type { Course, CourseStore, Lesson, LessonContent, Section } from './courseStoreTypes';

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
        lastUpdated: new Date().toISOString().slice(0, 10)
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
            lastUpdated: new Date().toISOString().slice(0, 10)
          };
          if (updates.status === 'APPROVED' && !c.publishedDate) {
            updatedCourse.publishedDate = new Date().toISOString().slice(0, 10);
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
