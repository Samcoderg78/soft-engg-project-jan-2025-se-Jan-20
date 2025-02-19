import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const Suggestions = () => {
  const [activeLecture, setActiveLecture] = useState(null);
  const courseName = "Software Engineering"; // Course name for TopBar
  const location = useLocation();
  const data = location.state;

  return (
    <div className="suggestions-page" style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      {/* Top Bar */}
      <Topbar />
      
      <div className="content" style={{ display: "flex", flex: 1 }}>
        {/* Sidebar with setActiveLecture passed as prop */}
        <Sidebar />
        
        <div className="main-content" style={{ flex: 1, padding: "20px" }}>
          <div className="suggestion">
            <div className="container mt-5 text-center">
              <h2>Suggestions Page</h2>
            </div>
            <div className="container p-0 mb-3 mt-5">
              <h5>{data.q}</h5>
              <h5>Here are some suggestions based on this question :- </h5>
            </div>
            <div className="container p-2 mb-3 border rounded">
              <h6 className="text-center">Watch the following lecture</h6>
              <p className="text-center"><a href="/link">Video link</a></p>
            </div>
            <div className="container p-2 mb-3 border rounded">
              <h6 className="text-center">Step 1 : Read this</h6>
              <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry...</p>
            </div>
            <div className="container p-2 mb-3 border rounded">
              <h6 className="text-center">Step 2 : Read this</h6>
              <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry...</p>
            </div>
            <div className="container p-2 mb-3 border rounded">
              <h6 className="text-center">Relevant Formulas</h6>
              <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry...</p>
            </div>
            <div className="container p-2 mb-3 border rounded">
              <h6 className="text-center">Important Links</h6>
              <p><a href="/link">Default link</a></p>
              <p><a href="/link">Default link</a></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Suggestions;
