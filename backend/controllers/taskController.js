import Task from "../models/Task.js";
import Project from "../models/Project.js";

export const createTask = async (req, res) => {
  try {

    const {
      title,
      description,
      priority,
      dueDate,
      assignedTo,
      projectId,
    } = req.body;

    // validate fields
    if (!title || !assignedTo || !projectId) {
      return res.status(400).json({
        message: "Required fields missing",
      });
    }

    // find project
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    // check current user role
    const currentMember = project.members.find(
      (member) =>
        member.user.toString() === req.user.id
    );

    if (
      !currentMember ||
      currentMember.role !== "admin"
    ) {
      return res.status(403).json({
        message: "Only admin can create tasks",
      });
    }

    // check assigned user belongs to project
    const assignedMember = project.members.find(
      (member) =>
        member.user.toString() === assignedTo
    );

    if (!assignedMember) {
      return res.status(400).json({
        message: "Assigned user is not part of project",
      });
    }

    // create task
    const task = await Task.create({
      title,
      description,
      priority,
      dueDate,
      assignedTo,
      project: projectId,
      createdBy: req.user.id,
    });

    res.status(201).json(task);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
};

export const getProjectTasks = async (req, res) => {
  try {

    const { projectId } = req.params;

    // verify project access
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    const member = project.members.find(
      (m) =>
        m.user.toString() === req.user.id
    );

    if (!member) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    const tasks = await Task.find({
      project: projectId,
    })
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email");

    res.status(200).json(tasks);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
};

export const updateTaskStatus = async (req, res) => {
  try {

    const { taskId } = req.params;

    const { status } = req.body;

    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    // check assignment
    if (
      task.assignedTo.toString() !== req.user.id
    ) {
      return res.status(403).json({
        message: "You can update only your tasks",
      });
    }

    task.status = status;

    await task.save();

    res.status(200).json(task);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteTask = async (req, res) => {
  try {

    const { taskId } = req.params;

    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    const project = await Project.findById(
      task.project
    );

    const member = project.members.find(
      (m) =>
        m.user.toString() === req.user.id
    );

    if (!member || member.role !== "admin") {
      return res.status(403).json({
        message: "Only admin can delete tasks",
      });
    }

    await task.deleteOne();

    res.status(200).json({
      message: "Task deleted successfully",
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
};