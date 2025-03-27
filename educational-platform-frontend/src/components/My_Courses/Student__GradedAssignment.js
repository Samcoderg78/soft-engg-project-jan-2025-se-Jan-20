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
  const [lastSubmitted, setLastSubmitted] = useState(null);
  const [scores, setScores] = useState({});
  const [totalScore, setTotal] = useState();
  const [difficultQuestions, setDifficultQuestions] = useState([]);


  useEffect(() => {
    const fetchQuestionsAndResponses = async () => {
      try {
        
        setQuestions([]);
        setAssignmentDetails({});
        setResponses({});
        setLastSubmitted(null);
        setScores({});
        setTotal(0)

        const response = await fetch(`http://localhost:3009/api/assignment/questions/${assignmentId}`);
        if (!response.ok) throw new Error("Error fetching questions");
        const data = await response.json();
        setQuestions(data.questions);
        setAssignmentDetails(data.assignment);
  
        // Fetch previous responses if available
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || !user._id) {
          console.error("User not found");
          return;
        }
  
        const responseRes = await fetch(`http://localhost:3009/api/assignment/response/${user._id}/${assignmentId}`);
        if (!responseRes.ok) {
          console.warn("No previous responses found");
          return;
        }
        const responsesData = await responseRes.json();
  
        // Transform responsesData into state format
        const prefilledResponses = responsesData.responses.reduce((acc, item) => {
          acc[item.question_id] = item.response; // response is already an array
          return acc;
        }, {});

        setResponses(prefilledResponses);
        setLastSubmitted(responsesData.submitted_on);
        // **Fetch Scores if Deadline Passed & Response Exists**
        if (new Date(data.assignment.due_date) < new Date()) {
          const generateScoreRes = await fetch(`http://localhost:3009/api/assignment/score/generate/${assignmentId}`, {
            method: "POST",
          });

          if (generateScoreRes.ok) {
            console.log("Score generated successfully");
            const scoreRes = await fetch(`http://localhost:3009/api/assignment/score/${user._id}/${assignmentId}`);
              if (scoreRes.ok) {
                const scoreData = await scoreRes.json();
                if (scoreData.assignmentScore.scores.length > 0) {
                  const scoreMap = scoreData.assignmentScore.scores.reduce((acc, item) => {
                    acc[item.question_id] = item.score;
                    return acc;
                  }, {});
                  setScores(scoreMap);
                  setTotal(scoreData.assignmentScore.total_score)
                }
              }
            } else {
              console.error("Failed to generate score");
            }
          }
      } catch (error) {
        console.error(error);
      }
    };

    const fetchDifficultQuestions = async () => {
      try {
        setDifficultQuestions([]);
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || !user._id) {
          console.error("User not found");
          return;
        }
        const response = await fetch(`http://localhost:3009/api/difficultquestions/${user._id}/${courseId}`);
        if (!response.ok) throw new Error("Error fetching difficult questions");
        const data = await response.json();
        setDifficultQuestions(data.map(q => q.question._id));
      } catch (error) {
        console.error(error);
      }
    };
    
    fetchQuestionsAndResponses();
    fetchDifficultQuestions();
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

  const handleMarkAsDifficult = async (question_id, isChecked) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || !user._id) {
        console.error("User not found");
        return;
      }

      if (isChecked) {
        // ADD to Difficult List
        const response = await fetch(`http://localhost:3009/api/difficultquestions/markasdifficult`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: user._id, assignment_id: assignmentId, question: question_id }),
        });
  
        if (!response.ok) throw new Error("Error marking question as difficult");
        setDifficultQuestions(prev => [...prev, question_id]); // Add to state
        alert("Question marked as difficult!");
      } else {
        // REMOVE from Difficult List
        const response = await fetch(`http://localhost:3009/api/difficultquestions/remove/${user._id}/${question_id}`, {
          method: "DELETE",
        });
  
        if (!response.ok) throw new Error("Error removing question from difficult");
        setDifficultQuestions(prev => prev.filter(q => q !== question_id)); // Remove from state
        alert("Question removed from difficult!");
      }
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
            <p style={{ color: "red", fontWeight: "bold" }}>Deadline : {new Date(assignmentDetails.due_date).toLocaleString()}</p>
            {lastSubmitted && (
              <p style={{ color: "green", fontWeight: "bold" }}>Last Submitted : {new Date(lastSubmitted).toLocaleString()}</p>
            )}
          </div>
          <div className="container mt-5">
            <form>
              {Questions.map((q, index) => (
                <div
                  key={index}
                  className="p-3 mb-3 border rounded d-flex flex-column align-items-start"
                >
                  <p className="a-question">{index + 1} .{q.question}</p>
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
                            checked={responses[q._id]?.includes(a) || false}
                            disabled={new Date(assignmentDetails.due_date) < new Date()}
                          />
                        ) : (
                          <input
                            className="form-check-input"
                            type="checkbox"
                            name={`question-${index}`}
                            value={a}
                            id={`option-${index}-${i}`}
                            onChange={() => handleResponseChange(q._id, a, true)}
                            checked={responses[q._id]?.includes(a) || false}
                            disabled={new Date(assignmentDetails.due_date) < new Date()}
                          />
                        )}
                        {a}
                      </div>
                    ))}
                  </div>

                  {new Date(assignmentDetails.due_date) < new Date() && (
                    <div className="mt-2">
                      <p style={{ color: "blue", fontWeight: "bold" }}>
                        Score: {scores[q._id] ?? 0}
                      </p>
                      <p style={{ color: "green", whiteSpace: "pre-line" }}>
                        Correct Answers : {Array.isArray(q.correct_options) ? q.correct_options.join(",\n") : q.correct_options || "Not Available"}
                      </p>
                    </div>
                  )}
                  
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
                        checked={difficultQuestions.includes(q._id)}
                        onChange={(e) => handleMarkAsDifficult(q._id, e.target.checked)}
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
              {new Date(assignmentDetails.due_date) < new Date() ? (
                // If deadline has passed, show total marks
                <div style={{ 
                    color: "blue", 
                    fontSize: "18px", 
                    fontWeight: "bold", 
                    textAlign: "center",
                    marginTop: "20px"
                  }}>
                  Total Score: {totalScore !== null ? totalScore : "Fetching..."}
                </div>
              ) : (
                // If deadline is still active, show the submit button
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
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GradedAssignment;