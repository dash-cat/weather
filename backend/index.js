//@ts-check
const express = require('express')
const cookieParser = require('cookie-parser')
const { UserStorage, SessionStorage, makeStorage } = require('./storage')
const { openWeatherKey } = require('./secret.json')

const port = 3000

/**
 * @template T
 * @param {T[]} items 
 * @param {number} times 
 * @returns {T[]}
 */
function multiplyArray(items, times) {
  let result = []
  for (let i = 0; i < times; i++) {
    result = result.concat(items)
  }
  return result
}

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

/**
 * 
 * @param {Object} payload 
 * @returns 
 */
function makeSuccessResponse(payload) {
  return {
    type: 'success',
    payload
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

/**
 * @param {string} url
 * @param {RequestInit} options
 * @returns {Promise<Object>}
 */
async function fetchJSON(url, options) {
  const response = await fetch(url, options)
  return response.json()
}

async function init() {

  /** @type {UserStorage} */
  const userStorage = await makeStorage(UserStorage, './users.json')
  /** @type {SessionStorage} */
  const sessionStorage = await makeStorage(SessionStorage, './sessions.json', userStorage)

  /**
   * 
   * @param {import('express').Request} request 
   * @param {import('express').Response} response 
   * @param {import('express').NextFunction} next 
   */
  function checkTokenMiddleware(request, response, next) {
    const user = sessionStorage.getUserByToken(request.cookies['Token'])
    response.locals.user = user
    next()
  }

  const parseCookiesMiddleware = cookieParser()

  const middlewares = [parseCookiesMiddleware, checkTokenMiddleware]

  const app = express()

  app.use(express.static('../frontend/dist'))
  app.use(express.json())
  
  app.post('/sign-in', (request, response) => {
    const { body } = request
    withErrorHandler(response, async () => {
      const user = await userStorage.signIn(`${body.login}`, `${body.password}`)
      const session = await sessionStorage.createSession(user.username)
      response.cookie('Token', session.token)
      response.send(makeRedirectResponse('/'))
    })
  })

  app.post('/sign-up', async (request, response) => {
    const { body } = request
    withErrorHandler(response, async () => {
      const user = await userStorage.createUser(`${body.login}`, `${body.password}`)
      const session = await sessionStorage.createSession(user.username)
      response.cookie('Token', session.token)
      response.send(makeRedirectResponse('/'))
    })
  })

  let counter = 0

  app.get('/weather', ...middlewares, async (request, response) => {
    console.log('Request', request.cookies)
    // console.log('response', response)
    response.cookie('Counter',`${counter += 1}`)
    const user = await sessionStorage.getUserByToken(request.cookies['Token'])
    console.log('USER', user)
    if (request.cookies.Counter % 3 === 0 && !user) {
      response.send(makeRedirectResponse('/login.html'))
      return;
    }
    const city = encodeURIComponent(`${request.query['city']}`)
    const url = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${openWeatherKey}`
    const citiesResponse = await fetchJSON(url, {})
    if (!citiesResponse.length) return response.send(makeErrorResponse(new Error('Город не найден')))
    const { lon, lat } = citiesResponse[0]
    const daysCount = 10
    const url2 = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${openWeatherKey}&lang=ru&units=metric`
    const weatherResponse = await fetchJSON(url2, {})
    response.send(makeSuccessResponse(multiplyArray([weatherResponse], daysCount)))
  })
  
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
}

init()
