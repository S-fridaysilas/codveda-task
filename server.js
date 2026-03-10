const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const cookieParser = require('cookie-parser');
const path = require('path');
const sequelize = require('./config/database');
const authRoutes = require('./auth');
const userRoutes = require('./routes/users');
const { verifyToken, verifyAdmin } = require('./middleware');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/auth', authRoutes);
app.use('/users', userRoutes);

app.get('/dashboard', verifyToken, (req, res) => {
  res.status(200).json({
    message: `Welcome ${req.user.email}`,
    role: req.user.role
  });
});

app.get('/admin', verifyToken, verifyAdmin, (req, res) => {
  res.status(200).json({ message: 'Welcome Admin! You have full access.' });
});

// Socket.io
let onlineUsers = [];

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('userJoined', (username) => {
    socket.username = username;
    if (!onlineUsers.includes(username)) {
      onlineUsers.push(username);
    }
    io.emit('onlineUsers', onlineUsers);
    io.emit('notification', `${username} joined the chat`);
  });

  socket.on('sendMessage', (data) => {
    io.emit('message', data);
  });

  socket.on('disconnect', () => {
    onlineUsers = onlineUsers.filter(u => u !== socket.username);
    io.emit('onlineUsers', onlineUsers);
    if (socket.username) {
      io.emit('notification', `${socket.username} left the chat`);
    }
  });
});

sequelize.authenticate()
  .then(() => {
    console.log('Sequelize connected to MySQL');
    return sequelize.sync({ alter: true });
  })
  .then(() => {
    console.log('Database synced successfully');
    server.listen(3000, () => {
      console.log('Server is running on http://localhost:3000');
    });
  })
  .catch(err => {
    console.log('Database connection failed:', err.message);
  });