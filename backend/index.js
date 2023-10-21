const express = require('express')
const { UserStorage, SessionStorage, makeStorage } = require('./storage')

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
    console.error(error)
    response.statusCode = 400
    response.send(makeErrorResponse(error))
  }
}

async function init() {
  const app = express()

  /** @type {UserStorage} */
  const userStorage = await makeStorage(UserStorage, './users.json')
  /** @type {SessionStorage} */
  const sessionStorage = await makeStorage(SessionStorage, './sessions.json', userStorage)

  console.log(userStorage._storage)
  
  app.use(express.static('../frontend/dist'))
  app.use(express.json())
  
  app.post('/sign-in', (request, response) => {
    const { body } = request
    withErrorHandler(response, async () => {
      const user = await userStorage.signIn(`${body.login}`, `${body.password}`)
      const session = await sessionStorage.createSession(user.username)
      console.log(session)
      response.cookie('Token', session.token)
      response.send(makeRedirectResponse('/'))
    })
  })

  app.post('/sign-up', async (request, response) => {
    const { body } = request
    withErrorHandler(response, async () => {
      await userStorage.createUser(`${body.login}`, `${body.password}`)
      response.send(makeRedirectResponse('/'))
    })
  })

  
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
}

init()
