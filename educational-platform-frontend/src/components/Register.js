import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState(""); // New state for name
  const [userType, setUserType] = useState(""); // Empty default value
  const [rollNo, setRollNo] = useState(""); // New state for roll number
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate user type is selected
    if (!userType) {
      setError("Please select a user type");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.post("http://localhost:3009/api/user/add-user", {
        email,
        password,
        name,
        role: userType,
        // Only include roll_no if it's a student and has a value
        ...(userType === "student" && rollNo && { roll_no: rollNo })
      });

      // If registration successful, redirect to login
      alert("Registration successful! Please login.");
      navigate("/login");
    } catch (err) {
      setError(
        err.response?.data?.message || "An error occurred during registration"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow" style={{ maxWidth: '400px', width: '100%' }}>
        <h2 className="text-center mb-4">Register</h2>
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div className="mb-3">
            <input
              type="email"
              className="form-control"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div className="mb-3">
            <select
              className="form-select"
              value={userType}
              onChange={(e) => {
                setUserType(e.target.value);
                // Clear roll number if switching away from student
                if (e.target.value !== "student") {
                  setRollNo("");
                }
              }}
              disabled={loading}
              required
            >
              <option value="">Choose User Type</option>
              <option value="student">Student</option>
              <option value="instructor">Instructor</option>
            </select>
          </div>
          {/* Show roll number field only for students */}
          {userType === "student" && (
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Roll Number (Optional)"
                value={rollNo}
                onChange={(e) => setRollNo(e.target.value)}
                disabled={loading}
              />
            </div>
          )}
          <button 
            type="submit" 
            className="btn btn-success w-100"
            disabled={loading}
          >
            {loading ? (
              <span>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Registering...
              </span>
            ) : (
              "Register"
            )}
          </button>
        </form>
        <p className="text-center mt-3">
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
};

export default Register;
