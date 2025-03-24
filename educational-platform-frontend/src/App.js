import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

//add bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';


import Home from "./components/Home"; //Importing home page here
import Login from "./components/Login";
import Register from "./components/Register";

import GradedAssignment from "./components/My_Courses/Student__GradedAssignment"

import Suggestions from "./components/My_Courses/Suggestions";
import DifficultQuestions from "./components/My_Courses/DifficultQuestions";

import AIAssistancePage from "./components/AIAssistance/AIAssistancePage";
// import QuizPerformanceReview from "./components/QuizDashboard/QuizPerformanceRiview"; // Import QuizDashboard
import StudentDashboard from "./components/StudentDashboard/Dashboard";
import StudentCourses from "./components/StudentCourses/Courses";
import My_Course from "./components/My_Courses/Lectures";
import DeadlinesReminders from "./components/StudentDeadlines&Reminders/Deadlines&Reminders";
import AIAssistance from "./components/AIAssistance/AIAssistancePage";

import WeeklyPerformance from "./components/Instructor/WeeklyPerformance";
// import QuizDifficulty from "./components/QuizDashboard/QuizDifficulty";
// import StudentScores from "./components/QuizDashboard/StudentScores";
// import AIAssistanceInstructor from "./components/QuizDashboard/AiAssitantInstructor";
import ProgrammingAssignment from "./components/My_Courses/Student_ProgrammingAssignment"

import LecturePage from "./components/My_Courses/Lectures";
import AssignmentPage from "./components/My_Courses/Student_ProgrammingAssignment";
import DifficultQuestionsPage from "./components/My_Courses/DifficultQuestions";
import Dashboard from "./components/Instructor/Dashboard";
import AIAssistancePageInstructor from "./components/Instructor/AIAssistancePage";


function App() {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<Home />} /> {/* Default Home page */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/suggestions" element={<Suggestions />} />
        <Route path="/difficult-questions/:courseId" element={<DifficultQuestions />} />
        <Route path="/weekly-performance" element={<WeeklyPerformance />} />

        <Route path="/assignment/:courseId/:assignmentId" element={<GradedAssignment />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/student-courses" element={<StudentCourses />} />
        
        <Route path="/deadlines-reminders" element={<DeadlinesReminders />} />
        <Route path="/ProgrammingAssignment/:courseId" element={<ProgrammingAssignment />} />
        <Route path="/ai-assistance" element={<AIAssistancePage />} />
        <Route path="/my-course/:courseId" element={<My_Course />} />
        <Route path="/my-course/:courseId/week/:weekNumber/lecture/:lectureNumber" element={<LecturePage />} />
        <Route path="/my-course/:courseId/week/:weekNumber/programming-assignment" element={<AssignmentPage />} />
        <Route path="/my-course/:courseId/week/:weekNumber/graded-assignment" element={<GradedAssignment />} />
        <Route path=":courseId/suggestions" element={<Suggestions />} />
        <Route path="/difficult-questions" element={<DifficultQuestions />} />

        <Route path="/instructor-dashboard" element={<Dashboard />} />
        <Route path="/instructor/ai-assistance" element={<AIAssistancePageInstructor />} />

      </Routes>
    </Router>
  );
}

export default App;
