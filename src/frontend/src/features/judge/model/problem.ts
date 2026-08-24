export type ProblemDifficulty = 'EASY' | 'MEDIUM' | 'HARD';
export type SubmissionStatus =
	| 'PENDING'
	| 'RUNNING'
	| 'ACCEPTED'
	| 'WRONG_ANSWER'
	| 'TIME_LIMIT_EXCEEDED'
	| 'MEMORY_LIMIT_EXCEEDED'
	| 'RUNTIME_ERROR'
	| 'COMPILE_ERROR';

export interface Problem {
	id: number;
	title: string;
	slug: string;
	statement: string;
	inputDescription: string;
	outputDescription: string;
	constraints: string;
	difficulty: ProblemDifficulty;
	passingScore: number;
	timeLimitMs: number;
	memoryLimitKb: number;
	sampleTestcases: Array<{
		input: string;
		output: string;
		explanation?: string;
	}>;
	tags: string[];
}

export interface Submission {
	id: number;
	problemId: number;
	studentId: number;
	languageId: number;
	sourceCode: string;
	status: SubmissionStatus;
	score: number;
	runtimeMs?: number;
	memoryKb?: number;
	createdAt: string;
	errorMessage?: string;
}
