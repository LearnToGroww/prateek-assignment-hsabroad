const { Server } = require('socket.io');
const http = require('http');

const server = http.createServer();
const io = new Server(server, {
  cors: {
    origin: "http://localhost:9002",
    methods: ["GET", "POST"]
  }
});

let tasks = [];
let assignees = [
  { id: 'user-1', name: 'name one', avatar: 'https://picsum.photos/id/237/32/32' },
  { id: 'user-2', name: 'name two', avatar: 'https://picsum.photos/id/238/32/32' },
  { id: 'user-3', name: 'name three', avatar: 'https://picsum.photos/id/239/32/32' },
  { id: 'user-4', name: 'name four', avatar: 'https://picsum.photos/id/240/32/32' },
];

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  console.log('Sending initial data:', { tasks, assignees });
  socket.emit('initial-data', { tasks, assignees });

  socket.on('add-task', (taskData) => {
    console.log('Received add-task:', taskData);
    const newTask = {
      id: `task-${Date.now()}`,
      ...taskData,
      assignee: undefined
    };
    tasks.push(newTask);
    console.log('Broadcasting task-added:', newTask);
    io.emit('task-added', newTask);
  });

  socket.on('update-task', ({ taskId, taskData }) => {
    console.log('Received update-task:', { taskId, taskData });
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (taskIndex !== -1) {
      tasks[taskIndex] = {
        ...tasks[taskIndex],
        ...taskData,
        assignee: undefined
      };
      console.log('Broadcasting task-updated:', tasks[taskIndex]);
      io.emit('task-updated', tasks[taskIndex]);
    }
  });

  socket.on('delete-task', (taskId) => {
    console.log('Received delete-task:', taskId);
    tasks = tasks.filter(t => t.id !== taskId);
    console.log('Broadcasting task-deleted:', taskId);
    io.emit('task-deleted', taskId);
  });

  socket.on('move-task', ({ taskId, newColumnId }) => {
    console.log('Received move-task:', { taskId, newColumnId });
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      task.columnId = newColumnId;
      console.log('Broadcasting task-moved:', { taskId, newColumnId });
      io.emit('task-moved', { taskId, newColumnId });
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Socket server running on port ${PORT}`);
});