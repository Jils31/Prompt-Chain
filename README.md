# PromptChain

PromptChain is a web application that allows users to create, manage, and execute AI-driven workflows (chains) using nodes and edges. Each node can represent an AI model, input, or other processing step, and edges define the flow of data between nodes. Users can sign up, log in, and have their own isolated chains.

## Features

- User authentication with JWT and cookies
- Create, read, update, and delete AI workflows (chains)
- Execute chains with proper context passing between nodes
- Support for different node types, including AI-powered LLM nodes
- Backend integrated with PostgreSQL for data storage
- Redis for caching and performance optimization
- Frontend built with React and React Query for responsive interaction

## Tech Stack

### Frontend
- React
- Tailwind CSS
- React Query (@tanstack/react-query)
- Axios

### Backend
- Node.js
- Express.js
- Prisma ORM
- PostgreSQL
- Redis
- JWT for authentication
- Gemini AI integration for LLM nodes

## Setup

### Prerequisites
- Node.js
- PostgreSQL
- Redis

### Backend Setup

1. Navigate to the server folder:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```ini
   PORT=5000
   DATABASE_URL=<PostgreSQL connection string>
   REDIS_URL=<Redis connection string>
   JWT_SECRET=<your_jwt_secret>
   GEMINI_API_KEY=<your_gemini_api_key>
   ```

4. Apply Prisma migrations:
   ```bash
   npx prisma migrate dev
   ```

5. Start the backend:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the client folder:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with:
   ```bash
   VITE_API_URL=http://localhost:5000/api
   ```

4. Start the frontend:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/auth/signup` — Sign up a new user
- `POST /api/auth/login` — Log in an existing user
- `GET /api/auth/me` — Get current logged-in user

### Users
- `GET /api/users` — Get all users
- `GET /api/users/:id` — Get user by ID
- `PUT /api/users/:id` — Update user
- `DELETE /api/users/:id` — Delete user

### Chains
- `POST /api/chains` — Create a new chain
- `GET /api/chains` — Get all chains of the logged-in user
- `GET /api/chains/:id` — Get a specific chain
- `PUT /api/chains/:id` — Update a chain
- `DELETE /api/chains/:id` — Delete a chain

### Chain Execution
- `POST /api/run-chain/:chainId` — Run a chain with input values

## Implementation Notes

- Each user has isolated chains and can only access and run chains they created
- Redis is used for caching and improving execution performance
- Prisma handles all database interactions with automatic migrations
- JWT and cookie-based authentication for secure user sessions

## Deployment

1. Deploy PostgreSQL and Redis (can use cloud services like Render)
2. Set up environment variables on your deployment platform
3. Deploy the backend to your chosen hosting platform
4. Update the frontend `.env` with the deployed backend URL
5. Deploy the frontend to a static hosting service
