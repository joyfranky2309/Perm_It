const http = require('http');
const dotenv = require('dotenv');
const app = require('./app');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const PORT = process.env.PORT;
const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
