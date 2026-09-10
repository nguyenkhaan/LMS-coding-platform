import type { Course } from './courseStoreTypes';

export const DEFAULT_COURSES: Course[] = [
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
