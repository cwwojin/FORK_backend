myapp/
│
├── src/
│ ├── app.js # Setup Express app, middleware
│ ├── server.js # Entry point of the application
│ ├── config/ # Configuration files and environment variables
│ │ ├── config.js # Load database config from environment variables
│ │ └── index.js # Central configuration file
│ │
│ ├── controllers/ # Controllers for handling request, response & error handling
│ │ ├── adminController.js # Controller for admin service
│ │ ├── authController.js # Controller for user authentication
│ │ ├── facilityController.js # Controller for facility service
│ │ ├── mapController.js # Controller for map service
│ │ ├── reviewController.js # Controller for review service
│ │ ├── stampController.js # Controller for stamp service
│ │ └── userController.js # Controller for user service
│ │ 
│ ├── helper/ # Helpers
│ │ ├── helper.js # Various helper functions, objects, etc.
│ │ └── s3Engine.js # Set up connection to AWS S3 and S3 upload middleware
│ │
│ ├── middleware/ # Commonly used middlewares
│ │ ├── authMiddleware.js # Middleware for authentication
│ │ ├── errorMiddleware.js # Middleware for unhandled errors
│ │ └── validator.js # Middleware for request validation
│ │
│ ├── models/ # Database models
│ │ └── index.js # Setup database connection pool and model
│ │
│ ├── routes/ # Routers for handling routing and request validation
│ │ ├── adminRoutes.js # Router for admin service ("/api/admin")
│ │ ├── authRoutes.js # Router for user authentication ("/api/auth")
│ │ ├── facilityRoutes.js # Router for facility service ("/api/facilities")
│ │ ├── mapRoutes.js # Router for map service ("/api/map")
│ │ ├── reviewRoutes.js # Router for review service ("/api/reviews", "/api/hashtags")
│ │ ├── stampRoutes.js # Router for stamp service ("/api/stamps")
│ │ └── userRoutes.js # Router for user service ("/api/users", "/api/preferences")
│ │
│ └── services/ # Services for handling business logic, data access
│   ├── adminService.js # Handling bug & content reports, admin features
│   ├── authService.js # User authentication 
│   ├── facilityService.js # Handling facility information management, posts
│   ├── mapService.js # Retrieving locations / coordinates data
│   ├── reviewService.js # Handling facility reviews
│   ├── stampService.js # Handling stamp-books, stamp transactions
│   └── userService.js # Handling user account, profile, preference, favorites
│
├── tests/ # Test files for the application
│
├── package-lock.json # NPM dependencies and scripts (lock)
└── package.json # NPM dependencies and scripts