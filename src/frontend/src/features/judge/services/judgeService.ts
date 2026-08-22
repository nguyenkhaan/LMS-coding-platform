import { Problem, Submission } from '@/types/problem';
import { RunResult, JudgeSubmissionResult, SUPPORTED_LANGUAGES } from '../types';

export const MOCK_PROBLEMS: Problem[] = [
	{
		id: 1,
		title: 'Hai Số Tổng (Two Sum)',
		slug: 'two-sum',
		statement: 'Cho một mảng các số nguyên `nums` và một số nguyên `target`, hãy tìm **chỉ số (index)** của hai số sao cho tổng của chúng bằng `target`.\n\nBạn có thể giả định rằng mỗi đầu vào sẽ có chính xác một nghiệm, và bạn không được sử dụng cùng một phần tử hai lần.\n\nBạn có thể trả về câu trả lời theo bất kỳ thứ tự nào.',
		inputDescription: 'Dòng đầu tiên chứa số nguyên n và target. Dòng thứ hai chứa n số nguyên cách nhau bởi dấu cách.',
		outputDescription: 'In ra hai chỉ số cách nhau bởi dấu cách (0-indexed).',
		constraints: '- 2 <= nums.length <= 10^4\n- -10^9 <= nums[i] <= 10^9\n- -10^9 <= target <= 10^9',
		difficulty: 'EASY',
		passingScore: 100,
		timeLimitMs: 1000,
		memoryLimitKb: 256000,
		sampleTestcases: [
			{
				input: '4 9\n2 7 11 15',
				output: '0 1',
				explanation: 'Bởi vì nums[0] + nums[1] == 2 + 7 == 9, chúng ta trả về 0 1.'
			},
			{
				input: '3 6\n3 2 4',
				output: '1 2'
			}
		],
		tags: ['Array', 'Hash Table', 'Thuật toán cơ bản']
	},
	{
		id: 2,
		title: 'Đảo Ngược Chuỗi (Reverse String)',
		slug: 'reverse-string',
		statement: 'Viết một hàm đảo ngược một chuỗi ký tự được truyền vào dưới dạng một chuỗi.',
		inputDescription: 'Một dòng chứa chuỗi ký tự s.',
		outputDescription: 'In ra chuỗi ký tự đã được đảo ngược.',
		constraints: '- 1 <= s.length <= 10^5\n- Chuỗi chỉ chứa các ký tự ASCII có thể in được.',
		difficulty: 'EASY',
		passingScore: 100,
		timeLimitMs: 1000,
		memoryLimitKb: 128000,
		sampleTestcases: [
			{
				input: 'hello',
				output: 'olleh'
			},
			{
				input: 'SkillBoost',
				output: 'tsooBllikS'
			}
		],
		tags: ['String', 'Two Pointers']
	},
	{
		id: 3,
		title: 'Dãy Con Tăng Dài Nhất (LIS)',
		slug: 'longest-increasing-subsequence',
		statement: 'Cho một mảng số nguyên `nums`, hãy tìm độ dài của dãy con tăng nghiêm ngặt dài nhất.',
		inputDescription: 'Dòng 1: số nguyên n. Dòng 2: n số nguyên của mảng nums.',
		outputDescription: 'In ra một số nguyên duy nhất là độ dài của dãy con tăng dài nhất.',
		constraints: '- 1 <= nums.length <= 2500\n- -10^4 <= nums[i] <= 10^4',
		difficulty: 'MEDIUM',
		passingScore: 100,
		timeLimitMs: 2000,
		memoryLimitKb: 256000,
		sampleTestcases: [
			{
				input: '8\n10 9 2 5 3 7 101 18',
				output: '4',
				explanation: 'Dãy con tăng dài nhất là [2, 3, 7, 101], có độ dài là 4.'
			}
		],
		tags: ['Dynamic Programming', 'Binary Search']
	}
];

export const judgeService = {
	getProblems: async (search?: string, difficulty?: string, tag?: string): Promise<Problem[]> => {
		let list = [...MOCK_PROBLEMS];
		if (search) {
			const q = search.toLowerCase();
			list = list.filter((p) => p.title.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q));
		}
		if (difficulty && difficulty !== 'ALL') {
			list = list.filter((p) => p.difficulty === difficulty);
		}
		if (tag) {
			list = list.filter((p) => p.tags.includes(tag));
		}
		return list;
	},

	getProblemBySlug: async (slug: string): Promise<Problem | null> => {
		return MOCK_PROBLEMS.find((p) => p.slug === slug) || null;
	},

	runCode: async (problemId: number, languageId: number, sourceCode: string, stdin: string): Promise<RunResult> => {
		// Simulate network latency
		await new Promise((r) => setTimeout(r, 600));

		const problem = MOCK_PROBLEMS.find((p) => p.id === problemId);
		let output = '';

		if (stdin.trim()) {
			// Mock calculation based on problem
			if (problemId === 1) output = '0 1';
			else if (problemId === 2) output = stdin.trim().split('').reverse().join('');
			else output = '4';
		} else {
			output = problem ? problem.sampleTestcases[0]?.output || '0' : '0';
		}

		return {
			status: 'SUCCESS',
			stdout: output,
			runtimeMs: Math.floor(Math.random() * 40) + 10,
			memoryKb: Math.floor(Math.random() * 5000) + 12000,
			isCompiled: true
		};
	},

	submitCode: async (problemId: number, languageId: number, sourceCode: string): Promise<JudgeSubmissionResult> => {
		await new Promise((r) => setTimeout(r, 1200));

		const problem = MOCK_PROBLEMS.find((p) => p.id === problemId);
		const passingScore = problem ? problem.passingScore : 100;

		const testcases: any[] = [
			{
				testcaseId: 1,
				status: 'ACCEPTED',
				input: problem?.sampleTestcases[0]?.input || '4 9',
				expectedOutput: problem?.sampleTestcases[0]?.output || '0 1',
				actualOutput: problem?.sampleTestcases[0]?.output || '0 1',
				runtimeMs: 15,
				memoryKb: 14200,
				isHidden: false
			},
			{
				testcaseId: 2,
				status: 'ACCEPTED',
				input: 'Hidden testcase #2',
				expectedOutput: 'Hidden',
				actualOutput: 'Hidden',
				runtimeMs: 22,
				memoryKb: 14500,
				isHidden: true
			},
			{
				testcaseId: 3,
				status: 'ACCEPTED',
				input: 'Hidden testcase #3',
				expectedOutput: 'Hidden',
				actualOutput: 'Hidden',
				runtimeMs: 18,
				memoryKb: 14300,
				isHidden: true
			}
		];

		return {
			id: Date.now(),
			problemId,
			status: 'ACCEPTED',
			score: 100,
			passingScore,
			isPassed: true,
			runtimeMs: 18,
			memoryKb: 14300,
			testcases,
			submittedAt: new Date().toISOString()
		};
	}
};
