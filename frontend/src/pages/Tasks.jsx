import {
  useEffect,
  useState,
} from "react";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";

import API from "../services/api";
import { getErrorMessage } from "../utils/getErrorMessage";

import { useAuth } from "../context/AuthContext";
import DashboardLayout from "../layouts/DashboardLayout";

function Tasks() {
  const { user } = useAuth();

  const [searchParams] = useSearchParams();
  const projectId = searchParams.get("projectId");

  const [tasks, setTasks] = useState([]);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  // form state
  const [title, setTitle] = useState("");
  const [description, setDescription] =
    useState("");
  const [priority, setPriority] =
    useState("Medium");
  const [dueDate, setDueDate] = useState("");
  const [assignedTo, setAssignedTo] =
    useState("");

  const [memberEmail, setMemberEmail] =
    useState("");
  const [memberRole, setMemberRole] =
    useState("member");

  // fetch project + tasks
  const fetchData = async () => {
    try {
      // fetch projects
      const projectResponse =
        await API.get("/projects");

      const currentProject =
        projectResponse.data.find(
          (p) => p._id === projectId
        );

      setProject(currentProject);

      // fetch tasks
      const taskResponse =
        await API.get(
          `/tasks/project/${projectId}`
        );

      setTasks(taskResponse.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // check if current user is admin
  const isAdmin =
    project?.members?.find(
      (member) =>
        member.user._id === user?.id &&
        member.role === "admin"
    );

  const priorityClass = {
    Low: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Medium: "bg-amber-50 text-amber-700 border-amber-200",
    High: "bg-red-50 text-red-700 border-red-200",
  };

  const statusClass = {
    "To Do": "bg-gray-100 text-gray-700",
    "In Progress": "bg-blue-50 text-blue-700",
    Done: "bg-emerald-50 text-emerald-700",
  };

  // create task
  const handleCreateTask = async (e) => {
    e.preventDefault();

    try {
      await API.post("/tasks", {
        title,
        description,
        priority,
        dueDate,
        assignedTo,
        projectId,
      });

      // clear form
      setTitle("");
      setDescription("");
      setPriority("Medium");
      setDueDate("");
      setAssignedTo("");

      toast.success("Task created");

      fetchData();
    } catch (error) {
      toast.error(getErrorMessage(error));
      console.log(error);
    }
  };

  // update status
  const handleStatusUpdate = async (
    taskId,
    status
  ) => {
    try {
      await API.patch(
        `/tasks/${taskId}/status`,
        { status }
      );

      toast.success("Task updated");

      fetchData();
    } catch (error) {
      toast.error(getErrorMessage(error));
      console.log(error);
    }
  };

  // delete task
  const handleDeleteTask = async (
    taskId
  ) => {
    try {
      await API.delete(
        `/tasks/${taskId}`
      );

      toast.success("Task deleted");

      fetchData();
    } catch (error) {
      toast.error(getErrorMessage(error));
      console.log(error);
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();

    try {
      await API.post(
        `/projects/${projectId}/members`,
        {
          email: memberEmail,
          role: memberRole,
        }
      );

      setMemberEmail("");
      setMemberRole("member");

      toast.success("Member added");

      fetchData();
    } catch (error) {
      toast.error(getErrorMessage(error));
      console.log(error);
    }
  };

  const handleRemoveMember = async (
    userId
  ) => {
    try {
      await API.delete(
        `/projects/${projectId}/members/${userId}`
      );

      toast.success("Member removed");

      fetchData();
    } catch (error) {
      toast.error(getErrorMessage(error));
      console.log(error);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6">
        <div className="rounded-lg border border-gray-200 bg-white px-6 py-4 text-sm font-medium text-gray-600 shadow-sm">
          Loading tasks...
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {/* heading */}
        <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
            Project Workspace
          </p>

          <div className="mt-2 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-950">
            {project?.name}
          </h1>

              <p className="mt-2 max-w-2xl text-sm text-gray-600">
                Manage assignments, ownership, due dates, and delivery progress for this project.
          </p>
            </div>

            <div className="flex gap-3">
              <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Members
                </p>

                <p className="mt-1 text-lg font-bold text-gray-950">
                  {project?.members?.length ?? 0}
                </p>
              </div>

              <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Tasks
                </p>

                <p className="mt-1 text-lg font-bold text-gray-950">
                  {tasks.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* TEAM MEMBERS */}
        {isAdmin && (
          <div className="mb-8 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-950">
              Team Members
            </h2>

            <p className="mt-1 text-sm text-gray-600">
              Review access and remove members who no longer need this workspace.
            </p>

            {/* members list */}
            <div className="mt-5 space-y-3">
              {project?.members?.map(
                (member) => (
                  <div
                    key={member.user._id}
                    className="flex items-center justify-between gap-4 rounded-lg border border-gray-100 bg-gray-50 px-4 py-3"
                  >
                    <div>
                      <p className="font-semibold text-gray-950">
                        {member.user.name}
                      </p>

                      <p className="text-sm text-gray-500">
                        {member.user.email}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold capitalize text-gray-700 shadow-sm">
                        {member.role}
                      </span>

                      {member.user._id !==
                        user?.id && (
                        <button
                          onClick={() =>
                            handleRemoveMember(
                              member.user._id
                            )
                          }
                          className="rounded-lg px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>

            {/* add member form */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-950">
              Add Member
            </h2>

            <p className="mt-1 text-sm text-gray-600">
              Invite a teammate by email and assign their project role.
            </p>

            <form
              onSubmit={handleAddMember}
              className="mt-5 space-y-4"
            >
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Member Email
                </label>

                <input
                  type="email"
                  placeholder="Enter member email"
                  value={memberEmail}
                  onChange={(e) =>
                    setMemberEmail(
                      e.target.value
                    )
                  }
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Role
                </label>

                <select
                  value={memberRole}
                  onChange={(e) =>
                    setMemberRole(
                      e.target.value
                    )
                  }
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                >
                  <option value="member">
                    Member
                  </option>

                  <option value="admin">
                    Admin
                  </option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full rounded-lg bg-gray-950 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800"
              >
                Add Member
              </button>
            </form>
          </div>
          </div>
        )}

        {/* CREATE TASK FORM */}
        {isAdmin && (
          <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-950">
              Create Task
            </h2>

            <p className="mt-1 text-sm text-gray-600">
              Define the work, assign an owner, and set the delivery expectation.
            </p>

            <form
              onSubmit={handleCreateTask}
              className="mt-5 grid gap-5 lg:grid-cols-2"
            >
              {/* TITLE */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Title
                </label>

                <input
                  type="text"
                  placeholder="Enter task title"
                  value={title}
                  onChange={(e) =>
                    setTitle(e.target.value)
                  }
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              {/* DESCRIPTION */}
              <div className="lg:row-span-3">
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Description
                </label>

                <textarea
                  placeholder="Enter task description"
                  value={description}
                  onChange={(e) =>
                    setDescription(
                      e.target.value
                    )
                  }
                  className="min-h-44 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  rows="7"
                />
              </div>

              {/* PRIORITY */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Priority
                </label>

                <select
                  value={priority}
                  onChange={(e) =>
                    setPriority(
                      e.target.value
                    )
                  }
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                >
                  <option value="Low">
                    Low
                  </option>

                  <option value="Medium">
                    Medium
                  </option>

                  <option value="High">
                    High
                  </option>
                </select>
              </div>

              {/* DUE DATE */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Due Date
                </label>

                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) =>
                    setDueDate(
                      e.target.value
                    )
                  }
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              {/* ASSIGN MEMBER */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Assign To
                </label>

                <select
                  value={assignedTo}
                  onChange={(e) =>
                    setAssignedTo(
                      e.target.value
                    )
                  }
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                >
                  <option value="">
                    Select Member
                  </option>

                  {project?.members?.map(
                    (member) => (
                      <option
                        key={
                          member.user._id
                        }
                        value={
                          member.user._id
                        }
                      >
                        {member.user.name}
                      </option>
                    )
                  )}
                </select>
              </div>

              <button
                type="submit"
                className="rounded-lg bg-gray-950 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800 lg:col-span-2 lg:w-fit"
              >
                Create Task
              </button>
            </form>
          </div>
        )}

        {/* TASK LIST */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-950">
            Task Board
          </h2>

          <p className="text-sm text-gray-500">
            {tasks.length} total
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {tasks.length ? tasks.map((task) => (
            <div
              key={task._id}
              className="flex min-h-72 flex-col rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="mb-3 flex flex-wrap gap-2">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass[task.status] || statusClass["To Do"]}`}>
                      {task.status}
                    </span>

                    <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${priorityClass[task.priority] || priorityClass.Medium}`}>
                      {task.priority}
                    </span>
                  </div>

                  <h2 className="text-xl font-bold text-gray-950">
                    {task.title}
                  </h2>

                  <p className="mt-2 line-clamp-3 text-sm leading-6 text-gray-600">
                    {task.description || "No description provided."}
                  </p>
                </div>

                {isAdmin && (
                  <button
                    onClick={() =>
                      handleDeleteTask(
                        task._id
                      )
                    }
                    className="rounded-lg px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                  >
                    Delete
                  </button>
                )}
              </div>

              <div className="mt-6 space-y-3 text-sm">
                <p className="flex items-center justify-between gap-3 rounded-lg bg-gray-50 px-4 py-3">
                  <span className="font-medium text-gray-500">
                    Assigned To
                  </span>

                  <span className="font-semibold text-gray-950">
                    {task.assignedTo?.name || "Unassigned"}
                  </span>
                </p>

                <p className="flex items-center justify-between gap-3 rounded-lg bg-gray-50 px-4 py-3">
                  <span className="font-medium text-gray-500">
                    Due Date
                  </span>

                  <span className="font-semibold text-gray-950">
                    {new Date(
                      task.dueDate
                    ).toLocaleDateString()}
                  </span>
                </p>
              </div>

              {/* status update */}
              <div className="mt-auto pt-5">
                <select
                  value={task.status}
                  onChange={(e) =>
                    handleStatusUpdate(
                      task._id,
                      e.target.value
                    )
                  }
                  disabled={
                    task.assignedTo?._id !==
                    user?.id
                  }
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-semibold outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
                >
                  <option value="To Do">
                    To Do
                  </option>

                  <option value="In Progress">
                    In Progress
                  </option>

                  <option value="Done">
                    Done
                  </option>
                </select>
              </div>
            </div>
          )) : (
            <div className="col-span-full rounded-lg border border-dashed border-gray-300 bg-white p-10 text-center">
              <h2 className="text-lg font-bold text-gray-950">
                No tasks yet
              </h2>

              <p className="mt-2 text-sm text-gray-600">
                Create a task to begin tracking delivery for this project.
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Tasks;
