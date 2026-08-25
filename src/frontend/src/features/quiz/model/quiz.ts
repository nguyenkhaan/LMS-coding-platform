export interface QuizQuestion {
	id: number;
	quizId: number;
	question: string;
	explanation?: string;
	options: Array<{
		id: number;
		text: string;
	}>;
}

export interface Quiz {
	id: number;
	title: string;
	description?: string;
	passingScore: number;
	maxAttempts: number;
	totalQuestions: number;
	questions?: QuizQuestion[];
}

export interface QuizSubmission {
	id: number;
	quizId: number;
	studentId: number;
	score: number;
	isPassed: boolean;
	submittedAt: string;
	answers: Record<number, number>;
}
