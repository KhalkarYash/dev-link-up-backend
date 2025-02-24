# DevLinkUp Backend

DevLinkUp is a platform designed to connect developers based on their skill sets, projects, and interests. This repository contains the backend logic that powers the matching algorithm, user profiles, and communication features.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Developer Profiles**: Create and customize profiles with skills, projects, and interests.
- **Matching Algorithm**: Matches developers based on similar skill sets, interests, and project goals.
- **Real-time Chat**: Allows developers to communicate with each other directly via real-time messaging.
- **Project Collaboration**: Propose and join development projects with other users.
- **Authentication**: Secure login and signup via email/password or OAuth providers.

## Tech Stack

- **Node.js**: Backend runtime environment.
- **Express.js**: Web framework for building APIs.
- **MongoDB**: NoSQL database for storing user profiles, messages, and project data.
- **Socket.io**: Real-time communication for chat features.
- **JWT**: JSON Web Tokens for secure authentication and session management.
- **Redis**: Caching layer for faster match lookups and storing real-time chat data.

## Installation

To get the backend up and running locally, follow these steps:

1. **Clone the repository**:

   ```bash
   git clone https://github.com/KhalkarYash/dev-link-up-backend.git
   cd dev-link-up-backend
   ```

2. **Install dependencies**:

   Make sure you have [Node.js](https://nodejs.org/) and [MongoDB](https://www.mongodb.com/) installed.

   ```bash
   npm install
   ```

3. **Set up environment variables**:

   Create a `.env` file in the root directory and add the necessary environment variables (see [Environment Variables](#environment-variables)).

4. **Start the development server**:

   ```bash
   npm run dev
   ```

   The backend server should now be running at `http://localhost:5000`.

## Environment Variables

The backend requires a few environment variables to be set for proper functioning. Create a `.env` file in the root directory and include the following:

```bash
MONGODB_URI=<your-mongodb-uri>
JWT_SECRET=<your-jwt-secret>
REDIS_URL=<your-redis-url>
PORT=5000
```

## API Endpoints

Here are some of the main API endpoints the backend exposes:

### Authentication

- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login a user and generate JWT token

### User Profiles

- `GET /api/users/:id` - Get user profile by ID
- `PUT /api/users/:id` - Update user profile

### Matching

- `GET /api/matches` - Get a list of developer matches based on skills and interests
- `POST /api/matches/swipe` - Swipe left or right on a developer

### Chat

- `GET /api/chat/:conversationId` - Get messages for a conversation
- `POST /api/chat` - Send a new message in a conversation

### Projects

- `GET /api/projects` - Get a list of projects
- `POST /api/projects` - Create a new project
- `PUT /api/projects/:id` - Update project details

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository.
2. Create a new branch: `git checkout -b feature/your-feature-name`.
3. Make your changes and commit them: `git commit -m 'Add new feature'`.
4. Push to the branch: `git push origin feature/your-feature-name`.
5. Submit a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
