import http from "node:http";

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

  const buffers = [];

  for await (const chunk of req) {
    buffers.push(chunk);
  }

  try {
    req.body = JSON.parse(Buffer.concat(buffers).toString());
  } catch {
    req.body = null;
  }

  if (method === "GET" && url === "/users") {
    return res
      .setHeader("Content-type", "application/json")
      .end(JSON.stringify(users));
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
