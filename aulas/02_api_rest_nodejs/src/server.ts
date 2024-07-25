import fastify from 'fastify'
import { knex } from './database'

const app = fastify()

const port = 3333
// GET, POST, PUT, PATCH, DELETE
app.get('/', async () => {
  const tables = await knex('sqlite_schema').select('*')

  return tables
})

app
  .listen({
    port,
  })
  .then(() => {
    console.log(`Server running! Port: ${port}`)
  })
