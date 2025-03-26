const express = require('express');
const app = express();
app.disable("x-powered-by");
require('dotenv').config();
const port = process.env.PORT;
const cors = require('cors');
const connectDB = require('./common/config/db');
const helmet = require("helmet")


// basic action
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(helmet())

//swaggerImports
const swaggerUI = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerJSDocs = YAML.load("./api.yaml");

// AI ROUTES
const aiAgentRoutes = require('./ai_agent/topic_simplification/route/aiAgentRoutes');
app.use('/api/topic_simplification', aiAgentRoutes);


const programmingRoutes = require('./ai_agent/programming_assistance/route/programmingRoutes');
app.use('/api/programming', programmingRoutes);

const instructorRoutes = require('./ai_agent/instructor_assistant/routes/instructorRoutes');
app.use('/api/instructor', instructorRoutes);


const assignmentSummaryRoutes = require('./ai_agent/assignment_summary/routes/summaryRoutes');
app.use('/api/summary', assignmentSummaryRoutes);

// routes
const userRoute = require('./user/route/user');
app.use("/api/user", userRoute);
app.use("/api/user", userRoute);

const drRoute = require('./deadlines_&_reminders/route/dr');
app.use("/api/dr", drRoute);

const courseRoute = require('./courses/route/course');
app.use("/api/course", courseRoute);

const weekRoute = require('./weeks/route/week');
app.use("/api/week", weekRoute);

const lectureRoute = require('./lectures/route/lecture');
app.use("/api/lecture", lectureRoute);

const assignmentRoutes = require("./assignment/route/assignment");
app.use("/api/assignment", assignmentRoutes);

const difficultquestionsRoutes = require("./assignment/route/difficultQuestion");
app.use("/api/difficultquestions", difficultquestionsRoutes);

// Programming Assignments Routes
const progAssignmentRoutes = require("./programming_assignment/route/progAssignmentRoutes");
app.use("/api/prog-assignment", progAssignmentRoutes);

const deadlineRoute = require("./getDeadlines/route/gd");
app.use("/api/gd", deadlineRoute);

const submissionRoute = require("./recentSubmissions/route/rs");
app.use("/api/rs", submissionRoute);

const noteRoute = require("./takeNotes/route/tn");
app.use("/api/tn", noteRoute);

//feedback routes
const feedbackRoutes = require("./feedback/routes/feedbackRoutes"); 
app.use("/api/feedback", feedbackRoutes);

const enrollmentRoutes = require("./user/route/enrollmentRoutes")
app.use('/api/enrollments', enrollmentRoutes);

// Swagger
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerJSDocs));

// Database  configuration goes here
connectDB();

//starting server
app.listen(port, () => {
    console.log(`Server Running on ${port} ✅`);
    console.log(`You can have Api docs from here ➡️  http://localhost:${port}/api-docs/ and after clicking on this link select HTTP`)
});

module.exports = { app };

