import React, { useState } from "react";
import Sidebar from "../StudentDashboard/Sidebar";
import Header from "../StudentDashboard/Header";
import "./AIAssistancePage.css";

export default function AIAssistancePage() {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setIsLoading(true);
    setError(null);
    setResponse(""); // Clear previous response
    
    try {
      const res = await fetch("http://localhost:3009/api/topic_simplification/ask-ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });
      
      if (!res.ok) {
        throw new Error(`API Error: ${res.status}`);
      }
      
      const data = await res.json();
      console.log("API Response:", data);
      
      const aiResponse = data;
      if (!aiResponse) {
        throw new Error("Received empty response from API");
      }
      
      setResponse(aiResponse);
      setQuery(""); // Clear the input field after successful submission
    } catch (err) {
      setError(err.message);
      console.error("API Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <Header />
      <div className="dashboard-layout">
        <div className="sidebar-container">
          <Sidebar />
        </div>
        <div className="dashboard-content">
          <div className="ai-assistance-container">
            <h1>AI Study Assistance</h1>
            <h5>Get simplified explanations of topics you don't understand</h5>
            
            <form onSubmit={handleSubmit} className="ai-query-form">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask your study question..."
                className="search-input"
                disabled={isLoading}
              />
              <button 
                type="submit" 
                className="submit-button"
                disabled={isLoading || !query.trim()}
              >
                {isLoading ? "Generating Answer..." : "Get Answer"}
              </button>
            </form>

            {/* Response Container - Now properly spaced */}
            <div className="response-container">
              {isLoading && (
                <div className="loading-state">
                  <div className="spinner"></div>
                  <p>Generating your answer...</p>
                </div>
              )}
              
              {error && (
                <div className="error-state">
                  <p>Error: {error}</p>
                </div>
              )}
              
              {response && (
                <div className="ai-response">
                  <h3>AI Response:</h3>
                  <div className="response-content">
                    {response.split('\n').map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}