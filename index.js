const express = require('express')
const uuid = require('uuid/v4')
const bodyParser = require('body-parser')
const spanner = require('./app/spanner.js')

const app = express()
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', (req, res) => {
  console.log(req)
  res.send('hoge')
})

app.get('/blogs', (req, res) => {
  spanner
    .select('blogs', ['blog_id', 'title', 'body', 'created_at'])
    .then(data => { res.json(data) })
    .catch(err => {
      console.log(err)
      res.status(500).send(err)
      return 500
    })
    .then(err => console.log(`[${req.method}] ${err || 200} ${req.url}`))
})

app.post('/blogs', (req, res) => {
  const values = [
    {
      blog_id: uuid(),
      title: req.body.title || '',
      body: req.body.body || ''
    }
  ]

  spanner.insert('blogs', values)
    .then(data => { res.json(data) })
    .catch(err => {
      res.status(500).send(err)
      return 500
    })
    .then(err => console.log(`[${req.method}] ${err || 200} ${req.url}`))
})

app.get('/blogs/:id', (req, res) => {
  Promise.all([
    spanner.find('blogs', ['blog_id', 'title', 'body', 'created_at'], req.params.id),
    spanner.find('comments', ['blog_id', 'comment_id', 'name', 'body', 'created_at'], req.params.id, 'blog_id')
  ])
    .then(datas => {
      res.json({
        blog: datas[0][0],
        comments: datas[1]
      })
    })
    .catch(err => {
      res.status(500).send(err)
      return 500
    })
    .then(err => console.log(`[${req.method}] ${err || 200} ${req.url}`))
})

// TOOD: Read/Writeトラン
app.post('/blogs/:id/comments', (req, res) => {
  const values = [
    {
      blog_id: req.params.id,
      comment_id: uuid(),
      name: req.body.name || '名無し',
      body: req.body.body || ''
    }
  ]

  spanner.insert('comments', values)
    .then(data => { res.json(data) })
    .catch(err => {
      res.status(500).send(err)
      return 500
    })
    .then(err => console.log(`[${req.method}] ${err || 200} ${req.url}`))
})

const server = app.listen(8080, () => {
  const host = server.address().address
  const port = server.address().port

  console.log(`Example app listening at http://${host}:${port}`)
})
