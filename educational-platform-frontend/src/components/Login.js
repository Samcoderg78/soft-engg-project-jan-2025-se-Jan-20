import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Replace with your actual API endpoint
      const response = await axios.post("http://localhost:3009/api/user/login", {
        email,
        password,
      });

      // Store token and user info in localStorage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      // Redirect based on user role
      if (response.data.user.role === "student") {
        navigate("/student-dashboard");
      } else if (response.data.user.role === "instructor") {
        navigate("/instructor-dashboard");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "An error occurred during login"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.alert('Google Login Clicked');
    // Integrate Google OAuth Here (Example: Firebase, Passport.js, etc.)
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
        maxWidth: '400px', 
        width: '90%',
        backgroundColor: '#ffffff',
        borderRadius: '15px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)'
      }}>
        <h2 className="text-center mb-4" style={{ color: '#2c3e50', fontWeight: '600' }}>Login</h2>
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="email"
              className="form-control"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              style={{ backgroundColor: '#f8f9fa', border: '1px solid #e9ecef' }}
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
              style={{ backgroundColor: '#f8f9fa', border: '1px solid #e9ecef' }}
            />
          </div>
          <button 
            type="submit" 
            className="btn btn-primary w-100 mb-3"
            disabled={loading}
            style={{ 
              backgroundColor: '#4263eb',
              borderColor: '#4263eb',
              fontWeight: '500'
            }}
          >
            {loading ? (
              <span>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Logging in...
              </span>
            ) : (
              "Login"
            )}
          </button>
        </form>

        <button 
          className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center mb-3"
          onClick={handleGoogleLogin}
          disabled={loading}
          style={{ 
            height: '38px',
            backgroundColor: '#ffffff',
            borderColor: '#dc3545',
            color: '#dc3545',
            fontWeight: '500'
          }}
        >
          <img
            src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBkPSJNMTcuNiA5LjJsLS4xLTEuOEg5djMuNGg0LjhDMTMuNiAxMiAxMyAxMyAxMiAxMy42djIuMmgzYTguOCA4LjggMCAwIDAgMi42LTYuNnoiIGZpbGw9IiM0Mjg1RjQiIGZpbGwtcnVsZT0ibm9uemVybyIvPjxwYXRoIGQ9Ik05IDE4YzIuNCAwIDQuNS0uOCA2LTIuMmwtMy0yLjJhNS40IDUuNCAwIDAgMS04LTIuOUgxVjEzYTkgOSAwIDAgMCA4IDV6IiBmaWxsPSIjMzRBODUzIiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48cGF0aCBkPSJNNCAxMC43YTUuNCA1LjQgMCAwIDEgMC0zLjRWNUgxYTkgOSAwIDAgMCAwIDhsMy0yLjN6IiBmaWxsPSIjRkJCQzA1IiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48cGF0aCBkPSJNOSAzLjZjMS4zIDAgMi41LjQgMy40IDEuM0wxNSAyLjNBOSA5IDAgMCAwIDEgNWwzIDIuNGE1LjQgNS40IDAgMCAxIDUtMy43eiIgZmlsbD0iI0VBNDMzNSIgZmlsbC1ydWxlPSJub256ZXJvIi8+PHBhdGggZD0iTTAgMGgxOHYxOEgweiIvPjwvZz48L3N2Zz4="
            alt="Google"
            style={{ height: '18px', marginRight: '10px' }}
          />
          Login with Google
        </button>

        <p className="text-center mt-2" style={{ color: '#6c757d' }}>
          Don't have an account? <a href="/register" style={{ color: '#4263eb', textDecoration: 'none', fontWeight: '500' }}>Register</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
