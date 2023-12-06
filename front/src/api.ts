// @ts-check
const HOST = 'http://localhost:3000'
/**
 * @param {string} path
 * @param {object=} body
 */
async function request (path: string, body?: any) {
  const method = body ? 'post' : 'get'

    const response = await fetch(path, {
      method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
    const json = await response.json()
    console.log('json',json)
    if (json.type === 'redirect') {
      console.log('re', json)
      document.location = json.route
    } else if (json.type === 'error') {
      return json
      // throw new Error(json.message)
    } 
      return json
    }

/**
 *
 * @param {string} login
 * @param {string} password
 * @param {boolean} shouldCreateNewUser
 */
export async function signIn (login: string, password: string, shouldCreateNewUser: boolean) {
  const path = shouldCreateNewUser ? '/sign-up' : '/sign-in'
  const resp = await request((HOST + path), { login, password })
  return resp
}

interface Dish {
  id: number;
  name: string;
  compound: string;
  description: string;
}
/**
 * 
 * @param {{string}} dish 
 */
export async function sendDish(dish: Dish) {
  const response = await request(`${HOST}/newdish`, dish)
  console.log(response)
}

export async function getmenu(): Promise<{ id: number; name: string; compound: string; description: string; image: string; }[]| undefined> {
  try {
    const response = await request(`${HOST}/menu`)
    return response
  } catch (e) {
    console.log(e)
  }
}