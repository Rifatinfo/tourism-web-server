const express = require('express');
const cors = require('cors');
require('dotenv').config(); // Load environment variables
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('Welcome our tourism website!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
