const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

// Initialize Express
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files (CSS) from the "css" folder
app.use('/css', express.static(path.join(__dirname, 'css')));

// Serve the HTML file for the chat interface
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Handle socket connection
io.on('connection', (socket) => {
  let username = '';

  // Handle setting the username
  socket.on('set username', (name) => {
    username = name;
    console.log(`${username} connected`);
  });

  // Handle chat messages
  socket.on('chat message', (data) => {
    io.emit('chat message', data);  // Broadcast the message to all clients
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    if (username) {
      console.log(`${username} disconnected`);
    }
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
