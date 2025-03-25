import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import "../../styles/assignment.css";

const GradedAssignment = () => {

  const { assignmentId,courseId } = useParams();

  const [Questions, setQuestions] = useState([]);
  const [assignmentDetails, setAssignmentDetails] = useState({})
  const [responses, setResponses] = useState({});

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(`http://localhost:3009/api/assignment/questions/${assignmentId}`);
        if (!response.ok) throw new Error("Error fetching questions");
        const data = await response.json();
        setQuestions(data.questions);
        setAssignmentDetails(data.assignment)
      } catch (error) {
        console.error(error);
      }
    };

    fetchQuestions();
  }, [assignmentId]);
  
  const handleResponseChange = (question_id, answer, isMulti) => {
    setResponses((prevResponses) => {
      if (isMulti) {
        // For multi-select (checkbox), add/remove values from the array
        const prevAnswers = prevResponses[question_id] || [];
        const updatedAnswers = prevAnswers.includes(answer)
          ? prevAnswers.filter((ans) => ans !== answer) // Remove if already selected
          : [...prevAnswers, answer]; // Add if not selected
  
        return { ...prevResponses, [question_id]: updatedAnswers };
      } else {
        // For single-select (radio), replace the value
        return { ...prevResponses, [question_id]: [answer] };
      }
    });
  };
  

  const submitAssignment = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || !user._id) {
        console.error("user not found")
        return;
      }

      const assignmentData = {
        user_id : user._id,
        assignment_id : assignmentId,
        responses: Object.entries(responses).map(([question_id, response]) => ({
          question_id,
          response: response // Store as an array
        })),
      };

      const response = await fetch(`http://localhost:3009/api/assignment/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(assignmentData),
      });

      if (!response.ok) throw new Error("Error submitting assignment");

      alert("Assignment submitted successfully!");
    } catch (error) {
      console.error(error);
    }
  };

  const handleMarkAsDifficult = async (question_id) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || !user._id) {
        console.error("user not found")
        return;
      }
      
      const assignmentData = {
        user_id : user._id,
        assignment_id : assignmentId,
        question : question_id
      };
  
      const response = await fetch(`http://localhost:3009/api/difficultquestions/markasdifficult`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(assignmentData),
      });
  
      if (!response.ok) throw new Error("Error marking question as difficult");
  
      alert("Question marked as difficult!");
    } catch (error) {
      console.error(error);
    }
  };  

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <Topbar courseName="React MERN Course" />
      <div
        className="content"
        style={{ display: "flex", flex: 1, overflow: "hidden" }}
      >
        <Sidebar />
        <div
          className="main-content"
          style={{ flex: 1, padding: "20px", overflowY: "auto", marginLeft: "250px" }}
        >
          <div className="container mt-5 text-center">
            <h2>{assignmentDetails.title}</h2>
            <p>Deadline : {assignmentDetails.due_date}</p>
          </div>
          <div className="container mt-5">
            <form>
              {Questions.map((q, index) => (
                <div
                  key={index}
                  className="p-3 mb-3 border rounded d-flex flex-column align-items-start"
                >
                  {index + 1} .{q.question}
                  <div className="mb-2">
                    {q.options.map((a, i) => (
                      <div key={i} className="form-check">
                        {q.type === "single" ? (
                          <input
                            className="form-check-input"
                            type="radio"
                            name={`question-${index}`}
                            value={a}
                            id={`option-${index}-${i}`}
                            onChange={() => handleResponseChange(q._id, a, false)}
                          />
                        ) : (
                          <input
                            className="form-check-input"
                            type="checkbox"
                            name={`question-${index}`}
                            value={a}
                            id={`option-${index}-${i}`}
                            onChange={() => handleResponseChange(q._id, a, true)}
                          />
                        )}
                        {a}
                      </div>
                    ))}
                  </div>
                  <div className="d-flex justify-content-between w-100">
                    <Link
                      to={`/${courseId}/suggestions`}
                      state={{ q: q.question }}
                      className="text-primary"
                    >
                      Click here to get suggestions
                    </Link>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={`difficult-${index}`}
                        onChange={() => handleMarkAsDifficult(q._id)}
                      />
                      <label
                        className="form-check-label ms-2"
                        htmlFor={`difficult-${index}`}
                      >
                        Mark as difficult
                      </label>
                    </div>
                  </div>
                </div>
              ))}
              <button
                type="button"
                style={{
                  background: "linear-gradient(135deg, #6a11cb, #2575fc)",
                  color: "white",
                  fontSize: "18px",
                  fontWeight: "bold",
                  padding: "12px 24px",
                  border: "none",
                  borderRadius: "8px",
                  transition: "all 0.3s ease-in-out",
                  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
                  cursor: "pointer",
                  display: "block",
                  margin: "20px auto",
                  textAlign: "center",
                }}
                onMouseOver={(e) => (e.target.style.transform = "scale(1.05)")}
                onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
                onMouseDown={(e) => (e.target.style.transform = "scale(0.98)")}
                onMouseUp={(e) => (e.target.style.transform = "scale(1.05)")}
                onClick={submitAssignment}
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GradedAssignment;