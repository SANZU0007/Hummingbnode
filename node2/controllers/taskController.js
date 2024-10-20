import Task from "../models/task.js";
import User from "../models/user.js";

export const createTask = async (req, res) => {
  try {
    const taskData = req.body;
    const task = new Task({ ...taskData });
    const user = await User.findById(taskData.author);
    task.user = taskData.author;
    user.tasks.push(task);
    await task.save();
    await user.save();
    return res.json({
      data: task,
      message: "Task created successfully",
      type: "success",
    });
  } catch (err) {
    return res.json({ data: null, message: err.message, type: "error" });
  }
};

export const completeTask = async (req, res) => {
  try {
    const { taskId } = req.body;
    const task = await Task.findById(taskId);
    if (!task) {
      return res
        .status(404)
        .json({ data: null, message: "Task not found", type: "error" });
    }
    task.completed = !task.completed;
    await task.save();
    return res.json({
      data: task,
      message: "Task updated successfully",
      type: "success",
    });
  } catch (err) {
    return res
      .status(500)
      .json({ data: null, message: err.message, type: "error" });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { task } = req.body;
    if (!task || !task._id) {
      return res.json({
        data: null,
        message: "Task ID is required",
        type: "error",
      });
    }
    const deletedTask = await Task.findByIdAndDelete(task._id);
    if (!deletedTask) {
      return res.json({ data: null, message: "Task not found", type: "error" });
    }
    if (task.user && task.user._id) {
      await User.findByIdAndUpdate(task.user._id, {
        $pull: { tasks: task._id },
      });
    }
    return res.json({
      data: deletedTask,
      message: "Task deleted successfully",
      type: "success",
    });
  } catch (err) {
    return res.json({ data: null, message: err.message, type: "error" });
  }
};

export const UpdateTask = async (req, res) => {
  const { id } = req.params; // Get the task ID from request parameters
  const {
    task,
    date,
    priority,
    status,
    duration,
    endDuration,
    completedDuration,
    role,
  } = req.body; // Destructure the request body

  try {
    // Find the task by ID and update it with the provided data
    const updatedTask = await Task.findByIdAndUpdate(
      id,
      {
        task,
        date,
        priority,
        status,
        duration,
        completedDuration,
        role,
      },
      { new: true, runValidators: true } // Return the updated document
    );

    // Check if task exists
    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Send the updated task as the response
    res.status(200).json(updatedTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating task", error });
  }
};
