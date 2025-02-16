import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

//add bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';


import Home from "./components/Home"; //Importing home page here
import Login from "./components/Login";
import Register from "./components/Register";
import QuizDashboard from "./components/QuizDashboard"; // Import QuizDashboard
import GradedAssignment from "./components/Student__GradedAssignment";
import Suggestions from "./components/Suggestions";
import DifficultQuestions from "./components/DifficultQuestions";

function App() {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<Home />} /> {/* Default Home page */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<QuizDashboard />} />
        <Route path="/assignment" element={<GradedAssignment />} />
        <Route path="/suggestions" element={<Suggestions />} />
        <Route path="/difficult-questions" element={<DifficultQuestions />} />
      </Routes>
    </Router>
  );
}

export default App;
