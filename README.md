# Square API

## API Documentation

This API allows you to manage users and tasks, providing endpoints to create, read, update, and delete these resources. It is built with Node.js, Express, TypeScript, and Firebase, and follows an organized structure with controllers, services, and routes to improve maintainability and scalability.

### Features

#### Users:
- Get user by email (GET /users?email=...)
- Create a new user (POST /users)

#### Tasks:
- Get tasks by user email (GET /tasks?email=...)
- Create a new task (POST /tasks)
- Update an existing task (PUT /tasks/:id)
- Delete a task (DELETE /tasks/:id)

### Project Structure
- src/
    - index.ts
- controllers/
    - userController.ts
    - taskController.ts
- routes/
    - userRoutes.ts
    - taskRoutes.ts
- services/
    - userService.ts
    - taskService.ts
- firebaseConfig.ts
- interfaces/
    - taskInterface.ts

#### Additional Information:

- **controllers**: Contains the logic for handling HTTP requests and responses.
- **routes**: Defines the API routes and connects each route to its corresponding controller.
- **services**: Contains the business logic related to interacting with the database (Firestore in this case).
- **firebaseConfig.ts**: Stores the Firebase configuration to connect to your project.
- **interfaces**: Defines TypeScript interfaces for task data.

### Postman 
https://www.postman.com/orange-robot-928760/workspace/geomeetry/collection/21625224-1d3bb17c-7894-4f66-b749-bb9d69f61f0e?action=share&creator=21625224