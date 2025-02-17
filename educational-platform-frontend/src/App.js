import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

//add bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';


import Home from "./components/Home"; //Importing home page here
import Login from "./components/Login";
import Register from "./components/Register";
import QuizDashboard from "./components/QuizDashboard"; // Import QuizDashboard
import GradedAssignment from "./components/Student__GradedAssignment"
import StudentDashboard from "./components/StudentDashboard/Dashboard"
import StudentCourses from "./components/StudentCourses/Courses"

function App() {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<Home />} /> {/* Default Home page */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<QuizDashboard />} />
        <Route path="/assignment" element={<GradedAssignment />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/student-courses" element={<StudentCourses />} />
      </Routes>
    </Router>
  );
}

export default App;
