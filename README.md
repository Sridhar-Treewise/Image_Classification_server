
## Project Server image classification || SCAV_AI

#### Project Requirements setup

- [x] Node.js `v18.12.1 (npm v8.19.2)`
- [x] npm
- [x] code version 1.77.0

#### Initial setup

- npm run dev

#### Clear cache and lib 

- npm clean

## Conventions

- Files and Folders:

Use lowercase letters and hyphens (-) or underscores (_) for file and folder names.
For file names, use descriptive names that reflect the purpose or functionality of the file.
For folder names, use plural nouns to represent collections or groups of related files.

- Routes:

Use lowercase letters and hyphens (-) or underscores (_) for route names.
For route URLs, use lowercase letters and hyphens (-) to separate words.
Use nouns to represent resources or entities, e.g., /users, /products, /orders.
Use specific route names for CRUD operations, such as /users/:id for retrieving a specific user.

- Controllers:

Use PascalCase for controller names.
Append "Controller" to the end of the controller file names.
Controllers handle request/response logic and should be named based on the associated resource or functionality, e.g., UserController.js, ProductController.js.

- Models:

Use singular nouns for model names to represent individual instances of resources.
Use PascalCase for model names.
Append "Model" to the end of the model file names, e.g., UserModel.js, ProductModel.js.

- Middleware:

Use lowercase letters and hyphens (-) or underscores (_) for middleware names.
Middleware names should reflect their purpose or functionality, e.g., authMiddleware.js, validationMiddleware.js.

- Services:

Use lowercase letters and hyphens (-) or underscores (_) for service names.
Service names should represent the specific functionality or task they perform, e.g., userService.js, emailService.js.

- Variables and Functions:

Use camelCase for variable and function names.
Choose descriptive names that clearly indicate the purpose or functionality of the variable or function.
