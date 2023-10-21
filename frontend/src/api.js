export function signIn(login, password, shouldCreateNewUser) {
  const path = shouldCreateNewUser ? '/sign-up' : '/sign-in'
  fetch(path, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      login, password
    })
  })
}