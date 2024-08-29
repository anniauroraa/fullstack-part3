const express = require('express')
const morgan = require('morgan')

// This will allow us to use process.env.MONGO_URI in our scripts
require('dotenv').config()

const app = express()
app.use(express.json())
app.use(express.static('dist'))

const Entry = require('./models/entry')

const cors = require('cors')
app.use(cors())
app.use(morgan('tiny'))

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


let persons = [
    // { 
    //   "id": 1,
    //   "name": "Arto Hellas", 
    //   "number": "040-123456"
    // },
    // { 
    //   "id": 2,
    //   "name": "Ada Lovelace", 
    //   "number": "39-44-5323523"
    // },
    // { 
    //   "id": 3,
    //   "name": "Dan Abramov", 
    //   "number": "12-43-234345"
    // },
    // { 
    //   "id": 4,
    //   "name": "Mary Poppendieck", 
    //   "number": "39-23-6423122"
    // }
]

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
  Entry.find({}).then(entries => {
    response.json(entries) 
  })
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => {
    console.log(person.id, typeof person.id, id, typeof id, person.id === id)
    return person.id === id
  })

  if (!person) {
    console.log("person not found")
    response.status(404).end()
  }

  console.log(person)
  response.json(person)
})

app.get('/info', (request, response) => {
    response.send(`<p>Phonebook has info for ${persons.length} people</p><p>${new Date()}</p>`)
    })

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)
  response.status(204).end()
})

const generateId = () => {
  const randomId = Math.floor(Math.random() * 1000000)
  return randomId
}

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'name or number missing' 
    })
  }

  if (persons.find(person => person.name === body.name)) {
    return response.status(400).json({ 
      error: 'name must be unique' 
    })
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  }

  persons = persons.concat(person)

  console.log("POST", body.name, body.number)

  response.set('Content-Type', 'application/json')
  response.json(person)
})