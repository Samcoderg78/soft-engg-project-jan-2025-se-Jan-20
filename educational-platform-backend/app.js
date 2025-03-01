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

// routes
const userRoute = require('./user/route/user');
app.use("/api/user", userRoute);

const drRoute = require('./deadlines_&_reminders/route/dr');
app.use("/api/dr", drRoute);

const courseRoute = require('./courses/route/course');
app.use("/api/course", courseRoute);

<<<<<<< HEAD
const weekRoute = require('./weeks/route/week');
app.use("/api/week", weekRoute);

const lectureRoute = require('./lectures/route/lecture');
app.use("/api/lecture", lectureRoute);
=======
const assignmentRoutes = require("./assignment/route/assignment");
app.use("/api/assignment", assignmentRoutes);

const difficultquestionsRoutes = require("./assignment/route/difficultQuestion");
app.use("/api/difficultquestions", difficultquestionsRoutes);

// Programming Assignments Routes
const progAssignmentRoutes = require("./programming_assignment/route/progAssignmentRoutes");
app.use("/api/prog-assignment", progAssignmentRoutes);
>>>>>>> ea246e8a2422ace2f0bdea830b1d426e232f851d

// Swagger
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerJSDocs));

// Database  configuration goes here
connectDB();

//starting server
app.listen(port, () => {
    console.log(`Server Running on ${port} ✅`);
    console.log(`You can have Api docs from here ➡️  http://localhost:${port}/api-docs/ and after clicking on this link select HTTP`)
});

