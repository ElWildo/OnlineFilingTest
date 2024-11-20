import express, { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { collections } from "../services/database.service.js";
import Task, { instanceOfTask } from "../models/task.js";
import Project, { instanceOfProject } from "../models/project.js";

/* Global Config */
export const router = express.Router();

router.use(express.json());

/* GET */

/**
 * Get all the tasks
 */
router.get("/tasks", async (_req: Request, res: Response) => {
  try {
    const task = (await collections.tasks?.find({}).toArray()) as Task[];

    res.status(200).send(task);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send(error.message);
    }
  }
});

/**
 * Get all the tasks ordered by Start Date
 */
router.get("/tasksOrderedbyStartDate", async (_req: Request, res: Response) => {
  try {
    const task = (await collections.tasks
      ?.aggregate([{ $sort: { start_date: 1 } }])
      .toArray()) as Task[];

    res.status(200).send(task);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send(error.message);
    }
  }
});

/**
 * Get all the tasks ordered by Due Date
 */
router.get("/tasksOrderedbyDueDate", async (_req: Request, res: Response) => {
  try {
    const task = (await collections.tasks
      ?.aggregate([{ $sort: { due_date: 1 } }])
      .toArray()) as Task[];

    res.status(200).send(task);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send(error.message);
    }
  }
});

/**
 * Get all the tasks ordered by Done Date
 */
router.get("/tasksOrderedbyDoneDate", async (_req: Request, res: Response) => {
  try {
    const task = (await collections.tasks
      ?.aggregate([{ $sort: { done_date: 1 } }])
      .toArray()) as Task[];

    res.status(200).send(task);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send(error.message);
    }
  }
});

/**
 * Get task by id
 */
router.get("/tasks/:id", async (req: Request, res: Response) => {
  const id = req?.params?.id;

  try {
    const query = { _id: new ObjectId(id) };
    const task = (await collections.tasks?.findOne(query)) as Task;
    res.status(200).send(task);
  } catch (error) {
    res
      .status(404)
      .send(`Unable to find matching document with id: ${req.params.id}`);
  }
});

/**
 * Get task filtered by done status
 */
router.get(
  "/tasksByStatus/:doneStatus",
  async (req: Request, res: Response) => {
    const doneStatus = req?.params?.doneStatus;

    try {
      if (doneStatus == "done" || doneStatus == "to-do") {
        const query = { doneStatus: doneStatus };
        const task = (await collections.tasks?.find(query).toArray()) as Task[];

        res.status(200).send(task);
      } else {
        res.status(500).send("Invalid done status");
      }
    } catch (error) {
      res
        .status(404)
        .send(`Unable to find matching document with id: ${req.params.id}`);
    }
  }
);

/**
 * Get task by name
 */
router.get("/tasksByName/:name", async (req: Request, res: Response) => {
  const name = req?.params?.name as string;

  try {
    if (name && typeof name == "string") {
      const query = { name: name };
      const tasks = (await collections.tasks?.find(query).toArray()) as Task[];

      res.status(200).send(tasks);
    } else {
      res.status(500).send("Invalid name");
    }
  } catch (error) {
    res
      .status(404)
      .send(`Unable to find matching document with id: ${req.params.id}`);
  }
});

/**
 * Get task by project's name
 */
router.get("/tasksByProjectName/:name", async (req: Request, res: Response) => {
  const name = req?.params?.name as string;

  try {
    if (name && typeof name == "string") {
      const tasks = await collections.tasks
        ?.aggregate([
          { $set: { project: { $toObjectId: "$project" } } },
          {
            $lookup: {
              from: "projects",
              localField: "project",
              foreignField: "_id",
              as: "projectData",
            },
          },
          { $unwind: "$projectData" },
          {
            $match: {
              "projectData.name": name,
            },
          },
        ])
        .toArray();

      res.status(200).send(tasks);
    } else {
      res.status(500).send("Invalid name");
    }
  } catch (error) {
    res
      .status(404)
      .send(`Unable to find matching document with id: ${req.params.name}`);
  }
});

