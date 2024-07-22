import http from "node:http";
// UUID => Unique Universal ID
import { randomUUID } from "node:crypto";
import { getBodyRequestJSON } from "./middlewares/get_body_request_json.js";
import { Database } from "./database.js";

const database = new Database();

const port = 3000;

const server = http.createServer(async (req, res) => {
  const { method, url } = req;

  // Espera o meu Middleware settar o atributo "body", pois por padrão não existe
  await getBodyRequestJSON(req, res);

  if (method === "POST" && url === "/tasks") {
    if (!validateRequestBody(req, res)) return;

    const { title, description } = req.body;

    const newTask = {
      id: randomUUID(),
      title: title,
      description: description,
      completed_at: null,
      created_at: new Date(),
      updated_at: null,
    };

    database.insert("tasks", newTask);

    return res.writeHead(200).end(`Task created!`);
  }

  if (method === "GET" && url === "/tasks") {
    return res.end(JSON.stringify(database.select("tasks")));
  }

  if (method === "PUT" && url.includes("/tasks/")) {
    const idTask = url.split("/")[2];
    const [task] = database.select("tasks", idTask);

    if(task.length == 0){
      return res.writeHead(400).end("Task not found!");
    }

    if (!validateRequestBody(req, res)) return;

    const { title: newTitle, description: newDescription } = req.body;

    database.update("tasks", idTask, {
      title: newTitle ?? task.title,
      description: newDescription ?? task.description,
      updated_at: new Date()
    });

    return res.writeHead(200).end(`Task updated!`);
  }

  if (method === "DELETE" && url.includes("/tasks")) {
    const idTask = url.split("/")[2];
    const [task] = database.select("tasks", idTask);

    if(task.length == 0){
      return res.writeHead(400).end("Task not found!");
    }

    database.delete("tasks", idTask);

    return res.writeHead(200).end(`Task deleted!`);
  }

  if (
    method === "PATCH" &&
    url.includes("/tasks") &&
    url.includes("/complete")
  ) {
    const idTask = url.split("/")[2];
    const [task] = database.select("tasks", idTask);

    if(task.length == 0){
      return res.writeHead(400).end("Task not found!");
    }

    const completed_at = task.completed_at ? null : new Date();

    database.update("tasks", idTask, {completed_at});

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

server.listen(port);
