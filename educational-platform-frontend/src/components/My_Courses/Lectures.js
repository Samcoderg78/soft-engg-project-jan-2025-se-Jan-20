// import React, { useState } from "react";
// import { useParams } from "react-router-dom";
// import Sidebar from "./Sidebar";
// import Topbar from "./Topbar";
// import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS

// const LecturePage = () => {
//   const { week, lecture } = useParams();
//   const [notes, setNotes] = useState([]);
//   const [currentNote, setCurrentNote] = useState("");

//   const handleTakeNotes = () => {
//     const timestamp = new Date().toLocaleTimeString();
//     setNotes([...notes, { timestamp, note: currentNote }]);
//     setCurrentNote("");
//   };

//   return (
//     <div className="container-fluid p-0">
//       {/* Topbar */}
//       <div className="row">
//         <div className="col-12">
//           <Topbar />
//         </div>
//       </div>

//       {/* Main Content Area */}
//       <div className="row">
//         {/* Sidebar */}
//         <div className="col-md-2 p-0">
//           <Sidebar />
//         </div>

//         {/* Main Content */}
//         <div className="col-md-10 p-4">
//           <div className="lecture-page">
//             <h2>{`Week ${week} - ${lecture}`}</h2>
//             <video controls width="50%">
//               <source src={'#'} type="video/mp4" />
//               Your browser does not support the video tag.
//             </video>
//             <div className="mt-3">
//               <textarea
//                 value={currentNote}
//                 onChange={(e) => setCurrentNote(e.target.value)}
//                 placeholder="Take notes..."
//                 className="form-control mb-2"
//                 rows="4"
//               />
//               <button onClick={handleTakeNotes} className="btn btn-primary">
//                 Take Notes
//               </button>
//             </div>
//             <div className="mt-3">
//               <h3>Notes:</h3>
//               {notes.map((note, index) => (
//                 <div key={index} className="mb-2">
//                   <strong>{note.timestamp}:</strong> {note.note}
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LecturePage;


import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Lectures.css"; // Import the new CSS file

const LecturePage = () => {
  const { week, lecture } = useParams();
  const [notes, setNotes] = useState([]);
  const [currentNote, setCurrentNote] = useState("");

  const handleTakeNotes = () => {
    const timestamp = new Date().toLocaleTimeString();
    setNotes([...notes, { timestamp, note: currentNote }]);
    setCurrentNote("");
  };

  return (
    <div className="app-container">
      {/* Topbar */}
      <Topbar />

      {/* Main Content Container */}
      <div className="content-container">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="main-content">
          <div className="lecture-page">
            <h2 className="lecture-title">{`Week ${week} - ${lecture}`}</h2>
            <div className="video-container">
              <video controls>
                <source src={"#"} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>

            {/* Notes Section */}
            <div className="notes-section">
              <textarea
                value={currentNote}
                onChange={(e) => setCurrentNote(e.target.value)}
                placeholder="Take notes here..."
                className="notes-textarea"
              />
              <button onClick={handleTakeNotes} className="notes-button">
                Save Note
              </button>
            </div>

            {/* Display Notes */}
            <div className="notes-display">
              <h3>Your Notes</h3>
              <div className="notes-list">
                {notes.map((note, index) => (
                  <div key={index} className="note-item">
                    <strong>{note.timestamp}:</strong> {note.note}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LecturePage;