/**
 * Get all the projects
 */
router.get("/projects", async (_req: Request, res: Response) => {
  try {
    const projects = (await collections.projects
      ?.find({})
      .toArray()) as Project[];

    res.status(200).send(projects);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send(error.message);
    }
  }
});

/**
 * Get all the tasks projects by Start Date
 */
router.get(
  "/projectsOrderedbyStartDate",
  async (_req: Request, res: Response) => {
    try {
      const projects = (await collections.projects
        ?.aggregate([{ $sort: { start_date: 1 } }])
        .toArray()) as Project[];

      res.status(200).send(projects);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).send(error.message);
      }
    }
  }
);

/**
 * Get all the tasks projects by Due Date
 */
router.get(
  "/projectsOrderedbyDueDate",
  async (_req: Request, res: Response) => {
    try {
      const projects = (await collections.projects
        ?.aggregate([{ $sort: { due_date: 1 } }])
        .toArray()) as Project[];

      res.status(200).send(projects);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).send(error.message);
      }
    }
  }
);

/**
 * Get project by id
 */
router.get("/projects/:id", async (req: Request, res: Response) => {
  const id = req?.params?.id;

  try {
    const query = { _id: new ObjectId(id) };
    const project = (await collections.projects?.findOne(query)) as Project;

    res.status(200).send(project);
  } catch (error) {
    res
      .status(404)
      .send(`Unable to find matching document with id: ${req.params.id}`);
  }
});

/**
 * Get project by name
 */
router.get("/projectsByName/:name", async (req: Request, res: Response) => {
  const name = req?.params?.name as string;

  try {
    if (name && typeof name == "string") {
      const query = { name: name };
      const projects = (await collections.projects
        ?.find(query)
        .toArray()) as Project[];

      res.status(200).send(projects);
    } else {
      res.status(500).send("Invalid name");
    }
  } catch (error) {
    res
      .status(404)
      .send(`Unable to find matching document with id: ${req.params.id}`);
  }
});

/* POST*/

/**
 * Add new Task
 */
router.post("/newTask", async (req: Request, res: Response) => {
  try {
    if (!instanceOfTask(req.body)) res.status(500).send("Wrong task format");
    else {
      const newTaks = req.body as Task;
      const result = await collections.tasks?.insertOne(newTaks);
      result
        ? res
            .status(201)
            .send(
              `Successfully created a new task with id ${result.insertedId}`
            )
        : res.status(500).send("Failed to create a new task.");
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(error);
      res.status(400).send(error.message);
    }
  }
});

/**
 * Add new Project
 */
router.post("/newProject", async (req: Request, res: Response) => {
  try {
    if (!instanceOfProject(req.body)) {
      res.status(500).send("Wrong prject format");
    } else {
      const newProject = req.body as Project;
      const result = await collections.projects?.insertOne(newProject);

      result
        ? res
            .status(201)
            .send(
              `Successfully created a new project with id ${result.insertedId}`
            )
        : res.status(500).send("Failed to create a new project.");
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(error);
      res.status(400).send(error.message);
    }
  }
});

/* PUT */

/**
 * Update task by id
 */
router.put("/tasks/:id", async (req: Request, res: Response) => {
  const id = req?.params?.id;

  try {
    const updatedTask: Task = req.body as Task;
    const query = { _id: new ObjectId(id) };

    const result = await collections.tasks?.updateOne(query, {
      $set: updatedTask,
    });

    result
      ? res.status(200).send(`Successfully updated task with id ${id}`)
      : res.status(304).send(`Task with id: ${id} not updated`);
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      res.status(400).send(error.message);
    }
  }
});

/**
 * Update task done status by id
 */
