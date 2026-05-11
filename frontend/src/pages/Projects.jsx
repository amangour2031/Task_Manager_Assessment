import {
  useEffect,
  useState,
} from "react";
import toast from "react-hot-toast";

import { useNavigate } from "react-router-dom";

import API from "../services/api";
import { getErrorMessage } from "../utils/getErrorMessage";
import DashboardLayout from "../layouts/DashboardLayout";

function Projects() {

  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);

  const [name, setName] = useState("");

  const [description, setDescription] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  // fetch projects
  const fetchProjects = async () => {

    try {

      const response = await API.get(
        "/projects"
      );

      setProjects(response.data);

    } catch (error) {

      console.log(error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // create project
  const handleCreateProject = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);

      await API.post("/projects", {
        name,
        description,
      });
      
      toast.success("Project created");

      // clear form
      setName("");
      setDescription("");

      // refresh projects
      fetchProjects();

    } catch (error) {

      console.log(error);
      toast.error(
        getErrorMessage(
          error,
          "Failed to create project"
        )
      );

    } finally {

      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">

      {/* heading */}

      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
          Portfolio
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-950">
          Projects
        </h1>

        <p className="mt-2 max-w-2xl text-sm text-gray-600">
          Create project spaces, organize members, and open each workspace to manage its tasks.
        </p>

      </div>

      {/* create project form */}

      <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">

        <h2 className="text-xl font-bold text-gray-950">
          Create Project
        </h2>

        <p className="mt-1 text-sm text-gray-600">
          Add a focused workspace for a client, team, or initiative.
        </p>

        <form
          onSubmit={handleCreateProject}
          className="mt-5 grid gap-4 lg:grid-cols-[1fr_1.4fr_auto] lg:items-start"
        >

          <input
            type="text"
            placeholder="Project name"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          />

          <textarea
            placeholder="Project description"
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
            className="min-h-12 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            rows="1"
          />

          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-gray-950 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {
              loading
                ? "Creating..."
                : "Create Project"
            }
          </button>

        </form>

      </div>

      {/* projects list */}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">

        {
          projects.length ? projects.map((project) => (

            <div
              key={project._id}
              className="flex min-h-56 flex-col rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
            >

              <div className="mb-5 flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h2 className="truncate text-xl font-bold text-gray-950">
                {project.name}
                  </h2>

                  <p className="mt-2 line-clamp-3 text-sm leading-6 text-gray-600">
                    {project.description || "No description added yet."}
                  </p>
                </div>
              </div>

              <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-5">
                <p className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">

                Members:
                {" "}
                {project.members.length}

                </p>

              <button
                onClick={() =>
                  navigate(
                    `/tasks?projectId=${project._id}`
                  )
                }
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
              >
                View Tasks
              </button>
              </div>

            </div>
          )) : (
            <div className="col-span-full rounded-lg border border-dashed border-gray-300 bg-white p-10 text-center">
              <h2 className="text-lg font-bold text-gray-950">
                No projects yet
              </h2>

              <p className="mt-2 text-sm text-gray-600">
                Create your first project to start assigning team tasks.
              </p>
            </div>
          )
        }

      </div>

    </div>
    </DashboardLayout>
  );
}

export default Projects;
