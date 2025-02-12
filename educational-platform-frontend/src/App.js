import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./components/Home"; //Importing home page here
import Login from "./components/Login";
import Register from "./components/Register";
import QuizDashboard from "./components/QuizDashboard"; // Import QuizDashboard
import GradedAssignment from "./components/Student__GradedAssignment"

function App() {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<Home />} /> {/* Default Home page */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<QuizDashboard />} />
        <Route path="/assignment" element={<GradedAssignment />} />
      </Routes>
    </Router>
  );
}

export default App;
