require("dotenv").config({ path: "../.env" });
const http = require("http");
const app = require("./app"); // Import the configured Express application
const port = process.env.PORT || 3000; // Set the port from environment or default to 3000

const server = http.createServer(app); // Create server using the Express app

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
