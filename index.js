// This will allow us to use process.env.MONGO_URI in our scripts
require('dotenv').config({path: './.env'})
console.log(`is it undefined????? == ` + process.env.MONGODB_URI)

const express = require('express')
const app = express()

const Entry = require('./models/entry')

// this first
app.use(express.static('dist'))

const cors = require('cors')
app.use(cors())

// this second
app.use(express.json())

// This is a request logger middleware
const morgan = require('morgan')
app.use(morgan('tiny'))

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

let persons = [
]

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
  Entry.find({}).then(entries => {
    response.json(entries) 
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
    Entry.findById(id)
      .then(entry => {
        if (entry) {
          console.log(entry.id, typeof entry.id, id, typeof id, entry.id === id)
          response.json(entry)
        } else {
          response.status(404).end()
        } 
      })
      .catch(error => next(error))
      // {
      //   console.log(error)
      //   response.status(400).send({ error: 'malformatted id' })	
      // })
})

app.get('/info', (request, response) => {
    Entry.find({}).then(entries => {
      response.send(`<p>Phonebook has info for ${entries.length} people</p><p>${new Date()}</p>`)
    })
})

app.delete('/api/persons/:id', (request, response, next) => {
  Entry.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'name or number missing' 
    })
  }

  const entry = new Entry({
    name: body.name,
    number: body.number
  })

  entry.save().then(savedEntry => {
    response.json(savedEntry)
  })
})

  // response.set('Content-Type', 'application/json')
  
  // unknownEndpoint must be second to last middleware
  app.use(unknownEndpoint)
  
  // this has to be the last loaded middleware, also all the routes should be registered before this!
  app.use(errorHandler)

  const PORT = process.env.PORT
  app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
  })
