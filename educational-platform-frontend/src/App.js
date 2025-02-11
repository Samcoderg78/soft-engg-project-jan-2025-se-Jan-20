import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./components/Home"; //Importing home page here
import Login from "./components/Login";
import Register from "./components/Register";
import QuizDashboard from "./components/QuizDashboard"; // Import QuizDashboard

function App() {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<Home />} /> {/* Default Home page */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<QuizDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
