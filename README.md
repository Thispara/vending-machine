## Tech Stack
- Frontend: Next.js + TypeScript
- Backend: FastAPI (Python)
- Database: PostgreSQL
- Containerization: Docker & Docker Compose

## How to Run
1. Install Docker and Docker Compose
2. Copy environment files:
   ```bash
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
3. Run the project:
   ```bash
   docker-compose up --build
4. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - Backend API Docs: http://localhost:8000/docs
5. Unit Test:
   ```bash
   cd backend
   pytest
