export interface InterviewMessage {
	id: number;
	sender: 'AI' | 'HUMAN';
	content: string;
	timestamp: string;
}

export interface InterviewReport {
	sessionId: number;
	topic: string;
	level: string;
	overallScore: number; // 0 to 10
	strengths: string[];
	weaknesses: string[];
	suggestions: string[];
	messagesCount: number;
}

export const interviewService = {
	startSession: async (topic: string, level: string) => {
		return {
			sessionId: Date.now(),
			topic,
			level,
			maxQuestions: 12,
			startedAt: new Date().toISOString()
		};
	},

	getInitialAiGreeting: (topic: string, level: string): string => {
		return `Xin chào! Tôi là AI Phỏng vấn viên của SkillBoost. Hôm nay chúng ta sẽ trao đổi về chủ đề **${topic}** ở cấp độ **${level}**.\n\nHãy giới thiệu ngắn gọn về bản thân và kinh nghiệm liên quan của bạn nhé!`;
	},

	sendAnswerAndGetNextQuestion: async (sessionId: number, userMessage: string, questionIdx: number): Promise<string> => {
		void sessionId;
		void userMessage;
		await new Promise((r) => setTimeout(r, 1000));

		const mockQuestions = [
			'Cảm ơn bạn. Câu hỏi 2: Bạn có thể giải thích sự khác biệt giữa cấu trúc dữ liệu Array và Linked List không? Khi nào nên dùng loại nào?',
			'Rất tốt! Câu hỏi 3: Độ phức tạp thời gian (Time Complexity) trung bình và tệ nhất của thuật toán QuickSort là bao nhiêu?',
			'Câu hỏi 4: Trong môi trường đa luồng (Multi-threading), Deadlock là gì và bạn làm thế nào để phòng tránh nó?',
			'Tuyệt vời. Câu hỏi 5: Hãy giải thích nguyên lý Dependency Inversion trong bộ nguyên tắc SOLID?'
		];

		return mockQuestions[questionIdx] || 'Cảm ơn bạn! Bạn đã hoàn thành xuất sắc buổi phỏng vấn hôm nay. Tôi đang tổng hợp báo cáo đánh giá...';
	},

	getReport: async (sessionId: number): Promise<InterviewReport> => {
		return {
			sessionId,
			topic: 'Cấu trúc dữ liệu & Giải thuật',
			level: 'Fresher / Junior',
			overallScore: 8.5,
			strengths: [
				'Nắm chắc lý thuyết về cấu trúc dữ liệu cơ bản (Array, Linked List, Stack, Queue).',
				'Khả năng phân tích độ phức tạp thời gian O(N) và không gian O(1) rõ ràng.',
				'Giao tiếp tự tin, trả lời đúng trọng tâm câu hỏi.'
			],
			weaknesses: [
				'Cần trau dồi thêm về các giải thuật đồ thị nâng cao (Dijkstra, Floyd-Warshall).',
				'Chưa đề cập sâu đến kỹ thuật tối ưu bộ nhớ cache line.'
			],
			suggestions: [
				'Luyện tập thêm 15 bài tập Dynamic Programming trên hệ thống Online Judge.',
				'Đọc thêm tài liệu về System Design cơ bản để nâng cao tư duy kiến trúc.'
			],
			messagesCount: 8
		};
	}
};
