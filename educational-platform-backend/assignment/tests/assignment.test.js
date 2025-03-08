const request = require("supertest");
const { app } = require("../../app");
const mongoose = require("mongoose");
const AssignmentResponse = require("../model/assignmentResponse");

let testAssignment;
let testQuestion;
let testUserId = "U123";
let testCourseId = "CSE101"

describe("Assignment API Tests", () => {
  const assignmentData = {
    course_id: "CSE101",
    week: 3,
    title: "Week 3 Assignment",
    type: "graded",
    due_date: new Date("2025-03-10"),
    total_marks: 100,
  };

//   afterAll(async () => {
//     await mongoose.connection.close();
//   });

  describe("POST /api/assignment/create", () => {
    it("should successfully create an assignment", async () => {
      const response = await request(app)
        .post("/api/assignment/create")
        .send(assignmentData)
        .expect(201);

      expect(response.body.message).toBe("Assignment created successfully");
      expect(response.body.assignment).toHaveProperty("_id");
      expect(response.body.assignment.course_id).toBe(assignmentData.course_id);
      expect(response.body.assignment.week).toBe(assignmentData.week);
      expect(response.body.assignment.title).toBe(assignmentData.title);
      expect(response.body.assignment.type).toBe(assignmentData.type);
      expect(new Date(response.body.assignment.due_date)).toEqual(assignmentData.due_date);
      expect(response.body.assignment.total_marks).toBe(assignmentData.total_marks);

      testAssignment = response.body.assignment;

    });

    it("should fail when required fields are missing", async () => {
      const incompleteAssignment = {
        course_id: "CSE101",
        week: 3,
        title: "Week 3 Assignment",
      };

      const response = await request(app)
        .post("/api/assignment/create")
        .send(incompleteAssignment)
        .expect(400);

      expect(response.body.message).toBe("Missing required fields");
    });

    it("should fail when type is invalid", async () => {
      const invalidTypeAssignment = { ...assignmentData, type: "invalid" };

      const response = await request(app)
        .post("/api/assignment/create")
        .send(invalidTypeAssignment)
        .expect(500);

      expect(response.body.message).toBe("Error creating assignment");
    });
  });
  describe('POST /api/assignment/questions/add', () => {
    it('should successfully add a question to an assignment', async () => {
      const questionData = {
        assignment_id: testAssignment._id, // Reusing the assignment created earlier
        question: "What is 2 + 2?",
        type: "single",
        options: ["1", "2", "3", "4"],
        category: "easy",
        full_marks: 5,
        correct_options: ["4"]
      };
  
      const response = await request(app)
        .post('/api/assignment/questions/add')
        .send(questionData)
        .expect(201);
  
      expect(response.body.message).toBe("Question added successfully");
      expect(response.body.question).toHaveProperty("assignment_id", testAssignment._id);
      expect(response.body.question).toHaveProperty("question", questionData.question);

      testQuestion = response.body.question;

    });
  
    it('should fail to add a question when required fields are missing', async () => {
      const incompleteData = {
        assignment_id: testAssignment._id,
        question: "Incomplete question"
      };
  
      const response = await request(app)
        .post('/api/assignment/questions/add')
        .send(incompleteData)
        .expect(400);
  
      expect(response.body.message).toBe("Missing required fields");
    });
  
    it('should fail to add a question for a non-existent assignment', async () => {
      const questionData = {
        assignment_id: "65f9f9f9f9f9f9f9f9f9f9f9", // Fake ID
        question: "Non-existent assignment?",
        type: "single",
        options: ["Yes", "No"],
        category: "medium",
        full_marks: 10,
        correct_options: ["Yes"]
      };
  
      const response = await request(app)
        .post('/api/assignment/questions/add')
        .send(questionData)
        .expect(404);
  
      expect(response.body.message).toBe("Assignment not found");
    });
  });
  describe('GET /api/assignment/:course_id', () => {
    it('should fetch all assignments for a given course', async () => {
      expect(testAssignment).toBeDefined(); // Ensure an assignment exists
  
      const response = await request(app)
        .get(`/api/assignment/${testAssignment.course_id}`)
        .expect(200);
  
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty("course_id", testAssignment.course_id);
    });
  
    it('should return 404 when no assignments exist for a course', async () => {
      const response = await request(app)
        .get('/api/assignment/NON_EXISTENT_COURSE')
        .expect(404);
  
      expect(response.body.message).toBe("No assignments found for this course");
    });
  });
  describe('GET /api/assignment/questions/:assignment_id', () => {
    it('should fetch an assignment along with its questions', async () => {
      expect(testAssignment).toBeDefined(); // Ensure an assignment exists
      expect(testQuestion).toBeDefined();   // Ensure a question exists
  
      const response = await request(app)
        .get(`/api/assignment/questions/${testAssignment._id}`)
        .expect(200);
  
      expect(response.body).toHaveProperty("assignment");
      expect(response.body.assignment).toHaveProperty("_id", testAssignment._id);
      expect(response.body).toHaveProperty("questions");
      expect(Array.isArray(response.body.questions)).toBe(true);
      expect(response.body.questions.length).toBeGreaterThan(0);
      expect(response.body.questions[0]).toHaveProperty("_id", testQuestion._id);
    });
  
    it('should return 404 when assignment does not exist', async () => {
      const response = await request(app)
        .get('/api/assignment/questions/000000000000000000000000')
        .expect(404);
  
      expect(response.body.message).toBe("Assignment not found");
    });
  });
  describe('POST /api/assignment/submit', () => {
  
    it('should successfully submit an assignment response', async () => {
      expect(testAssignment).toBeDefined(); // Ensure an assignment exists
      expect(testQuestion).toBeDefined();   // Ensure a question exists
  
      const responseData = {
        user_id: testUserId,
        assignment_id: testAssignment._id,
        responses: [
          {
            question_id: testQuestion._id,
            response: ["4"]
          }
        ]
      };
  
      const response = await request(app)
        .post('/api/assignment/submit')
        .send(responseData)
        .expect(201);
  
      expect(response.body.message).toBe("Assignment submitted successfully");
      expect(response.body).toHaveProperty("response");
      expect(response.body.response).toHaveProperty("user_id", testUserId);
      expect(response.body.response).toHaveProperty("assignment_id", testAssignment._id);
      expect(response.body.response.responses.length).toBeGreaterThan(0);
      expect(response.body.response.responses[0]).toHaveProperty("question_id", testQuestion._id);
      expect(response.body.response.responses[0].response).toContain("4");
    });
  
    it('should update an existing assignment response', async () => {
      const updatedResponseData = {
        user_id: testUserId,
        assignment_id: testAssignment._id,
        responses: [
          {
            question_id: testQuestion._id,
            response: ["3"] // Updated answer
          }
        ]
      };
  
      const response = await request(app)
        .post('/api/assignment/submit')
        .send(updatedResponseData)
        .expect(200);
  
      expect(response.body.message).toBe("Assignment response updated successfully");
      expect(response.body.response.responses[0].response).toContain("3"); // Ensure response was updated
    });
  
    it('should fail when required fields are missing', async () => {
      const incompleteData = {
        user_id: testUserId,
        assignment_id: testAssignment._id
        // Missing responses field
      };
  
      const response = await request(app)
        .post('/api/assignment/submit')
        .send(incompleteData)
        .expect(400);
  
      expect(response.body.message).toBe("Missing required fields");
    });
  
    it('should fail for a non-existent assignment', async () => {
      const invalidAssignmentData = {
        user_id: testUserId,
        assignment_id: "INVALID_ASSIGNMENT_ID",
        responses: [
          {
            question_id: testQuestion._id,
            response: ["4"]
          }
        ]
      };
  
      const response = await request(app)
        .post('/api/assignment/submit')
        .send(invalidAssignmentData)
        .expect(500);
  
      expect(response.body.message).toBe("Error submitting assignment");
    });
  });
  describe('GET /api/assignment/response/:user_id/:assignment_id', () => {
    it('should retrieve the submitted assignment response', async () => {
      expect(testAssignment).toBeDefined();
      expect(testUserId).toBeDefined();
  
      const response = await request(app)
        .get(`/api/assignment/response/${testUserId}/${testAssignment._id}`)
        .expect(200);
  
      expect(response.body).toHaveProperty("user_id", testUserId);
      expect(response.body).toHaveProperty("assignment_id", testAssignment._id);
      expect(response.body.responses.length).toBeGreaterThan(0);
    });
  
    it('should return 404 for a non-existent response', async () => {
      const response = await request(app)
        .get(`/api/assignment/response/${testUserId}/INVALID_ASSIGNMENT_ID`)
        .expect(404);
  
      expect(response.body.message).toBe("Assignment response not found");
    });
  });
  describe('POST /api/assignment/score/generate/:assignment_id', () => {
    it('should generate scores for all responses of an assignment', async () => {
      expect(testAssignment).toBeDefined();
      expect(testUserId).toBeDefined();
  
      const response = await request(app)
        .post(`/api/assignment/score/generate/${testAssignment._id}`)
        .expect(201);
  
      expect(response.body.message).toBe("Scores generated for all responses");
      expect(response.body.scores.length).toBeGreaterThan(0);
      response.body.scores.forEach(score => {
        expect(score).toHaveProperty("response_id");
        expect(score).toHaveProperty("scores");
        expect(score).toHaveProperty("total_score");
      });
    });
  
    it('should return 404 if no responses exist for the assignment', async () => {
      const response = await request(app)
        .post(`/api/assignment/score/generate/NON_EXISTENT_ASSIGNMENT_ID`)
        .expect(404);
  
      expect(response.body.message).toBe("No assignment responses found for this assignment");
    });
  });
  describe('GET /api/assignment/score/:user_id/:assignment_id', () => {
    it('should retrieve the assignment score successfully', async () => {
      expect(testAssignment).toBeDefined();
      expect(testUserId).toBeDefined();
  
      const response = await request(app)
        .get(`/api/assignment/score/${testUserId}/${testAssignment._id}`)
        .expect(200);
  
      expect(response.body.message).toBe("Assignment score retrieved successfully");
      expect(response.body.assignmentScore).toHaveProperty("response_id");
      expect(response.body.assignmentScore).toHaveProperty("scores");
      expect(response.body.assignmentScore).toHaveProperty("total_score");
    });
  
    it('should return 404 if no assignment response exists for the user', async () => {
      const response = await request(app)
        .get(`/api/assignment/score/NON_EXISTENT_USER/${testAssignment._id}`)
        .expect(404);
  
      expect(response.body.message).toBe("No assignment response found for this user and assignment");
    });
  
    it('should return 404 if no score has been generated for the assignment response', async () => {
      // Create a new response without generating a score
      const newResponse = new AssignmentResponse({
        user_id: "Different User",
        assignment_id: testAssignment._id,
        responses: [{ question_id: testQuestion._id, response: ["4"] }]
      });
  
      await newResponse.save();
  
      const response = await request(app)
        .get(`/api/assignment/score/Different User/${testAssignment._id}`)
        .expect(404);
  
      expect(response.body.message).toBe("Score not generated for this assignment response");
    });
  });
  describe('POST /api/difficultquestions/markasdifficult', () => {
    it('should successfully mark a question as difficult', async () => {
      expect(testAssignment).toBeDefined();
      expect(testQuestion).toBeDefined();
      expect(testUserId).toBeDefined();
  
      const response = await request(app)
        .post('/api/difficultquestions/markasdifficult')
        .send({
          user_id: testUserId,
          assignment_id: testAssignment._id,
          question: testQuestion._id
        })
        .expect(201);
  
      expect(response.body.message).toBe("Question marked as difficult");
      expect(response.body.difficultQuestion).toHaveProperty("user_id", testUserId);
      expect(response.body.difficultQuestion).toHaveProperty("assignment_id", testAssignment._id.toString());
      expect(response.body.difficultQuestion).toHaveProperty("question", testQuestion._id.toString());
    });
  
    it('should return 200 if question is already marked as difficult', async () => {
      await request(app)
        .post('/api/difficultquestions/markasdifficult')
        .send({
          user_id: testUserId,
          assignment_id: testAssignment._id,
          question: testQuestion._id
        });
  
      const response = await request(app)
        .post('/api/difficultquestions/markasdifficult')
        .send({
          user_id: testUserId,
          assignment_id: testAssignment._id,
          question: testQuestion._id
        })
        .expect(200);
  
      expect(response.body.message).toBe("Question is already marked as difficult");
    });
  
    it('should return 400 if required fields are missing', async () => {
      const response = await request(app)
        .post('/api/difficultquestions/markasdifficult')
        .send({ user_id: testUserId, assignment_id: testAssignment._id })
        .expect(400);
  
      expect(response.body.message).toBe("Missing required fields");
    });
  
    it('should fail for a non-existent assignment', async () => {
      const response = await request(app)
        .post('/api/difficultquestions/markasdifficult')
        .send({
          user_id: testUserId,
          assignment_id: "000000000000000000000000",
          question: testQuestion._id
        })
        .expect(404);
  
      expect(response.body.message).toBe("Assignment not found");
    });
  });
  describe('GET /api/difficultquestions/:user_id/:course_id', () => {
    it('should retrieve all difficult questions for a user in a specific course', async () => {
      expect(testUserId).toBeDefined();
      expect(testCourseId).toBeDefined();
      expect(testAssignment).toBeDefined();
      expect(testQuestion).toBeDefined();
  
      // Fetch difficult questions
      const response = await request(app)
        .get(`/api/difficultquestions/${testUserId}/${testCourseId}`)
        .expect(200);
  
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty("user_id", testUserId);
      expect(response.body[0]).toHaveProperty("assignment_id");
      expect(response.body[0]).toHaveProperty("question");
    });
  
    it('should return 404 if no difficult questions exist for the user in the course', async () => {
      const response = await request(app)
        .get(`/api/difficultquestions/${testUserId}/DifferentCourse`)
        .expect(404);
  
      expect(response.body.message).toBe("No difficult questions found for this course");
    });
  });
  describe('DELETE /api/difficultquestions/remove/:user_id/:question_id', () => {
    it('should remove a question from the difficult list successfully', async () => {
      expect(testUserId).toBeDefined();
      expect(testAssignment).toBeDefined();
      expect(testQuestion).toBeDefined();
  
      // Remove the difficult question
      const response = await request(app)
        .delete(`/api/difficultquestions/remove/${testUserId}/${testQuestion._id}`)
        .expect(200);
  
      expect(response.body.message).toBe("Question removed from difficult list");
      expect(response.body.deletedQuestion).toHaveProperty("user_id", testUserId);
      expect(response.body.deletedQuestion).toHaveProperty("question", testQuestion._id.toString());
    });
  
    it('should return 404 if the question is not found in the difficult list', async () => {
      const response = await request(app)
        .delete(`/api/difficultquestions/remove/${testUserId}/${testQuestion._id}`)
        .expect(404);
  
      expect(response.body.message).toBe("Difficult question not found");
    });
  });
  
});