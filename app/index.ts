import * as Hapi from '@hapi/hapi'
import * as Inert from '@hapi/inert'

import {initLookup, routes} from './routes'

const PORT = 9090

const init = async () => {
  const server = new Hapi.Server({
    port: PORT,
  })
  await server.register(Inert)
  server.route(routes)
  await server.start()
  console.log(`Server running on port ${PORT}`)
}

init()
initLookup()
