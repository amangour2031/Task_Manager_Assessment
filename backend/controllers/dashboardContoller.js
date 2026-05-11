import Task from "../models/Task.js";
import Project from "../models/Project.js";

export const getDashboardStats = async (req, res) => {
  try {

    // find user's projects
    const projects = await Project.find({
      "members.user": req.user.id,
    });

    const projectIds = projects.map(
      (project) => project._id
    );

    // get all project tasks
    const tasks = await Task.find({
      project: { $in: projectIds },
    }).populate(
      "assignedTo",
      "name email"
    );

    // total tasks
    const totalTasks = tasks.length;

    // status counts
    const todoTasks = tasks.filter(
      (task) => task.status === "To Do"
    ).length;

    const inProgressTasks = tasks.filter(
      (task) => task.status === "In Progress"
    ).length;

    const completedTasks = tasks.filter(
      (task) => task.status === "Done"
    ).length;

    // overdue tasks
    const overdueTasks = tasks.filter(
      (task) =>
        task.dueDate &&
        task.status !== "Done" &&
        new Date(task.dueDate) < new Date()
    ).length;

    // tasks per user
    const tasksPerUserMap = {};

    tasks.forEach((task) => {

      if (task.assignedTo) {

        const userName = task.assignedTo.name;

        tasksPerUserMap[userName] =
          (tasksPerUserMap[userName] || 0) + 1;
      }
    });

    const tasksPerUser = Object.entries(
      tasksPerUserMap
    ).map(([name, count]) => ({
      name,
      count,
    }));

    res.status(200).json({
      totalTasks,

      tasksByStatus: {
        todo: todoTasks,
        inProgress: inProgressTasks,
        completed: completedTasks,
      },

      overdueTasks,

      tasksPerUser,
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
};