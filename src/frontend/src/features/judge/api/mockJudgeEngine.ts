export interface TestCaseProgress {
  id: number;
  status: 'Pending' | 'Running' | 'Passed' | 'Failed';
  input: string;
  expected: string;
  actual?: string;
  runtime?: string;
  memory?: string;
}

export interface SubmissionProgress {
  status: 'Pending' | 'Running' | 'Passed' | 'Failed';
  passedCount: number;
  totalCount: number;
  testCases: TestCaseProgress[];
  runtime?: string;
  memory?: string;
}

export type ProgressCallback = (progress: SubmissionProgress) => void;

export const mockJudgeEngine = {
  submit: (
    testCases: Array<{ id: number; nums: string; target: string; expected: string }>,
    code: string,
    onProgress: ProgressCallback
  ) => {
    const totalCount = testCases.length;
    const progressCases: TestCaseProgress[] = testCases.map((tc) => ({
      id: tc.id,
      status: 'Pending',
      input: `nums = ${tc.nums}, target = ${tc.target}`,
      expected: tc.expected,
    }));

    const currentProgress: SubmissionProgress = {
      status: 'Pending',
      passedCount: 0,
      totalCount,
      testCases: [...progressCases],
    };

    // Initial state: Pending
    onProgress({ ...currentProgress });

    let currentIdx = 0;

    const runNext = () => {
      if (currentIdx >= totalCount) {
        const allPassed = currentProgress.testCases.every((c) => c.status === 'Passed');
        currentProgress.status = allPassed ? 'Passed' : 'Failed';
        currentProgress.runtime = `${Math.floor(Math.random() * 20) + 25} ms`;
        currentProgress.memory = `${(Math.random() * 2 + 13).toFixed(1)} MB`;
        onProgress({ ...currentProgress });
        return;
      }

      const currentCase = currentProgress.testCases[currentIdx];
      if (!currentCase) return;

      currentProgress.status = 'Running';
      currentCase.status = 'Running';
      onProgress({ ...currentProgress });

      setTimeout(() => {
        const isCodeValid = code.trim().length > 45 && (code.includes('def ') || code.includes('function') || code.includes('class') || code.includes('return'));
        const passed = isCodeValid;

        if (passed) {
          currentCase.status = 'Passed';
          currentCase.actual = currentCase.expected;
          currentCase.runtime = `${Math.floor(Math.random() * 15) + 10} ms`;
          currentCase.memory = `${(Math.random() * 1 + 13).toFixed(1)} MB`;
          currentProgress.passedCount += 1;
        } else {
          currentCase.status = 'Failed';
          currentCase.actual = 'None / Error';
        }

        onProgress({ ...currentProgress });
        currentIdx++;
        setTimeout(runNext, 400);
      }, 500);
    };

    setTimeout(runNext, 400);
  },
};
