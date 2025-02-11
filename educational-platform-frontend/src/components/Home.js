import { Link } from "react-router-dom";

const Home = () => {
   return (
     <div>
       <h1>This is the SE Project Educational AI App for Students</h1>
       <p>Welcome to our platform, designed to help students learn and improve through AI-powered educational tools.</p>
       <div>
       <Link to="/login">Login</Link> | <Link to="/register">Register</Link>       
       </div>
     </div>
     
   );
 };
 
 export default Home;
 