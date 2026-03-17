# MB Tech To-Do Assessment

A premium, three-tier To-Do task web application built with a modern tech stack and focusing on clean code, SOLID principles, and aesthetic design.

## 🚀 Quick Start

Ensure you have [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/) installed.

```bash
# Build and start the entire stack
docker-compose up --build
```

The application will be available at:
- **Frontend SPA**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:5000](http://localhost:5000)
- **Database**: localhost:3306

## 🛠 Tech Stack

- **Frontend**: React 19, Vite, TypeScript, Vanilla CSS (Premium Glassmorphism Design).
- **Backend**: Node.js, Express, TypeScript, Layered Architecture (Controller-Service-Repository).
- **Database**: MySQL 8.
- **Testing**: Jest (Backend), Vitest + React Testing Library (Frontend).
- **DevOps**: Docker, multi-stage Dockerfiles for optimized builds.

## 📋 Features

- **Create Tasks**: Add tasks with a mandatory Title and optional Description.
- **Task List**: Real-time display of the **5 most recent pending tasks**.
- **Complete Tasks**: Mark tasks as "Done" with a single click.
- **Dynamic Visibility**: Completed tasks are immediately removed from the view.
- **Aesthetic UI**: Modern dark theme with glassmorphism, gradients, and micro-animations.

## 🧪 Running Tests

### Backend Tests (Unit)
```bash
cd backend
npm install
npm test
```

### Frontend Tests (Unit)
```bash
cd frontend
npm install
npm test
```

## 🏗 Architecture & Quality

- **SOLID Principles**: Each layer (Repository, Service, Controller) has a single responsibility.
- **Clean Code**: Meaningful naming, custom typed errors, and clear modular structure.
- **Dockerized Build**: All compilation (TypeScript, React build) happens inside Docker containers for environment consistency.
- **Relational Integrity**: Uses MySQL with a normalized `task` table schema.

## 📁 Project Structure

```text
.
├── backend/            # Express REST API
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── repositories/
│   │   └── utils/      # Custom errors & helpers
│   └── tests/          # Unit & Integration tests
├── frontend/           # React SPA
│   ├── src/
│   │   ├── components/
│   │   ├── services/   # API client
│   │   └── types/
│   └── src/__tests__/  # Component tests
├── database/
│   └── init.sql        # Database schema
└── docker-compose.yml  # Orchestrator
```
