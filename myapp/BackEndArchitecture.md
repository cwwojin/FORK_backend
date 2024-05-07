myapp/
│
├── src/
│ ├── server.js # Entry point of the application
│ ├── app.js # Setup Express app, middleware
│ ├── config/ # Configuration files and environment variables
│ │ ├── config.js # Load database configuration
│ │ └── index.js # Central configuration file
│ │
│ ├── routes/ # Route definitions for the application
│ │ ├── authRoutes.js # Routes for user authentication and registration services
│ │ ├── userRoutes.js # Routes for user information services
│ │ ├── facilityRoutes.js # Routes for facility information services
│ │ └── mapRoutes.js # Routes for map-related services
│ │
│ ├── controllers/ # Controllers for handling request validation, response & error handling
│ │ ├── authController.js # Controller for user authentication and registration services
│ │ ├── userController.js # Controller for user information services
│ │ ├── facilityController.js # Controller for facility information services
│ │ └── mapController.js # Controller for map-related services
│ │
│ ├── models/ # Database models
│ │ ├── index.js # Setup database connection and model
│ │
│ ├── services/ # Services for handling business logic, data access
│ │ ├── authService.js # Authentication services - 
│ │ ├── userService.js # User services - CRUD user info, profile & preferences, favorites
│ │ ├── facilityService.js # Facility services - CRUD facility info, filter & search, facility registration
│ │ └── mapService.js # Map services - 
│ │
│ ├── middleware/ # Custom express middleware
│ │ ├── authMiddleware.js # Middleware for authentication
│ │ └── errorMiddleware.js # Middleware for unhandled errors
│ │ 
│ └── helper/ # Helpers 
│   └── helper.js # Various helper functions, objects, etc.
│
├── tests/ # Test files for the application
│
├── package-lock.json # NPM dependencies and scripts (lock)
└── package.json # NPM dependencies and scripts
