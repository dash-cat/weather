// @ts-check
/**
 * @param {string} path
 * @param {object=} body
 */
async function request (path, body) {
  const method = body ? 'post' : 'get'
  const response = await fetch(path, {
    method,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })

  const json = await response.json()
  if (json.type === 'redirect') {
    document.location = json.route
  } else if (json.type === 'error') {
    throw new Error(json.message)
  }

  return json.payload
}

/**
 *
 * @param {string} login
 * @param {string} password
 * @param {boolean} shouldCreateNewUser
 */
export async function signIn (login, password, shouldCreateNewUser) {
  const path = shouldCreateNewUser ? '/sign-up' : '/sign-in'

  request(path, { login, password })
}

/**
 *
 * @param {string} cityName
 */
export async function getForecastForCity (cityName) {
  return request(`/weather?city=${cityName}`)
}
