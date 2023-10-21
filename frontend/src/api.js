export function signIn(login, password, shouldCreateNewUser) {
  fetch('/sign-in', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      login, password, shouldCreateNewUser
    })
  })
  // alert(login + password + shouldCreateNewUser)
}