import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import "./AIAssistancePage.css";

export default function AIAssistancePageInstructor() {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setIsLoading(true);
    setError(null);
    setResponse(null); // Clear previous response
    
    try {
      const res = await fetch("http://localhost:3009/api/instructor/instructor-query", {
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
      
      if (!data) {
        throw new Error("Received empty response from API");
      }
      
      setResponse(data);
      setQuery(""); // Clear the input field after successful submission
    } catch (err) {
      setError(err.message);
      console.error("API Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to render response content
  const renderResponseContent = (responseData) => {
    // Handle both string and object responses
    let responseText = '';
    
    if (typeof responseData === 'string') {
      responseText = responseData;
    } else if (typeof responseData === 'object' && responseData !== null) {
      // If response is an object with a 'response' property
      responseText = responseData.response || JSON.stringify(responseData);
    } else {
      responseText = String(responseData);
    }
  
    // Remove "response:" prefix if it exists at the start
    responseText = responseText.replace(/^response:/i, '').trim();
    
    // Remove markdown bold formatting (**word** becomes word)
    responseText = responseText.replace(/\*\*(.*?)\*\*/g, '$1');
    
    // Split by newlines and render each paragraph
    return responseText.split('\n').map((paragraph, index) => (
      paragraph.trim() ? (
        <p key={index} style={{ marginBottom: '12px' }}>
          {paragraph}
        </p>
      ) : null
    )).filter(Boolean);
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
            <h1>AI Instructor Assistance</h1>
            <h5>Get AI-powered support for your teaching needs</h5>
            
            <form onSubmit={handleSubmit} className="ai-query-form">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask your teaching question..."
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

            {/* Response Container */}
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
                    {renderResponseContent(response)}
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