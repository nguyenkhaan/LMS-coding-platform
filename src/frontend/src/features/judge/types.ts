import { ProblemDifficulty, SubmissionStatus } from '@/types/problem';

export interface CodeLanguage {
	id: number;
	name: string;
	monacoLang: string;
	defaultCode: string;
}

export const SUPPORTED_LANGUAGES: CodeLanguage[] = [
	{
		id: 1,
		name: 'C++ 20',
		monacoLang: 'cpp',
		defaultCode: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int a, b;\n    if (cin >> a >> b) {\n        cout << (a + b) << endl;\n    }\n    return 0;\n}'
	},
	{
		id: 2,
		name: 'Python 3',
		monacoLang: 'python',
		defaultCode: 'import sys\n\ndef main():\n    lines = sys.stdin.read().split()\n    if len(lines) >= 2:\n        a, b = int(lines[0]), int(lines[1])\n        print(a + b)\n\nif __name__ == "__main__":\n    main()'
	},
	{
		id: 3,
		name: 'JavaScript (Node.js)',
		monacoLang: 'javascript',
		defaultCode: 'const fs = require("fs");\n\nfunction main() {\n    const input = fs.readFileSync(0, "utf-8").trim().split(/\\s+/);\n    if (input.length >= 2) {\n        const a = parseInt(input[0], 10);\n        const b = parseInt(input[1], 10);\n        console.log(a + b);\n    }\n}\n\nmain();'
	},
	{
		id: 4,
		name: 'Java 17',
		monacoLang: 'java',
		defaultCode: 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (sc.hasNextInt()) {\n            int a = sc.nextInt();\n            int b = sc.nextInt();\n            System.out.println(a + b);\n        }\n    }\n}'
	}
];

export interface TestcaseResult {
	testcaseId: number;
	status: SubmissionStatus;
	input: string;
	expectedOutput: string;
	actualOutput: string;
	runtimeMs: number;
	memoryKb: number;
	isHidden?: boolean;
}

export interface RunResult {
	status: 'SUCCESS' | 'ERROR';
	stdout: string;
	stderr?: string;
	runtimeMs: number;
	memoryKb: number;
	isCompiled: boolean;
}

export interface JudgeSubmissionResult {
	id: number;
	problemId: number;
	status: SubmissionStatus;
	score: number;
	passingScore: number;
	isPassed: boolean;
	runtimeMs: number;
	memoryKb: number;
	testcases: TestcaseResult[];
	submittedAt: string;
}
