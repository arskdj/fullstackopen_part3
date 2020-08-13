const express = require('express')
const morgan = require('morgan')
const app = express()

app.use(express.json())

morgan.token('data', req => {
    return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :response-time ms - :data'))

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Listening to port ${PORT}`)
})

let persons = [
    {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": 1
    },
    {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": 2
    },
    {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": 3
    },
    {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": 4
    }
]

app.get('/api/persons', (req, res) => {
    res.send(persons)
})

app.get('/api/persons/:id', (req, res) => {
    const id = req.params.id
    const person = persons.find(p => p.id == id)
    if (person)
        res.json(person)
    else
        res.status(404).end()
})

app.get('/info', (req, res) => {
    const msg = `<p> phonebook has ${persons.length} people </p> ${ Date() } `
    res.send(msg)
})

app.delete('/api/persons/:id', (req, res) => {
    const id = req.params.id
    persons = persons.filter(p => p.id != id)
    res.status(204).end()
})

app.post('/api/persons', (req, res) => {
    let newPerson = req.body
    console.log(persons)
    if (!newPerson.name){
        res.status(400)
            .json({"error":"name is misssing"})
    }
    else if (!newPerson.number){
        res.status(400)
            .json({"error":"number is misssing"})
    }
    else if (persons.find(p => p.name === newPerson.name)){
        res.status(403)
            .json({"error":"name already exists"})
    }
    else {
        newPerson.id = parseInt(Math.random() * 10000000000)
        persons.push({...newPerson})
        res.json(newPerson)
    }
})
