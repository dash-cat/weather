const express = require('express')
const { UserStorage, StorageError } = require('./storage')

const port = 3000

/**
 * 
 * @param {Error} error 
 * @returns 
 */
function makeErrorResponse(error) {
  return {
    type: 'error',
    message: error.message
  }
}

/**
 * 
 * @param {string} route 
 */
function makeRedirectResponse(route) {
  return {
    type: 'redirect',
    route
  }
}

async function withErrorHandler(response, callback) {
  try {
    await callback()
  } catch (error) {
    response.statusCode = 400
    response.send(makeErrorResponse(error))
  }
}

async function init() {
  const app = express()

  const storage = await UserStorage.makeStorage('./users.json')

  console.log(storage.users)
  
  app.use(express.static('../frontend/dist'))
  app.use(express.json())
  
  app.post('/sign-in', (request, response) => {
    const { body } = request
    withErrorHandler(response, async () => {
      await storage.signIn(`${body.login}`, `${body.password}`)
      response.send(makeRedirectResponse('/'))
    })
  })

  app.post('/sign-up', async (request, response) => {
    const { body } = request
    withErrorHandler(response, async () => {
      await storage.createUser(`${body.login}`, `${body.password}`)
      response.send(makeRedirectResponse('/'))
    })
  })

  
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
}

init()
