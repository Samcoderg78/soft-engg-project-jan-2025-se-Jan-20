import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

//add bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';


import Home from "./components/Home"; //Importing home page here
import Login from "./components/Login";
import Register from "./components/Register";
import GradedAssignment from "./components/Student__GradedAssignment"
import StudentDashboard from "./components/StudentDashboard/Dashboard"
import StudentCourses from "./components/StudentCourses/Courses"
import My_Course from "./components/My_Courses/Lectures"
import DeadlinesReminders from "./components/StudentDeadlines&Reminders/Deadlines&Reminders"
import AIAssistancePage from "./components/AIAssistance/AIAssistancePage";
import QuizPerformanceReview from "./components/QuizDashboard/QuizPerformanceRiview"; // Import QuizDashboard
import GradedAssignment from "./components/Student__GradedAssignment";
import WeeklyPerformance from "./components/QuizDashboard/WeeklyPerformance";
import QuizDifficulty from "./components/QuizDashboard/QuizDifficulty";
import StudentScores from "./components/QuizDashboard/StudentScores";
import AIAssistanceInstructor from "./components/QuizDashboard/AiAssitantInstructor";

function App() {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<Home />} /> {/* Default Home page */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/quiz-dashboard" element={<QuizPerformanceReview />} />
        <Route path="/weeky-performance" element={<WeeklyPerformance />} />
        <Route path="/quiz-performance" element={<QuizDifficulty />} />
        <Route path="/quiz-scores" element={<StudentScores />} />
        <Route path="/Ai-assistance" element={<AIAssistanceInstructor />} />

        <Route path="/assignment" element={<GradedAssignment />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/student-courses" element={<StudentCourses />} />
        <Route path="/my-course" element={<My_Course />} />
        <Route path="/deadlines-reminders" element={<DeadlinesReminders />} />
        <Route path="/ai-assistance" element={<AIAssistancePage />} />
      </Routes>
    </Router>
  );
}

export default App;
