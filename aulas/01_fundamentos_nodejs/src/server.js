import http from "node:http";
// UUID => Unique Universal ID
import { json } from "./middlewares/json.js";
import { routes } from "./routes.js";
import { extractQueryParams } from "./utils/extract_query_params.js";

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

- Formas que o front-end pode nos enviar informações:
  - Query Parameters:
    - URL Stateful => Filtros, paginação, não-obrigatórios 
    - Ex: http://localhost:3333/users?userId=1&name=Thiago
  
  - Route Parameters:
    - Identificação de recurso (identificar qual usuário queremos listar, excluir e etc...)
    - Ex:
      - GET http://localhost:3333/users/1
      - DELETE http://localhost:3333/users/1
  
  - Request Body:
    - Envio de informações de um formulário (passa pelo protocolo HTTPs)
    - Ex: POST http://localhost:3333/users

*/


const server = http.createServer(async (req, res) => {
  // Pegando os recursos da requisição recebida:
  const { method, url } = req;

  // Middlewares são interceptadores e sempre receberão a req e res
  await json (req, res);

  const route = routes.find(route => {
    // Testando se URL recebida atende os requisitos da nossa REGEX criada
    return route.method === method && route.path.test(url)
  });

  if(route){
    const routeParams = req.url.match(route.path);
    
    const { query, ...params } = routeParams.groups;

    req.params = params;
    req.query = query ? extractQueryParams(query) : {};

    return route.handler(req, res);
  }

  return res.writeHead(404).end("Not found!");
});

server.listen(port);
