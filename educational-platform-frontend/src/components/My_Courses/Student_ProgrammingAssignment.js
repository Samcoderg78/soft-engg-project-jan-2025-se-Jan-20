import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import "bootstrap/dist/css/bootstrap.min.css";
import "./ProgrammingAssignment.css";

const ProgrammingAssignment = () => {
  const { courseId, weekNumber } = useParams();
  const [language, setLanguage] = useState("python");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [assignment, setAssignment] = useState(null);
  const [publicTestCases, setPublicTestCases] = useState([]);
  const [privateTestCases, setPrivateTestCases] = useState([]);
  const [testResult, setTestResult] = useState({ passed: 0, total: 0, cases: [] });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(null);


  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        const response = await fetch(`http://localhost:3009/api/prog-assignment/course/${courseId}`);
        const data = await response.json();
        const gradedAssignment = data.find(item => item.title === weekNumber);
        if (gradedAssignment) {
          setAssignment(gradedAssignment);
          setPublicTestCases(getPublicTestCases(gradedAssignment.question));
          setPrivateTestCases(getPrivateTestCases(gradedAssignment.question));
        }
      } catch (error) {
        console.error("Error fetching assignment:", error);
      }
    };

    const checkSubmissionStatus = async () => {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || !user._id || !assignment?._id) return;
    
      try {
        const response = await fetch(`http://localhost:3009/api/prog-assignment/score/${user._id}/${assignment._id}`);
        const data = await response.json();
    
        if (data.score !== undefined) {
          setIsSubmitted(true);
          setScore(data.score);
        }
        
      } catch (error) {
        console.error("Error fetching score:", error);
      }
    };
    
    

    fetchAssignment();
    checkSubmissionStatus();
  }, [courseId, weekNumber, assignment?._id]);

  useEffect(() => {
    setAssignment(null);
    setCode("");
    setTestResult({ passed: 0, total: 0, cases: [] });
  }, [weekNumber]);

  const getPublicTestCases = (question) => {
    if (question.includes("adds two numbers")) {
      return [
        { input: "3 5", expectedOutput: "8" },
        { input: "10 20", expectedOutput: "30" },
      ];
    } else if (question.includes("first n prime numbers")) {
      return [
        { input: "5", expectedOutput: "2 3 5 7 11" },
        { input: "3", expectedOutput: "2 3 5" },
      ];
    }
    return [];
  };

  const getPrivateTestCases = (question) => {
    if (question.includes("adds two numbers")) {
      return [
        { input: "50 50", expectedOutput: "100" },
        { input: "-10 30", expectedOutput: "20" },
      ];
    } else if (question.includes("first n prime numbers")) {
      return [
        { input: "10", expectedOutput: "2 3 5 7 11 13 17 19 23 29" },
        { input: "7", expectedOutput: "2 3 5 7 11 13 17" },
      ];
    }
    return [];
  };

  const runCode = async (testCases, isPublic = true) => {
    if (!language || !code) {
      alert("Please select a language and enter code.");
      return;
    }
    
    if (assignment?.question.includes("adds two numbers") && !/def\s+add_numbers\s*\(\s*a\s*,\s*b\s*\)\s*:/.test(code)) {
      alert("Your function must be named 'add_numbers' with two parameters (a, b)." );
      return;
    }
    if (assignment?.question.includes("first n prime numbers") && !/def\s+first_n_primes\s*\(\s*n\s*\)\s*:/.test(code)) {
      alert("Your function must be named 'first_n_primes' with one parameter (n)." );
      return;
    }
    
    setLoading(true);
    let passedCount = 0;
    let results = [];

    const wrappedCode = `${code}

if __name__ == "__main__":
    import sys
    def is_function_defined(name):
        return name in globals()

    for line in sys.stdin:
        input_value = line.strip()
        if is_function_defined("first_n_primes"):
            print(first_n_primes(int(input_value)))
        elif is_function_defined("add_numbers"):
            print(add_numbers(*map(int, input_value.split())))
        else:
            print("Error: Required function is not defined")
    `;

    for (const testCase of testCases) {
      try {
        const response = await fetch("https://emkc.org/api/v2/piston/execute", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            language,
            version: "3.10.0",
            files: [{ content: wrappedCode }],
            stdin: testCase.input,
          }),
        });
        const data = await response.json();
        let actualOutput = data.run?.stderr ? `Error: ${data.run.stderr.trim()}` : data.run.stdout.trim();
        if (actualOutput === testCase.expectedOutput) passedCount++;
        results.push({ input: testCase.input, expectedOutput: testCase.expectedOutput, actualOutput });
      } catch (error) {
        results.push({ input: testCase.input, expectedOutput: "N/A", actualOutput: `Error: ${error.message}` });
      }
    }
    setTestResult({ passed: passedCount, total: testCases.length, cases: results, isPublic });
    setLoading(false);

    if (!isPublic) {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || !user._id) {
        alert('User not found');
        return;
      }
    
      let score = passedCount === testCases.length ? 100 : passedCount > 0 ? 50 : 0;
    
      try {
        const response = await fetch("http://localhost:3009/api/prog-assignment/score/update", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: user._id,
            assignment_id: assignment?._id,
            score: score,
          }),
        });
    
        const result = await response.json();
        console.log("Score Update Response:", result);
    
        if (!response.ok) {
          throw new Error(`Server Error: ${response.status} - ${result.message}`);
        }
      } catch (error) {
        console.error("Error updating score:", error);
        alert("Failed to update score: " + error.message);
      }
    }
  };

  return (
    <div className="pa-container">
      <Topbar />
      <div className="pa-sidebar">
        <Sidebar />
      </div>
      <div className="pa-header">
  <h2>Programming Assignment</h2>
  {assignment && <p>Deadline: {new Date(assignment.due_date).toLocaleDateString()}</p>}
  {isSubmitted && score !== null && <p style={{ color: "blue" }}>🎯 Your Score: {score}</p>}
</div>

      <div className="pa-main">
        <div className="pa-problem-section">
          <h4>Problem</h4>
          <p>{assignment ? assignment.question : "Loading question..."}</p>
          {isSubmitted && <p style={{ color: "green" }}>✅ Assignment already submitted.</p>}
          <select className="pa-select-language" value={language} onChange={(e) => setLanguage(e.target.value)}>
            <option value="python">Python</option>
          </select>
          <textarea className="pa-code-editor" rows="6" placeholder="Write your response..." value={code} onChange={(e) => setCode(e.target.value)}></textarea>
          <div className="pa-buttons">
            <button className="pa-btn pa-test-run" onClick={() => runCode(publicTestCases, true)} disabled={loading}>{loading ? "Running..." : "Test Run"}</button>
            <button className="pa-btn pa-submit" onClick={() => runCode(privateTestCases, false)} disabled={isSubmitted}>
  Submit
</button>
          </div>
        </div>
        <div className="pa-test-result-section">
          <h4>Test Run Result</h4>
          <p>{testResult.passed}/{testResult.total} {testResult.isPublic ? "public" : "private"} test cases passed</p>
          <h5>{testResult.isPublic ? "Public" : "Private"} Test Cases</h5>

          <div className="pa-test-case-table">
            {testResult.cases.map((test, index) => (
              <div key={index} className="pa-test-case-row">
                <div>{test.input}</div>
                <div>{test.expectedOutput}</div>
                <div style={{ color: test.actualOutput.startsWith("Error") ? "red" : "black" }}>{test.actualOutput}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgrammingAssignment;
