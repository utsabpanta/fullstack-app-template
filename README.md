# Fullstack-APP-TEMPLATE
This project uses npm workspace and Docker to package and run the frontend, backend, and DynamoDB together, providing a consistent and easy-to-setup development environment.

This project is a simple Task Management Application that allows users to efficiently organize and track their tasks. With this application, users can perform the following actions:

- Add new tasks
- Edit existing tasks
- Delete tasks
- View all tasks

## Technology Stack

The entire application stack is containerized using Docker, which includes:

1. Frontend (React + Vite)
2. Backend (Express.js + Typescript + aws-sdk)
3. DynamoDB (Local instance)

To start the entire application stack:

```bash
npm run start:apps
```

This command uses Docker Compose to build and run all the necessary containers.

## Project Structure

```
.
├── Dockerfile
├── LICENSE
├── README.md
├── backend
│   ├── package.json
│   ├── scripts
│   │   ├── setupDynamo.ts
│   │   └── test.ts
│   ├── src
│   │   ├── app.ts
│   │   ├── controllers
│   │   ├── dynamo
│   │   ├── models
│   │   ├── routes
│   │   ├── server.ts
│   │   └── utils
│   └── tsconfig.json
├── docker-compose.yml
├── frontend
│   ├── README.md
│   ├── index.html
│   ├── package.json
│   ├── public
│   │   └── vite.svg
│   ├── src
│   │   ├── App.css
│   │   ├── App.tsx
│   │   ├── api
│   │   ├── assets
│   │   ├── components
│   │   ├── index.css
│   │   ├── main.tsx
│   │   ├── models
│   │   ├── styles.css
│   │   └── vite-env.d.ts
│   ├── tsconfig.app.json
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   └── vite.config.ts
├── package-lock.json
├── package.json
```

## API Routes

The backend provides RESTful API endpoints for CRUD (Create, Read, Update, Delete) operations:

- `GET /api/tasks`: Retrieve all tasks for all users
- `GET /api/users/:userId/tasks/:taskId`: Retrieve a specific task for a given user
- `POST /api/users/:userId/tasks`: Create a new task for a given user
- `PUT /api/users/:userId/tasks/:id`: Update an existing task for a given user
- `DELETE /api/users/:userId/tasks/:id`: Delete a task for a fiven user

This full-stack application demonstrates the integration of modern frontend technologies with a scalable backend, providing a robust solution for task management needs.


## Prerequisites

- Node.js (v20 or later recommended).
- npm (v10 or later for workspaces support).
- Docker and Docker Compose. Please make sure you have docker installed in your machine.

## Getting Started

1. Clone the repository

2. Install dependencies for all workspaces:
   ```
   npm run install:all
   ```

3. Start the application (includes frontend, backend, and DynamoDB):
   ```
   npm run start:apps
   ```

4. Set up initial data in DynamoDB:
   ```
   npm run setAppData
   ```

## Development

This project uses [dynamo-local-admin-docker](https://github.com/instructure/dynamo-local-admin-docker) for running DynamoDB locally.

To start development:

1. Run `npm run install:all` to install dependencies for all workspaces
2. Run `npm run start:apps` to start all services.
3. In another terminal, run `npm run setAppData` to seed sample data to the Dynamodb.
3. Access the frontend at `http://localhost:4000`.
4. The backend API will be available at `http://localhost:5001/api/tasks`
5. DynamoDB local instance will be running and accessible to your application.
   You can access DynamoDB UI view in `http://localhost:8000/`
6. HMR/hot reloading is enabled for both frotnend and backend.

## Available Scripts

- `npm run lint`: Run ESLint on both frontend and backend code
- `npm run format`: Format code using Prettier for both frontend and backend
- `npm run build:all`: Build all workspaces
- `npm run start:apps`: Start all applications using Docker Compose
- `npm run setAppData`: Set up initial data in DynamoDB

### Frontend-specific scripts

- `npm run lint:frontend`: Lint frontend code
- `npm run format:frontend`: Format frontend code
- `npm i {PACKAGE_NAME} --workspace=frontend`: Install any dependency to frontend project

### Backend-specific scripts

- `npm run lint:backend`: Lint backend code
- `npm run format:backend`: Format backend code
- `npm i {PACKAGE_NAME} --workspace=backend`: Install any dependency to backend project

## Development

This project uses [dynamo-local-admin-docker](https://github.com/instructure/dynamo-local-admin-docker) for running DynamoDB locally.

To start development:

1. Run `npm run install:all` to install dependencies for all workspaces
2. Run `npm run start:apps` to start all services.
3. In another terminal, run `npm run setAppData` to seed sample data to the Dynamodb.
3. Access the frontend at `http://localhost:4000`.
4. The backend API will be available at `http://localhost:5001/api/tasks`
5. DynamoDB local instance will be running and accessible to your application.
   You can access DynamoDB UI view in `http://localhost:8000/`

## Testing

Currently, there are no specified tests. To add tests, update the `test` script in `package.json` and add your test files.

## License

This project is licensed under the [MIT License](LICENSE.md).

## Troubleshooting Tips
 - In case you run into any docker related issue, try running
    ```
    docker-compose down
    docker-compose build --no-cache
    docker-compose up
    ```