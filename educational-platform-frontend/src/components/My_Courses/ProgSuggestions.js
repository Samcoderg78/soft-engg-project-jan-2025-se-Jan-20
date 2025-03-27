import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import ReactMarkdown from 'react-markdown';

const Suggestions = () => {
  const [activeLecture, setActiveLecture] = useState(null);
  const [ai_resources, setResources] = useState(null);
  const [ai_hints, setHints] = useState(null);
  const location = useLocation();
  const questionData = location.state;

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const searchQuery = {
            query : questionData.q
          }
        const response = await fetch(`http://localhost:3009/api/topic_simplification/ask-resources`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(searchQuery),
        });

        if (!response.ok) throw new Error("Error fetching suggestions");
        const data = await response.json();
        setResources(data);
      } catch (error) {
        console.error(error);
        setResources([]); // Set empty array on error
      }
    };

    const fetchHints = async () => {
        try {
          const searchQuery = questionData.q;
          const response = await fetch(`http://localhost:3009/api/programming/programming-hint`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              query: searchQuery,
              context: "Programming Assignment Question"
            }),
          });
          if (!response.ok) throw new Error("Error fetching suggestions");
          const data = await response.json();
          // Convert the single hint into an array of one hint
          setHints(data.hint ? [data.hint] : []); 
        } catch (error) {
          console.error(error);
          setHints([]);
        }
      };

    fetchResources();
    fetchHints();
  }, [questionData]);

  return (
    <div className="suggestions-page" style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Topbar />
      
      <div className="content" style={{ display: "flex", flex: 1 }}>
        <Sidebar />
        <div className="suggestion main-content" style={{ flex: 1, padding: "20px" }}>
          <div className="container mt-5 text-center">
            <h2>Suggestions Page</h2>
          </div>
          <div className="container p-0 mb-3 mt-5">
            <h5><p className="a-question"><b>Question</b> : {questionData.q}</p></h5>
            <h5><b>Here are some suggestions based on this question :- </b></h5>
          </div>

          {/* Render hints only if they exist */}
          {ai_hints && ai_hints.length > 0 && (
  <>
    {ai_hints.map((hint, index) => (
      <div key={index} className="container p-2 mb-3 border rounded">
        <h6 className="text-center"><b>Hint</b></h6>
        <h6 className="text-center"><ReactMarkdown>{hint}</ReactMarkdown></h6>
      </div>
    ))}
  </>
)}

          {/* Render resources only if they exist and have valid data */}
          {ai_resources && ai_resources.length > 0 && ai_resources[0]?.description !== "No resources generated." && (
            <div className="container p-2 mb-3 border rounded">
              <h5 className="text-center">Important Links</h5>
              {ai_resources.map((res, index) => (
                <div key={res._id || index}>
                  <a href={res.url.split('](')[0]} target="_blank" rel="noopener noreferrer"> 
                    {/* <p>{res.url.split('](')[0]}</p> */}
                    {/* filtering malformed-markdown links */}
                    <ReactMarkdown>{res.description}</ReactMarkdown>
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Suggestions;