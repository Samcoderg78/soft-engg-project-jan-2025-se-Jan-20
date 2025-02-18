import { useState } from "react";
import { useNavigate } from "react-router-dom";


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Dummy authentication check (Replace with backend auth)
    if (email === "test@example.com" && password === "password") {
      alert("Login successful!");
      navigate("/quiz-dashboard"); // Redirect to Dashboard
    } else {
      alert("Invalid credentials");
    }
  };

  const handleGoogleLogin = () => {
    window.alert('Google Login Clicked');
    // Integrate Google OAuth Here (Example: Firebase, Passport.js, etc.)
  };


  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
    <div className="card p-4 shadow" style={{ maxWidth: '400px', width: '100%' }}>
      <h2 className="text-center mb-4">Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <input
            type="email"
            className="form-control"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
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
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">
          Login
        </button>
      </form>

      <div className="text-center mt-3">
          <button className="btn btn-danger w-100 d-flex align-items-center justify-content-center" onClick={handleGoogleLogin}>
            <img
             // src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png"
              // alt="Google Logo"
              style={{ width: '20px', marginRight: '10px' }}
            />
            Login with Google
          </button>
        </div>

      <p className="text-center mt-3">
        Don't have an account? <a href="/register">Register</a>
      </p>
    </div>
  </div>
     
  );
};

export default Login;
