import * as fastify from 'fastify'
import * as fStatic from 'fastify-static'
import * as path from 'path'
import {initLookup, routes, DIR_PUBLIC} from './routes'

const server = fastify({logger: true})
const HOST = '0.0.0.0'
const PORT = 9090

const init = async () => {
  server.register(fStatic, {
    root: path.join(__dirname, '../', DIR_PUBLIC),
  })
  routes.forEach(route => server.route(route))
  server.listen(PORT, HOST, err => {
    if (err) {
      server.log.error(err)
      process.exit(1)
    }
  })
}

init()
initLookup()
