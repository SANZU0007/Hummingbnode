import Task from '../models/task.js';

// Get all tasks

export const getAllTasksByTeam = async (req, res) => {
  const { team } = req.params; // Expecting team to be passed in the URL

  try {
    // Check if team parameter is provided
    if (!team) {
      return res.status(400).json({
        message: 'Team parameter is required to fetch tasks.',
        type: 'error'
      });
    }

    // Fetch tasks where team matches the provided team parameter
    const tasks = await Task.find({ companyName : team });

    // Check if any tasks were found
    if (!tasks || tasks.length === 0) {
      return res.status(404).json({
        message: 'No tasks found for the specified team.',
        type: 'error'
      });
    }

    // Successfully found tasks, return them
    res.status(200).json({
      message: 'Tasks retrieved successfully.',
      type: 'success',
      tasks
    });
  } catch (error) {
    console.error("Error fetching tasks by team:", error);

    // Handle specific error cases if necessary
    if (error.name === 'CastError') {
      res.status(400).json({
        message: 'Invalid team format provided.',
        type: 'error'
      });
    } else {
      // General server error message
      res.status(500).json({
        message: 'An unexpected error occurred while fetching tasks. Please try again later or contact support if the issue persists.',
        type: 'error'
      });
    }
  }
};






export const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Get all tasks for a specific user

export const getTasksByUser = async (req, res) => {
  try {
    const {userTaskId} = req.params; // Retrieve optional query parameters

    const tasks = await Task.find({user:userTaskId});

    // If no tasks are found, respond accordingly
    if (!tasks.length) {
      return res.status(400).json({ message: "No tasks found for this user" });
    }

    res.status(200).json(tasks);

  } catch (error) {
    console.error("Error fetching tasks by user:", error); // Log for debugging
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};


// Create a new task
export const createTask = async (req, res) => {
  try {
    const task = new Task(req.body);
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


// Get a specific task by ID
export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a task by ID
export const updateTask = async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a task by ID
export const deleteTask = async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
