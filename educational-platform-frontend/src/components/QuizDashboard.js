import { useState } from "react";

const QuizDashboard = () => {
  // Dummy quiz data (Replace with API data if needed)
  const [quizStats, setQuizStats] = useState({  //setQuizStats(A function for updating the stats.)
    totalQuizzes: 5,
    averageScore: 78,
    recentQuizzes: [
      { id: 1, subject: "Math", score: 80 },
      { id: 2, subject: "Science", score: 75 },
      { id: 3, subject: "History", score: 85 },
    ],
  });

  return (
    <div>
      <h2>Quiz Performance Dashboard</h2>
      <p><strong>Total Quizzes Attempted:</strong> {quizStats.totalQuizzes}</p>
      <p><strong>Average Score:</strong> {quizStats.averageScore}%</p>
      
      <h3>Recent Quizzes:</h3>
      <ul>
        {quizStats.recentQuizzes.map((quiz) => (
          <li key={quiz.id}>
            <strong>{quiz.subject}</strong>: {quiz.score}%
          </li>
        ))}
      </ul>
    </div>
  );
};

export default QuizDashboard;
