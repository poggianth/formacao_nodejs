import { Database } from "./database.js";
import { randomUUID } from "node:crypto";
import { buildRoutePath } from "./utils/build_route_path.js";

const database = new Database();

export const routes = [
  {
    method: "GET",
    path: buildRoutePath("/users"),
    handler: (req, res) => {
      const { search } = req.query;

      const users = database.select(
        "users",
        search
          ? {
              name: search,
              email: search,
            }
          : null
      );

      return res.end(JSON.stringify(users));
    },
  },
  {
    method: "POST",
    path: buildRoutePath("/users"),
    handler: (req, res) => {
      if (req.body == null) {
        return res.writeHead(400).end("Body not found!");
      }

      const { name, email } = req.body;

      const user = {
        id: randomUUID(),
        name: name,
        email: email,
      };

      database.insert("users", user);

      return res.writeHead(201).end();
    },
  },
  {
    method: "DELETE",
    path: buildRoutePath("/users/:id"),
    handler: (req, res) => {
      const id_user = req.params.id;

      database.delete("users", id_user);

      return res.writeHead(204).end();
    },
  },
  {
    method: "PUT",
    path: buildRoutePath("/users/:id"),
    handler: (req, res) => {
      const { id: id_user } = req.params;
      const { name: new_name, email: new_email } = req.body;

      database.update("users", id_user, { name: new_name, email: new_email });

      return res.writeHead(204).end();
    },
  },
];
