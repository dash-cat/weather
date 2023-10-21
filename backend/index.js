const express = require('express')
const UserStorage = require('./storage')

const port = 3000

async function init() {
  const app = express()

  const storage = await UserStorage.makeStorage('./users.json')

  console.log(storage.users)
  
  app.use(express.static('../frontend/dist'))
  app.use(express.json())
  
  app.post('/sign-in', (request, response) => {
    // ...
  })

  app.post('/sign-up', async (request, response) => {
    const { body } = request
    await storage.createUser(`${body.login}`, `${body.password}`)
    response.send('wow')
  })

  
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
}

init()
