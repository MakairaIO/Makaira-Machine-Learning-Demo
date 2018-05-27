import express from 'express'
import bodyParser from 'body-parser'
import axios from 'axios'

const app = express()
app.use(bodyParser.json())

app.post('/search', (req, res) => {
  const { body } = req

  if (!body) return res.sendStatus(400)

  axios
    .post(`${process.env.API_URL}/search/`, body)
    .then(res => console.log(res))
})

app.listen(3000)
