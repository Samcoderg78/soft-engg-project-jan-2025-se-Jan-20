import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import "bootstrap/dist/css/bootstrap.min.css";
import "./ProgrammingAssignment.css";

const ProgrammingAssignment = () => {
  const { courseId, weekNumber } = useParams();
  const [language, setLanguage] = useState("python");
  const [code, setCode] = useState("");
  const [testRunLoading, setTestRunLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [assignment, setAssignment] = useState(null);
  const [publicTestCases, setPublicTestCases] = useState([]);
  const [privateTestCases, setPrivateTestCases] = useState([]);
  const [testResult, setTestResult] = useState({ passed: 0, total: 0, cases: [] });
  const [privateTestResult, setPrivateTestResult] = useState({ passed: 0, total: 0 });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(null);
  const [lastSubmissionDate, setLastSubmissionDate] = useState(null);
  const [actualSolution, setActualSolution] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);
  const [codeReview, setCodeReview] = useState("");

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        const response = await fetch(`http://localhost:3009/api/prog-assignment/course/${courseId}`);
        const data = await response.json();
        const gradedAssignment = data.find(item => item.title === weekNumber);
        if (gradedAssignment && gradedAssignment.due_date) {
          setAssignment(gradedAssignment);
          setPublicTestCases(getPublicTestCases(gradedAssignment.question));
          setPrivateTestCases(getPrivateTestCases(gradedAssignment.question));
          await checkSubmissionStatus(gradedAssignment._id);
        }
      } catch (error) {
        console.error("Error fetching assignment:", error);
      }
    };

    const checkSubmissionStatus = async (assignmentId) => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || !user._id || !assignmentId) return;
      
      try {
        // Check for existing submission
        const response = await fetch(`http://localhost:3009/api/prog-assignment/score/${user._id}/${assignmentId}`);
        const data = await response.json();
        
        if (data.score !== undefined) {
          setIsSubmitted(true);
          setScore(data.score);
          setLastSubmissionDate(data.submitted_on || new Date());
        }

        // Fetch the latest submitted code
        const resResponse = await fetch(`http://localhost:3009/api/prog-assignment/responses/course/${courseId}`);
        const responses = await resResponse.json();
        const userResponse = responses.find(r => r.user_id === user._id && r.assignment_id === assignmentId);
        if (userResponse) {
          setCode(userResponse.response);
          setActualSolution(userResponse.actual_solution || "");
        }
      } catch (error) {
        console.error("Error fetching submission data:", error);
      }
    };

    fetchAssignment();
  }, [courseId, weekNumber]);

  const getPublicTestCases = (question) => {
    if (question.includes("adds two numbers")) {
        return [
            { input: "3 5", expectedOutput: "8" },
            { input: "10 20", expectedOutput: "30" },
            { input: "-5 15", expectedOutput: "10" },
            { input: "100 200", expectedOutput: "300" },
            { input: "0 0", expectedOutput: "0" },
        ];
    } else if (question.includes("first n prime numbers")) {
        return [
            { input: "5", expectedOutput: "2 3 5 7 11" },
            { input: "3", expectedOutput: "2 3 5" },
            { input: "7", expectedOutput: "2 3 5 7 11 13 17" },
            { input: "10", expectedOutput: "2 3 5 7 11 13 17 19 23 29" },
            { input: "1", expectedOutput: "2" },
        ];
    } else if (question.includes("binary search")) {
        return [
            { input: "[1, 3, 5, 7, 9, 11] 5", expectedOutput: "2" },
            { input: "[2, 4, 6, 8, 10] 10", expectedOutput: "4" },
            { input: "[10, 20, 30, 40, 50] 30", expectedOutput: "2" },
            { input: "[1, 2, 3, 4, 5, 6, 7, 8, 9] 8", expectedOutput: "7" },
            { input: "[15, 25, 35, 45, 55] 60", expectedOutput: "-1" },
        ];
    } else if (question.includes("the maximum element")) {
        return [
            { input: "[10, 20, 30, 40, 50]", expectedOutput: "50" },
            { input: "[-100, -50, -25, -1]", expectedOutput: "-1" },
            { input: "[11, 22, 33, 44, 55]", expectedOutput: "55" },
            { input: "[0, -1, -2, -3, -4]", expectedOutput: "0" },
            { input: "[5, 15, 25, 35, 45]", expectedOutput: "45" },
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
    } else if (question.includes("binary search")) {
        return [
            { input: "[1, 2, 3, 4, 5, 6, 7, 8, 9] 8", expectedOutput: "7" },
            { input: "[10, 20, 30, 40, 50] 25", expectedOutput: "-1" },
        ];
    } else if (question.includes("maximum element")) {
        return [
            { input: "[1, 3, 5, 7, 9]", expectedOutput: "9" },
            { input: "[-5, -1, -10, -3]", expectedOutput: "-1" },
            { input: "[100]", expectedOutput: "100" },
            { input: "[2, 8, 6, 4, 10]", expectedOutput: "10" },
            { input: "[99, 77, 88, 66]", expectedOutput: "99" },
        ];
    }
    return [];
  };

  const validateFunction = () => {
    if (!assignment) return false;
    
    if (assignment.question.includes("adds two numbers") && !/def\s+add_numbers\s*\(\s*a\s*,\s*b\s*\)\s*:/.test(code)) {
      alert("Your function must be named 'add_numbers' with two parameters (a, b).");
      return false;
    }
    if (assignment.question.includes("first n prime numbers") && !/def\s+first_n_primes\s*\(\s*n\s*\)\s*:/.test(code)) {
      alert("Your function must be named 'first_n_primes' with one parameter (n).");
      return false;
    }
    if (assignment.question.includes("binary search") && !/def\s+binary_search\s*\(\s*arr\s*,\s*target\s*\)\s*:/.test(code)) {
      alert("Your function must be named 'binary_search' with two parameters (arr, target).");
      return false;
    }
    if (assignment.question.includes("maximum element") && !/def\s+find_maximum\s*\(\s*arr\s*\)\s*:/.test(code)) {
      alert("Your function must be named 'find_maximum' with one parameter (arr).");
      return false;
    }
    return true;
  };

  const runTestCases = async (testCases) => {
    if (!language || !code) {
      alert("Please select a language and enter code.");
      return { passed: 0, total: 0, cases: [] };
    }

    if (!validateFunction()) {
      return { passed: 0, total: 0, cases: [] };
    }

    let passedCount = 0;
    let results = [];

    const wrappedCode = `
${code}

if __name__ == "__main__":
    import sys
    import json

    def is_function_defined(name):
        return name in globals()

    for line in sys.stdin:
        input_value = line.strip()
        
        if is_function_defined("first_n_primes"):
            print(' '.join(map(str, first_n_primes(int(input_value)))))
        elif is_function_defined("add_numbers"):
            print(add_numbers(*map(int, input_value.split())))
        elif is_function_defined("binary_search"):
            try:
                arr_str, target_str = input_value.rsplit(" ", 1)
                arr = eval(arr_str)
                target = int(target_str)
                print(binary_search(arr, target))
            except:
                print("Error: Invalid input format for binary search")
        elif is_function_defined("find_maximum"):
            try:
                arr = json.loads(input_value)
                print(find_maximum(arr))
            except:
                print("Error: Invalid input format for find_maximum")
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
        results.push({ 
          input: testCase.input, 
          expectedOutput: testCase.expectedOutput, 
          actualOutput,
          passed: actualOutput === testCase.expectedOutput
        });
      } catch (error) {
        results.push({ 
          input: testCase.input, 
          expectedOutput: testCase.expectedOutput, 
          actualOutput: `Error: ${error.message}`,
          passed: false
        });
      }
    }

    return { passed: passedCount, total: testCases.length, cases: results };
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    
    return `${day} ${month} ${year}, ${hours}:${minutes}`;
  };

  const isPastDeadline = assignment && new Date() > new Date(assignment.due_date);

  const handleTestRun = async () => {
    setTestRunLoading(true);
    const result = await runTestCases(publicTestCases);
    setTestResult(result);
    setTestRunLoading(false);
  };

  const handleSubmit = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user._id || !assignment) {
      console.error("Submission failed - missing user or assignment data");
      return;
    }
  
    setSubmitLoading(true);
  
    try {
      // First run private test cases
      const privateResult = await runTestCases(privateTestCases);
      
      // Calculate score
      const publicResult = await runTestCases(publicTestCases);
      const totalPassed = privateResult.passed + publicResult.passed;
      const totalCases = privateTestCases.length + publicTestCases.length;
      const calculatedScore = Math.round((totalPassed / totalCases) * 100);

      // Prepare submission data
      const submissionData = {
        user_id: user._id,
        assignment_id: assignment._id,
        course_id: courseId,
        response: code,
        actual_solution: getActualSolutionCode(assignment.question)
      };

      // Submit to backend
      const response = await fetch("http://localhost:3009/api/prog-assignment/submit", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(submissionData),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || "Failed to submit assignment");
      }

      // Update score
      const scoreResponse = await fetch("http://localhost:3009/api/prog-assignment/score/update", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          user_id: user._id,
          assignment_id: assignment._id,
          score: calculatedScore,
        }),
      });

      const scoreData = await scoreResponse.json();

      if (!scoreResponse.ok) {
        throw new Error(scoreData.message || "Failed to update score");
      }

      // Update UI state
      setIsSubmitted(true);
      setScore(calculatedScore);
      setTestResult(publicResult);
      setPrivateTestResult({
        passed: privateResult.passed,
        total: privateResult.total
      });
      setLastSubmissionDate(new Date());
      setActualSolution(submissionData.actual_solution);

      alert("Assignment submitted successfully!");
    } catch (error) {
      console.error("Full submission error:", error);
      alert(`Submission failed: ${error.message}`);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleCodeReview = async () => {
    if (!code.trim()) {
      alert("Please write some code before requesting a review");
      return;
    }

    setReviewLoading(true);
    try {
      const response = await fetch("http://localhost:3009/api/programming/code-review", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json"},
        body: JSON.stringify({
          code: code,
          context: "Programming Assignment"
        }),
      });
      // console.log(code);

      const data = await response.json();
      console.log(data);
      if (!response.ok) {
        throw new Error(data.message || "Failed to get code review");
      }
      setCodeReview(data.feedback || "No review available");
    } catch (error) {
      console.error("Code review error:", error);
      alert(`Failed to get code review: ${error.message}`);
      setCodeReview("");
    } finally {
      setReviewLoading(false);
    }
  };

  const getActualSolutionCode = (question) => {
    if (question.includes("adds two numbers")) {
      return "def add_numbers(a, b):\n    return a + b";
    } else if (question.includes("first n prime numbers")) {
      return `def first_n_primes(n):
    primes = []
    num = 2
    while len(primes) < n:
        is_prime = True
        for p in primes:
            if p*p > num:
                break
            if num % p == 0:
                is_prime = False
                break
        if is_prime:
            primes.append(num)
        num += 1
    return primes`;
    } else if (question.includes("binary search")) {
      return `def binary_search(arr, target):
    low = 0
    high = len(arr) - 1
    while low <= high:
        mid = (low + high) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1`;
    } else if (question.includes("maximum element")) {
      return `def find_maximum(arr):
    return max(arr)`;
    }
    return "No solution available";
  };

  return (
    <div className="pa-container">
      <Topbar />
      <div className="pa-sidebar">
        <Sidebar />
      </div>
      <div className="pa-header">
        <h2>Programming Assignment</h2>
        {assignment ? (
          <>
            <p>
              Deadline: {formatDate(assignment.due_date)}
            </p>
            {isSubmitted && (
              <p>
                Last Submission: {formatDate(lastSubmissionDate)}
              </p>
            )}
            {isSubmitted && score !== null && isPastDeadline && (
              <p style={{ color: "blue" }}>🎯 Your Score: {score}</p>
            )}
          </>
        ) : (
          <p>Loading assignment...</p>
        )}
      </div>

      <div className="pa-main">
        <div className="pa-problem-section">
          <h4>Problem</h4>
          <p>{assignment ? assignment.question : "Loading question..."}</p>
          {isSubmitted && !isPastDeadline && (
            <p style={{ color: "green" }}>✅ Assignment already submitted.</p>
          )}
          <select className="pa-select-language" value={language} onChange={(e) => setLanguage(e.target.value)}>
            <option value="python">Python</option>
          </select>
          <textarea 
            className="pa-code-editor" 
            rows="6" 
            placeholder="Write your response..." 
            value={code} 
            onChange={(e) => setCode(e.target.value)}
            disabled={isPastDeadline}
          ></textarea>
          <div className="pa-buttons">
  <button 
    className="pa-btn pa-test-run" 
    onClick={handleTestRun} 
    disabled={testRunLoading || submitLoading || reviewLoading || !assignment || isPastDeadline}
  >
    {testRunLoading ? "Running..." : "Test Run"}
  </button>
  <button 
    className="pa-btn pa-submit" 
    onClick={handleSubmit} 
    disabled={submitLoading || testRunLoading || reviewLoading || !assignment || isPastDeadline}
  >
    {!assignment ? "Loading..." : 
     isPastDeadline ? "Submission Closed" : 
     submitLoading ? "Submitting..." : "Submit"}
  </button>
  <button
    className="pa-btn pa-review"
    onClick={handleCodeReview}
    disabled={reviewLoading || submitLoading || testRunLoading || !assignment || !code.trim()}
  >
    {reviewLoading ? "Reviewing..." : "Code Review"}
  </button>
  <Link 
    to={assignment ? `/${courseId}/prog-suggestions` : "#"} 
    state={{ q: assignment?.question }} 
    className="text-primary"
  >
    Click here to get suggestions
  </Link>
</div>

{codeReview && (
  <div className="pa-code-review">
    <h4>Code Review</h4>
    <div className="pa-review-content">
      {codeReview.split('\n').map((line, index) => {
        // Handle bullet points
        if (line.trim().startsWith('*') && line.includes(' ')) {
          const bulletContent = line.trim().substring(1).trim();
          return (
            <div key={index} style={{ marginLeft: '20px', marginBottom: '8px' }}>
              • {bulletContent}
            </div>
          );
        }
        // Handle regular lines
        return (
          <div key={index} style={{ marginBottom: '8px' }}>
            {line}
          </div>
        );
      })}
    </div>
  </div>
)}

          {isPastDeadline && (
            <div className="pa-actual-solution">
              <h4>Actual Solution</h4>
              <textarea 
                className="pa-code-editor" 
                rows="6" 
                value={actualSolution || getActualSolutionCode(assignment?.question)} 
                readOnly
              ></textarea>
            </div>
          )}
        </div>
        
        <div className="pa-test-result-section">
          <h4>Test Results</h4>
          <p>Public Test Cases Passed: {testResult.passed}/{publicTestCases.length}</p>
          
          <h5>Test Case Details</h5>
          <div className="pa-test-case-table">
            {testResult.cases.map((test, index) => (
              <div key={index} className="pa-test-case-row">
                <div>Input: {test.input}</div>
                <div>Expected: {test.expectedOutput}</div>
                <div style={{ color: test.passed ? "green" : "red" }}>
                  Actual: {test.actualOutput}
                </div>
                <div>{test.passed ? "✓ Passed" : "✗ Failed"}</div>
              </div>
            ))}
          </div>

          {isSubmitted && (
            <p style={{ marginTop: '20px' }}>
              Private Test Cases Passed: {privateTestResult.passed}/{privateTestCases.length}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgrammingAssignment;