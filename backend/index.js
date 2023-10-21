const express = require('express')

const port = 3000

const app = express()

app.use(express.static('../frontend/dist'))
app.use(express.json())

app.post('/sign-in', (request, response) => {
  console.log(request.body)
  response.send('wow')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

