import http from 'node:http';
import { json } from './middlewares/json.js';
import { routes } from './routes.js';
import { extractQueryParams } from './utils/extract-query-params.js';

//Querry Parameters: URL Stateful
//Route Parameters:
//Request Body:

// http://localhost:3333/users?userId=1&name=Diego
// http://localhost:3333/1


const server = http.createServer(async (req, res) => {
  const { method, url } = req;

  await json(req, res)

  const route = routes.find(route => {
    return route.method === method && route.path.test(url);
  })

  if (route) {
    const routeParams = req.url.match(route.path)

    const { query, ...params } = routeParams.groups

    req.params = params
    req.query = query ? extractQueryParams(query) : {}

    req.params = { ...routeParams.groups }

    return route.handler(req, res)
  }

  return res.writeHead(404).end('Not Found!');
})

server.listen(3333)