router.put("/tasks/:id/switchDone", async (req: Request, res: Response) => {
  const id = req?.params?.id;

  try {
    const query = { _id: new ObjectId(id) };
    const task = (await collections.tasks?.findOne(query)) as Task;

    task.doneStatus = task.doneStatus == "done" ? "to-do" : "done";
    if (task.doneStatus == "to-do") {
      task.start_date = new Date();
      task.due_date = new Date();
    }
    const result = await collections.tasks?.updateOne(query, {
      $set: task,
    });

    result
      ? res.status(200).send(`Successfully updated task with id ${id}`)
      : res.status(304).send(`Task with id: ${id} not updated`);
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      res.status(400).send(error.message);
    }
  }
});

/**
 * Update project by id
 */
router.put("/projects/:id", async (req: Request, res: Response) => {
  const id = req?.params?.id;

  try {
    const updatedProject: Project = req.body as Project;
    const query = { _id: new ObjectId(id) };

    const result = await collections.projects?.updateOne(query, {
      $set: updatedProject,
    });

    result
      ? res.status(200).send(`Successfully updated project with id ${id}`)
      : res.status(304).send(`Project with id: ${id} not updated`);
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      res.status(400).send(error.message);
    }
  }
});

/**
 * Add task to a project
 */
router.put("/assignTaskToProject/?", async (req: Request, res: Response) => {
  const task_id = req?.query?.task_id as string;
  const project_id = req?.query?.project_id as string;

  try {
    const query_task = { _id: new ObjectId(task_id) };
    const query_project = { _id: new ObjectId(project_id) };

    const taskAlreadyAssigned = (await collections.tasks?.findOne(
      query_task
    )) as Task;
    const prevTask = taskAlreadyAssigned.project;

    const resultTaskUpdate = await collections.tasks?.updateOne(query_task, {
      $set: { project: project_id },
    });

    const resultProjectUpdate = await collections.projects?.updateOne(
      query_project,
      {
        $addToSet: { tasks: task_id },
      }
    );

    /**
     * I left the beet underneath commented because apparently
     * the pull function has issue on typescript on how it accept intruction.
     *
     * Ideally the bit was supposed to unlink task from previous project.
     * Being the reference in task a single one, we can just override that,
     * but we need to remove the reference to the task from the proevious owning project
     */

    // let updatedOld: boolean = false;
    // if (prevTask) {
    //   const resultProjectUpdate = await collections.projects?.findOneAndUpdate(
    //     { _id: prevTask },
    //     {
    //       $pull: { "projects.tasks": task_id },
    //     }
    //   );
    //   updatedOld = resultProjectUpdate != null;
    // } else {
    //   // && updatedOld = true;
    // }

    // updatedOld &&
    resultTaskUpdate && resultProjectUpdate
      ? res
          .status(200)
          .send(`Successfully updated project with id ${project_id}`)
      : res.status(304).send(`Project with id: ${project_id} not updated`);
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      res.status(400).send(error.message);
    }
  }
});

/* DELETE */

/**
 * Delete task by id
 */
router.delete("/tasks/:id", async (req: Request, res: Response) => {
  const id = req?.params?.id;

  try {
    const query = { _id: new ObjectId(id) };
    const result = await collections.tasks?.deleteOne(query);

    if (result && result.deletedCount) {
      res.status(202).send(`Successfully removed task with id ${id}`);
    } else if (!result) {
      res.status(400).send(`Failed to remove task with id ${id}`);
    } else if (!result.deletedCount) {
      res.status(404).send(`Task with id ${id} does not exist`);
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      res.status(400).send(error.message);
    }
  }
});

/**
 * Delete project by id
 */
router.delete("/projects/:id", async (req: Request, res: Response) => {
  const id = req?.params?.id;

  try {
    const query = { _id: new ObjectId(id) };
    const result = await collections.projects?.deleteOne(query);

    if (result && result.deletedCount) {
      res.status(202).send(`Successfully removed project with id ${id}`);
    } else if (!result) {
      res.status(400).send(`Failed to remove project with id ${id}`);
    } else if (!result.deletedCount) {
      res.status(404).send(`Project with id ${id} does not exist`);
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      res.status(400).send(error.message);
    }
  }
});
