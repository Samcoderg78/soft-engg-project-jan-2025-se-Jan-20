import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [userType, setUserType] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
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
        ...(userType === "student" && rollNo && { roll_no: rollNo })
      });

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
    <div style={{ 
      minHeight: '100vh',
      width: '100vw',
      margin: 0,
      padding: 0,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(135deg, #6a11cb, #2575fc)',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0
    }}>
      <div className="card p-4 shadow" style={{ 
        maxWidth: '450px',
        width: '90%',
        backgroundColor: '#ffffff',
        borderRadius: '15px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)'
      }}>
        <div className="text-center mb-4">
          <h2 style={{ 
            color: '#2c3e50', 
            fontWeight: '600',
            marginBottom: '10px'
          }}>Create Account</h2>
          <p style={{ color: '#6c757d', fontSize: '0.9rem' }}>
            Join our educational platform today
          </p>
        </div>

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
              style={{ 
                backgroundColor: '#f8f9fa',
                border: '1px solid #e9ecef',
                padding: '12px',
                borderRadius: '8px'
              }}
            />
          </div>

          <div className="mb-3">
            <input
              type="email"
              className="form-control"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              style={{ 
                backgroundColor: '#f8f9fa',
                border: '1px solid #e9ecef',
                padding: '12px',
                borderRadius: '8px'
              }}
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
              style={{ 
                backgroundColor: '#f8f9fa',
                border: '1px solid #e9ecef',
                padding: '12px',
                borderRadius: '8px'
              }}
            />
          </div>

          <div className="mb-3">
            <select
              className="form-select"
              value={userType}
              onChange={(e) => {
                setUserType(e.target.value);
                if (e.target.value !== "student") {
                  setRollNo("");
                }
              }}
              disabled={loading}
              required
              style={{ 
                backgroundColor: '#f8f9fa',
                border: '1px solid #e9ecef',
                padding: '12px',
                borderRadius: '8px',
                color: userType ? '#2c3e50' : '#6c757d'
              }}
            >
              <option value="">Choose User Type</option>
              <option value="student">Student</option>
              <option value="instructor">Instructor</option>
            </select>
          </div>

          {userType === "student" && (
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Roll Number (Optional)"
                value={rollNo}
                onChange={(e) => setRollNo(e.target.value)}
                disabled={loading}
                style={{ 
                  backgroundColor: '#f8f9fa',
                  border: '1px solid #e9ecef',
                  padding: '12px',
                  borderRadius: '8px'
                }}
              />
            </div>
          )}

          <button 
            type="submit" 
            className="btn w-100 mb-3"
            disabled={loading}
            style={{ 
              backgroundColor: '#4263eb',
              borderColor: '#4263eb',
              color: '#ffffff',
              fontWeight: '500',
              padding: '12px',
              borderRadius: '8px',
              transition: 'all 0.3s ease'
            }}
          >
            {loading ? (
              <span>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Creating Account...
              </span>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <p className="text-center mt-3" style={{ color: '#6c757d' }}>
          Already have an account? {' '}
          <a 
            href="/login" 
            style={{ 
              color: '#4263eb', 
              textDecoration: 'none', 
              fontWeight: '500',
              transition: 'color 0.3s ease'
            }}
            onMouseOver={(e) => e.target.style.color = '#2c3e50'}
            onMouseOut={(e) => e.target.style.color = '#4263eb'}
          >
            Login here
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
