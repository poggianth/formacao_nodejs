import fastify from 'fastify'

const app = fastify()

const port = 3333
// GET, POST, PUT, PATCH, DELETE
app.get('/', () => {
  return 'Hello World!'
})

app
  .listen({
    port,
  })
  .then(() => {
    console.log(`Server running! Port: ${port}`)
  })
