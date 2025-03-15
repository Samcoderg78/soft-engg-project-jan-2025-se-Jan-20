// import { Link } from "react-router-dom";
// import 'bootstrap/dist/css/bootstrap.min.css';
// import '../styles/home.css';

// const Home = () => {
//   return (
//     <div className="container d-flex flex-column justify-content-center align-items-center min-vh-100 text-center">
//       <div className="card p-5 shadow-lg border-light" style={{ maxWidth: '700px', marginTop: '50px' }}>
//         <h1 className="fw-bold mb-4">Welcome to the SE Project Educational AI App</h1>
//         <p className="lead mb-4 text-muted">Our platform is designed to help students learn and improve through AI-powered educational tools, personalized learning paths, and performance tracking.</p>
        
//         <div>
//           <Link to="/login" className="btn btn-primary btn-lg me-3 mb-3 mb-md-0">Login</Link>
//           <Link to="/register" className="btn btn-outline-primary btn-lg mb-3 mb-md-0">Register</Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Home;


import { Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/home.css';  // Import the scoped CSS

const Home = () => {
  return (
    <div className="home-page"> {/* Scoped class */}
      <div className="container d-flex flex-column justify-content-center align-items-center min-vh-100 text-center">
        <div className="card p-5 shadow-lg border-light" style={{ maxWidth: '700px', marginTop: '50px' }}>
          <h1 className="fw-bold mb-4">Welcome to the SE Project Educational AI App</h1>
          <p className="lead mb-4 text-muted">
            Our platform is designed to help students learn and improve through AI-powered educational tools, 
            personalized learning paths, and performance tracking.
          </p>
          
          <div>
            <Link to="/login" className="btn btn-primary btn-lg me-3 mb-3 mb-md-0">Login</Link>
            <Link to="/register" className="btn btn-outline-primary btn-lg mb-3 mb-md-0">Register</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
