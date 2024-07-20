import http from "node:http";
// UUID => Unique Universal ID
import { randomUUID } from "node:crypto";
import { getBodyRequestJSON } from "./middlewares/get_body_request_json.js";

const port = 3000;
const dbTasks = [];

const server = http.createServer(async (req, res) => {
  const { method, url } = req;

  // Espera o meu Middleware settar o atributo "body", pois por padrão não existe
  await getBodyRequestJSON(req, res);

  if (method === "POST" && url === "/tasks") {
    if (!validateRequestBody(req, res)) return;

    const { title, description } = req.body;

    dbTasks.push({
      id: randomUUID(),
      title: title,
      description: description,
      completed_at: null,
      created_at: new Date(),
      updated_at: null,
    });

    return res.writeHead(200).end(`Task created!`);
  }

  if (method === "GET" && url === "/tasks") {
    return res.end(JSON.stringify(dbTasks));
  }

  if (method === "PUT" && url.includes("/tasks/")) {
    const indexTaskDB = validateIdTask(req, res, url.split("/")[2]);

    if (indexTaskDB == -1) return;

    if (!validateRequestBody(req, res)) return;

    const { title: newTitle, description: newDescription } = req.body;

    const oldTask = dbTasks[indexTaskDB];

    dbTasks[indexTaskDB] = {
      id: oldTask.id,
      title: newTitle || oldTask.title,
      description: newDescription || oldTask.description,
      completed_at: oldTask.completed_at,
      created_at: oldTask.created_at,
      updated_at: new Date(),
    };

    return res.writeHead(200).end(`Task updated!`);
  }

  if (method === "DELETE" && url.includes("/tasks")) {
    const indexTaskDB = validateIdTask(req, res, url.split("/")[2]);

    if (indexTaskDB == -1) return;

    dbTasks.splice(indexTaskDB, 1);

    return res.writeHead(200).end(`Task deleted!`);
  }

  if(method === "PATCH" && url.includes("/tasks") && url.includes("/complete")){
    const indexTaskDB = validateIdTask(req, res, url.split("/")[2]);

    if (indexTaskDB == -1) return;

    const oldTask = dbTasks[indexTaskDB];

    dbTasks[indexTaskDB] = {
      id: oldTask.id,
      title: oldTask.title,
      description: oldTask.description,
      completed_at: oldTask.completed_at ? null : new Date(),
      created_at: oldTask.created_at,
      updated_at: oldTask.updated_at,
    };

    return res.writeHead(200).end(`Task updated!`);
  }

  return res.writeHead(404).end("Not found!");
});

function validateRequestBody(req, res) {
  if (!req.body) {
    res.writeHead(400).end("Body not found!");
    return false;
  }

  const { title, description } = req.body;

  if (!title) {
    res.writeHead(400).end("Title can't be empty!");
    return false;
  }

  if (!description) {
    res.writeHead(400).end("Description can't be empty!");
    return false;
  }

  return true;
}

function validateIdTask(req, res, idTask) {
  if (idTask === "") {
    res.writeHead(400).end("Task`s id can't be empty!");
    return -1;
  }

  const indexTaskDB = dbTasks.findIndex((task) => task.id === idTask);

  if (indexTaskDB == -1) {
    res.writeHead(400).end("Task not found!");
    return -1;;
  }

  return indexTaskDB;
}

server.listen(port);
