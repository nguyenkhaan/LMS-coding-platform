import React from 'react';
import { useNavigate, useParams, useLocation, useSearchParams } from 'react-router-dom';

// ---------------------------------------------------------------------------
// QUIZ02 — Quiz Preview Page
// ---------------------------------------------------------------------------
export const QuizPreviewPage: React.FC = () => {
  const navigate = useNavigate();
  const { quizId } = useParams<{ quizId: string }>();
  const [searchParams] = useSearchParams();
  const location = useLocation();

  const courseSlug = searchParams.get('courseSlug') || location.state?.courseSlug || 'python-foundations-for-problem-solving';
  const lessonId = searchParams.get('lessonId') || location.state?.lessonId || quizId;

  React.useEffect(() => {
    navigate(`/learn/${courseSlug}?lessonId=${lessonId}`, { replace: true });
  }, [navigate, courseSlug, lessonId]);

  return null;
};

export default QuizPreviewPage;
