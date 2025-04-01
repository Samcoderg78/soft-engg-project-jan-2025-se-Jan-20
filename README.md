# 📚 AI Agent for Academic Guidance

## 📖 Project Overview

The **AI Agent for Academic Guidance** is a web-based learning platform designed to enhance the educational experience for students in the IITM BS degree program. Built using the **MERN Stack**, this application serves as an intelligent virtual guide that helps students navigate course materials, improve study habits, and maintain academic integrity without providing direct answers.

## 🌟 Key Features

- **Smart Academic Guidance**: AI assistant that suggests learning strategies and references rather than direct answers
- **Course-Specific Support**: Dynamic recommendations based on enrolled courses and available resources
- **Assignment Navigation**: Guidance for practice and graded assignments while upholding academic integrity
- **Knowledge Reinforcement**: Retrieval-Augmented Generation (RAG) system for efficient query handling
- **Interactive Learning**: Integrated quizzes, programming assignments, and performance tracking
- **Context-Aware Assistance**: Maintains conversation context across interactions

## 🛠 Technical Implementation

### Tech Stack

- **Frontend**: React.js, HTML, CSS, JavaScript
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **AI Integration**: Retrieval-Augmented Generation (RAG) architecture

### Academic Integrity Features

- Contextual guidance without solution disclosure
- Reference to official materials and credible sources
- Ethical query handling for assessments
- Conversation threading to maintain appropriate context

## 🚀 Getting Started

### Prerequisites

- [Node.js (LTS v22+)](https://nodejs.org/)
- [npm (v10+)](https://www.npmjs.com/)
- [Git](https://git-scm.com/)
- MongoDB Atlas or local MongoDB instance

### Installation

1. Clone the repository:
```sh
git clone https://github.com/Samcoderg788/soft-engg-project-jan-2025-se-Jan-20.git
cd soft-engg-project-jan-2025-se-Jan-20
```
### Install frontend dependiencies
```sh
cd educational-platform-frontend
npm install
```
### Install backend dependiencies
```sh
cd educational-platform-backend
npm install
```

### Create a .env file in the backend folder:
```sh
PORT = 3009
MONGODB_URI = "mongodb+srv://root:root@clustersolnstech.1bikubl.mongodb.net/educationaPlatformIITM?retryWrites=true&w=majority&appName=ClusterSolnstech"
HUGGINGFACE_API_KEY=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
GOOGLE_GENAI_API_KEY=AIzaSyDXE_LGHuRXnovDtxJg-0zQc4h0OlAOcgE
```

 ## Running the Application

 ### Start frontend development server:

```sh
cd educational-platform-frontend
npm start
```
Access at: http://localhost:3000

### Start backend server (in separate terminal):

```sh
cd educational-platform-backend
node app.js
```
Runs on: http://localhost:5000


# 🔐 Default Login Credentials
## Student Accounts:

- Email: student1@example.com
- Password: 1234

- Email: student2@example.com
- Password: 1234

## Instructor Accounts:

- Email: instructor1@example.com
- Password: 1234

- Email: instructor2@example.com
- Password: 1234

## 📚 Platform Features
**Course Management:** 

- Access via /student-courses route

- Clickable course cards with detailed content

- Organized lecture materials and assignments

**AI-Powered Assistance:**

- Context-aware academic guidance

- Ethical query handling for assessments

- Resource recommendation system

**Learning Tools:**

- Programming assignments interface

- Graded and practice assessments

- Performance analytics dashboard

## ⚖️ Academic Integrity Implementation
- Strict no-direct-answers policy for assessments

- Dynamic redirection to official course materials

- Contextual suggestions for learning strategies

- Conversation history tracking

## 📜 License

This project is licensed under the **MIT License**. See [LICENSE](https://github.com/Samcoderg788/soft-engg-project-jan-2025-se-Jan-20/blob/main/LICENSE) file for details.

## 💬 Support & Contact

For support or feature requests:
- Open an issue on our [GitHub repository](https://github.com/Samcoderg788/soft-engg-project-jan-2025-se-Jan-20)
- Provide detailed information about your request
