const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/Person.js')
const app = express()

app.use(express.static('frontend'))
app.use(cors())
app.use(express.json())

morgan.token('data', req => {
    return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :response-time ms - :data'))

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Listening to port ${PORT}`)
})

app.get('/api/persons', (req, res) => {
    Person.find({}).then(persons => {
        console.log(persons)
        res.json(persons)
    })
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
