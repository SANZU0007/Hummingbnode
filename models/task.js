import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  task: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    required: true
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Low'
  },

  status: {
    type: String,
    enum: ['In Progress', 'Paused', 'Completed'], // Updated enum
    default: 'Paused',
  },
  duration: {
    type: Number, // Duration in minutes
    default: 45, // Start duration set to 0 minutes
  },
  completedDuration: {
    type: Number, // Duration in minutes
    default: 0, // Start duration set to 0 minutes
  },
  user: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    required: true,
    trim: true
  },
  team: {
    type: String,
  },
  
});

const Task = mongoose.model('Task', taskSchema);

export default Task;
