import Project from "../models/Project.js";
import User from "../models/User.js";

export const createProject = async (req, res) => {
  try {

    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Project name is required",
      });
    }

    const project = await Project.create({
      name,
      description,

      members: [
        {
          user: req.user.id,
          role: "admin",
        },
      ],
    });

    res.status(201).json(project);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
};

export const getUserProjects = async (req, res) => {
  try {

    const projects = await Project.find({
      "members.user": req.user.id,
    }).populate(
      "members.user",
      "name email"
    );

    res.status(200).json(projects);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
};

export const addMember = async (req, res) => {
  try {

    const { email, role } = req.body;

    const { projectId } = req.params;

    // find project
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    // check admin access
    const currentMember = project.members.find(
      (member) =>
        member.user.toString() === req.user.id
    );

    if (
      !currentMember ||
      currentMember.role !== "admin"
    ) {
      return res.status(403).json({
        message: "Only admin can add members",
      });
    }

    // find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // check if already member
    const alreadyMember = project.members.find(
      (member) =>
        member.user.toString() === user._id.toString()
    );

    if (alreadyMember) {
      return res.status(400).json({
        message: "User already in project",
      });
    }

    // add member
    project.members.push({
      user: user._id,
      role: role || "member",
    });

    await project.save();

    res.status(200).json({
      message: "Member added successfully",
      project,
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
};

export const removeMember = async (req, res) => {
  try {

    const { projectId, userId } = req.params;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    // check admin
    const currentMember = project.members.find(
      (member) =>
        member.user.toString() === req.user.id
    );

    if (
      !currentMember ||
      currentMember.role !== "admin"
    ) {
      return res.status(403).json({
        message: "Only admin can remove members",
      });
    }

    // remove member
    project.members = project.members.filter(
      (member) =>
        member.user.toString() !== userId
    );

    await project.save();

    res.status(200).json({
      message: "Member removed successfully",
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
};