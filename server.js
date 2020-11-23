import http from 'http'
import app from './app.js'

const { PORT = 3001 } = process.env

const server = http.createServer(app)

const runServer = async (port = PORT) => {
  try {
    await server.listen(port, () => {
      console.log(`app listening on port ${port}`)
    }).on('error', (error) => {
      console.log('error starting server', error)
    })
  } catch (error) {
    console.log('error starting express', error)
  }
}

runServer().catch((error) => console.error(error))
