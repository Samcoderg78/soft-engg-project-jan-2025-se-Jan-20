import React,{ useState } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const Suggestions = () => {

  const [activeLecture, setActiveLecture] = useState(null);
  const courseName = "Software Engineering"; // Course name for TopBar
  const location = useLocation();
  const data = location.state;

  return (
    <div className="d-flex">
    {/* Sidebar with setActiveLecture passed as prop */}
    <Sidebar setActiveLecture={setActiveLecture} />

    <div className="main-content flex-grow-1">
    {/* Top Bar */}
    <Topbar courseName={courseName} />

    
    <div className="suggestion">
      <div className="container mt-5 text-center">
      <h2>Suggestions Page</h2>
      </div>
      <div className="container p-0 mb-3 mt-5">
      <h5>{ data.q }</h5>
      <h5>Here are some suggestions based on this question :- </h5>
      </div>
      <div className="container p-2 mb-3 border rounded">
      <h6 className="text-center">Watch the following lecture</h6>
      <p className="text-center"><a href="/link">Video link</a></p>
    </div>
      <div className="container p-2 mb-3 border rounded">
      <h6 className="text-center">Step 1 : Read this</h6>
      <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>

    </div>
      <div className="container p-2 mb-3 border rounded">
      <h6 className="text-center">Step 2 : Read this</h6>
      <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>

    </div>
      <div className="container p-2 mb-3 border rounded">
      <h6 className="text-center">Revelant Formulas</h6>
      <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
    </div>
      <div className="container p-2 mb-3 border rounded">
      <h6 className="text-center">Important Links</h6>
      <p><a href="/link">Default link</a></p>
      <p><a href="/link">Default link</a></p>
    </div>
    </div>
    </div>
    </div>
  );
};

export default Suggestions;