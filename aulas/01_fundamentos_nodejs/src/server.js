import http from "node:http";
import { json } from "./middlewares/json.js";

const port = 3333;

/*

- Recursos de requisições HTTP:
    - Método HTTP
    - URL

- Métodos HTTP
    GET, POST, PUT, PATCH e DELETE

- Podemos ter a mesma rota com métodos diferentes

- JSON - JavaScript Object Notation

- Cabeçalhos (req/res) => Metadados (informações adicionais)

*/

const users = [];

const server = http.createServer(async (req, res) => {
  // Pegando os recursos da requisição recebida:
  const { method, url } = req;

  // Middlewares são interceptadores e sempre receberão a req e res
  await json (req, res);

  if (method === "GET" && url === "/users") {
    return res.end(JSON.stringify(users));
  }

  if (method === "POST" && url === "/users") {
    if (req.body == null) {
      return res.writeHead(400).end("Body not found!");
    }

    const { name, email } = req.body;

    users.push({
      id: 1,
      name: name,
      email: email,
    });

    return res.writeHead(201).end();
  }

  return res.writeHead(404).end("Not found!");
});

server.listen(port);
