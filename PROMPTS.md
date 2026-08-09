# AI Usage Log — Adaptive Interview Intelligence

## Project

**Project:** Adaptive Interview Intelligence  
**Repository:** Vicodathon-by-ABtalks  
**Development approach:** AI-assisted iterative development

This document records the major AI-assisted interactions used during the
development, debugging, integration, and deployment of the project.

AI assistance was used as a development and debugging partner for code
understanding, implementation, environment setup, API integration, Git/GitHub
troubleshooting, deployment configuration, and production debugging.

The development process was iterative: requirements were inspected, code was
implemented, errors were tested, deployment logs were analyzed, and fixes
were applied based on the observed results.

---

# 1. Understanding the Project Structure

## Prompt / Interaction

> I have to check this python version command for which directory

> done till here

> successfully installed

### AI assistance

The AI helped identify the correct project directory and explained where
Python commands should be executed.

The project was organized with a frontend and backend, with the backend
located under:

```text
backend/

The Python virtual environment was created inside the backend directory.

Result

The development environment was established without changing the existing
project structure.

2. Python Installation and Environment Setup
Prompt / Interaction

Python was not found; run without arguments to install from the Microsoft
Store, or disable this shortcut from Settings > Apps > Advanced app settings

App execution aliases.

py --version

python.exe to path means

how to download python and which version

AI assistance

The AI explained that Python was either not installed correctly or was not
available through the Windows PATH/App Execution Alias configuration.

The Python installation was corrected and the Python executable was made
available from PowerShell.

The appropriate project Python environment was then created using:

python -m venv .venv
Result

The backend virtual environment was successfully created.

3. Backend Virtual Environment
Command / Interaction
python -m venv .venv
Result

The backend environment was successfully created.

The terminal subsequently showed:

(.venv) PS ...\backend>

which confirmed that the virtual environment was active.

AI assistance

The AI explained that commands such as pip install and uvicorn should be
run while the backend virtual environment was active.

4. Installing Backend Dependencies
Prompt / Interaction

pip install -r requirements.txt

Result

The following dependencies were successfully installed:

fastapi==0.115.0
uvicorn[standard]==0.30.6
pydantic==2.9.2

along with their required dependencies.

The installation completed with:

Successfully installed ...
AI assistance

The AI verified that the dependency installation had completed successfully
and explained the purpose of the installed FastAPI/Uvicorn/Pydantic stack.

5. Running the FastAPI Backend
Command
uvicorn main:app --reload
Result

The backend successfully started on:

http://127.0.0.1:8000

The terminal showed:

Uvicorn running on http://127.0.0.1:8000
Application startup complete.
AI assistance

The AI explained that this confirmed that the FastAPI application was
running locally and that the terminal needed to remain open while testing
the API.

6. Local API Testing
Prompt / Interaction

how to get second powershell and in which dir i need to give this api testing command

AI assistance

The AI explained the distinction between:

Terminal 1: running the FastAPI/Uvicorn server
Terminal 2: executing API testing commands

The second PowerShell could be opened independently and used to send HTTP
requests to the backend while the first terminal continued running Uvicorn.

Result

The API was tested successfully and returned:

StatusCode : 200
StatusDescription : OK
Server : uvicorn

This confirmed that the local backend was responding to HTTP requests.

7. Testing the Interview Flow
Interaction

The interview API was tested with actual interview messages.

The backend returned responses such as:

Welcome, Sarah! Let's begin your interview. We'll go through 5 questions...

and:

Let's start with "Local LLM & AI Coding Assistant Setup"
(Day 2 of the curriculum)...
AI assistance

The AI helped interpret the API responses and verify that the interview
engine was using candidate/curriculum information instead of a static
frontend-only mock flow.

Result

The adaptive interview flow was confirmed to be functioning locally.

8. Git Repository Verification
Interaction
git remote -v
Result

The project was connected to the public GitHub repository:

https://github.com/paavnirastogi0109/Vicodathon-by-ABtalks.git
AI assistance

The AI explained that the origin remote pointed to the correct GitHub
repository and that pushes could therefore update the public project.

9. Git Commit and Push Troubleshooting
Prompt / Interaction

... git commit -m "Add FastAPI backend for deployment" && git push ...

Error

PowerShell reported:

The token '&&' is not a valid statement separator in this version.
AI assistance

The AI explained that the PowerShell version being used did not accept
the chained && command syntax in that context.

The commands were therefore run separately:

git add ...
git commit -m "..."
git push origin main
Result

The project was successfully committed and pushed.

Git subsequently reported:

nothing to commit, working tree clean

and:

Everything up-to-date

This confirmed that the local repository and GitHub repository were
synchronized.

10. Inspecting Backend Files in Git
Interaction
git status --short backend
git check-ignore -v backend/main.py
AI assistance

These commands were used to verify that the backend files were actually
tracked and were not being accidentally ignored by .gitignore.

The repository was confirmed to contain:

backend/
├── README.md
├── curriculum.py
├── interview_engine.py
├── main.py
└── requirements.txt
Result

The backend was confirmed to be part of the Git repository.

11. Frontend ↔ Backend Integration
Prompt / Interaction

src\data\interviewApi.js ...
const INTERVIEW_API_URL = 'http://127.0.0.1:8000/api/interview'
correct?

AI assistance

The AI identified that the frontend was still configured to use the local
backend address:

http://127.0.0.1:8000/api/interview

This works only when the backend is running locally on the developer's
computer.

Once the frontend is deployed, 127.0.0.1 refers to the device running
the browser rather than the Render backend.

Resolution

The frontend API client was updated to use the deployed backend:

https://the-adaptive-interview-agent.onrender.com/api/interview
Result

The production frontend was configured to communicate with the production
FastAPI backend.

12. Frontend Interview API Integration
AI-assisted implementation

The frontend API layer was implemented in:

src/data/interviewApi.js

The integration included:

starting an interview session
maintaining a session ID
sending candidate answers
handling backend responses
handling non-success HTTP responses
displaying useful backend connection errors
Result

The frontend interview flow was connected to the FastAPI interview endpoint.

13. Interview Screen Integration
AI-assisted implementation

The frontend InterviewScreen.jsx was updated to use the real backend
instead of relying entirely on the previous mock interview flow.

The integration:

Loads the selected candidate.
Creates a session ID.
Starts a backend interview.
Displays the backend's reply.
Sends each candidate answer to the backend.
Detects when the backend returns done: true.
Passes the resulting feedback to the feedback screen.
Result

The interview UI became connected to the adaptive backend interview engine.

14. Feedback Screen Integration
AI-assisted implementation

FeedbackScreen.jsx was updated to consume the feedback returned by the
backend.

The backend response contains:

summary
strengths
gaps
next

These values were mapped into the existing feedback UI.

A fallback to the previous mock feedback was retained only for cases where
someone directly navigates to the feedback route without completing an
interview.

Result

Completed interviews now use backend-generated feedback rather than relying
on the original static feedback data.

15. Frontend and Backend Validation
AI-assisted testing

The implementation was validated through:

backend Python compilation
frontend JavaScript/JSX parsing
interview engine simulation
API contract verification
candidate data verification
Git diff/status inspection

The interview engine was tested through a complete simulated session:

Start interview
      ↓
Question 1
      ↓
Answer
      ↓
Adaptive question
      ↓
Answer
      ↓
...
      ↓
Question 5
      ↓
Feedback
Result

The backend interview flow successfully completed and returned the expected
feedback structure.

16. Render Backend Deployment
Prompt / Interaction

how to go back to this page to fill details on render

The backend was deployed as a Render web service.

The important configuration was:

Root Directory:
backend
Build Command:
pip install -r requirements.txt
Start Command:
uvicorn main:app --host 0.0.0.0 --port $PORT
Result

The FastAPI backend was eventually deployed successfully.

17. Render Root Directory Error
Error

Render initially reported:

Root directory "backend " does not exist.
Verify the Root Directory configured in your service settings.
AI assistance

The AI helped verify the GitHub repository structure and distinguish between:

the repository root
the backend directory
the frontend files

The repository was confirmed to contain the backend directory.

The Render Root Directory was corrected to:

backend

with no extra whitespace.

Result

Render was able to locate the backend application.

18. Render Dependency Build Error
Error

During dependency installation, Render reported a metadata generation
failure involving:

pydantic-core

and:

metadata-generation-failed
AI assistance

The AI analyzed the Render build log and identified a Python/runtime
compatibility issue involving the pinned dependencies.

Instead of changing the application logic, the deployment Python version
was explicitly configured.

19. Python Version Configuration for Render
Prompt / Interaction

how and where to create the .python-version

AI assistance

The AI explained that .python-version should be created in the
repository root, rather than inside the backend directory.

The file was created with:

3.11

The project structure became:

adaptive-interview-intelligence/
├── .python-version
├── backend/
├── public/
├── src/
└── ...
Result

The backend was redeployed using the specified Python version.

The Render deployment subsequently became live.

20. Verifying the Deployed Backend
AI-assisted verification

The deployed FastAPI application was opened through its public Render URL.

FastAPI Swagger documentation was accessible and showed the API endpoints:

GET /api/health
POST /api/interview
Result

The backend was confirmed to be publicly accessible.

The health endpoint also provided a simple way to verify that the application
was running.

21. Deploying the Frontend
AI-assisted configuration

The Vite frontend was deployed as a Render Static Site.

The frontend repository root contains:

package.json
package-lock.json
src/
public/
vite.config.js

The frontend deployment used:

Build Command:
npm install && npm run build
Publish Directory:
dist
Result

The frontend was successfully deployed and received a public Render URL.

22. Production Frontend Connection Problem
Prompt / Interaction

Its is showing this when i am opening frontend url

The deployed frontend initially reported that it could not reach the
interview backend.

AI assistance

The issue was separated into two possibilities:

The backend might not be running.
The backend might be running but the browser might be preventing the
frontend from communicating with it.

The backend Swagger documentation was opened directly.

Result

Because the Swagger page loaded successfully, the backend process itself
was confirmed to be healthy.

The investigation then moved to browser-to-backend communication.

23. Inspecting the FastAPI CORS Configuration
Prompt / Interaction

PS ...> Get-Content backend\main.py

The backend code showed the following CORS configuration:

allow_origins=[
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
AI assistance

The AI identified that these origins only allowed local development
frontends.

The deployed frontend had a different origin:

https://adaptive-interview-frontend.onrender.com

Therefore the browser could block the production frontend's request to
the API.

24. CORS Resolution
AI-assisted fix

The deployed frontend origin was added to the FastAPI CORS configuration:

allow_origins=[
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://adaptive-interview-frontend.onrender.com",
]

The localhost origins were retained so that local development would continue
to work.

Result

The production frontend was permitted to make API requests to the deployed
FastAPI backend.

25. Final Deployment Verification

The final deployment consists of two Render services:

Frontend
https://adaptive-interview-frontend.onrender.com
Backend
https://the-adaptive-interview-agent.onrender.com

The frontend communicates with:

POST /api/interview

on the deployed backend.

The backend also exposes:

GET /api/health

and FastAPI's documentation endpoint.

26. AI-Assisted Development Summary

AI assistance was used across several parts of the project:

Development
understanding the existing project structure
interpreting the technical specification
designing and implementing the FastAPI backend
integrating the interview engine with the frontend
connecting interview and feedback screens
creating the frontend API client
Testing
validating the backend
testing the interview API
checking Git status
verifying tracked files
checking frontend/backend API URLs
validating deployment health
Debugging
Python installation issues
virtual environment setup
PowerShell command syntax
Git tracking and commit issues
Render root-directory configuration
Pydantic/Python dependency installation
frontend/backend production URL configuration
CORS configuration
Deployment
GitHub repository setup
Render backend deployment
Render frontend deployment
Python runtime configuration
production API configuration
final frontend/backend integration
27. Development Process

The project followed an iterative development process:

Understand requirements
        ↓
Inspect existing code
        ↓
Implement backend
        ↓
Connect frontend
        ↓
Test locally
        ↓
Commit to GitHub
        ↓
Deploy backend
        ↓
Debug deployment errors
        ↓
Deploy frontend
        ↓
Test production integration
        ↓
Debug CORS/API issues
        ↓
Final verification

AI was used as a development assistant throughout this process. Code was
tested against the actual local environment and deployment logs rather than
assuming that generated code would work without verification.

28. Accuracy Note

This document summarizes the major AI-assisted interactions and debugging
steps from the development process.

Some prompts are reproduced from the conversation history available during
the preparation of this document. Where an earlier conversation message was
not available in complete verbatim form, the interaction is described as a
summary rather than presented as a fabricated exact transcript.

No external AI service or API key was required by the final interview engine.
The backend interview logic remains deterministic/rule-based as implemented
in the project.