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

app.get('/info', (req, res) => {
    const msg = `<p> phonebook has ${persons.length} people </p> ${Date()}`
    res.send(msg)
})

app.get('/api/persons', (req, res) => {
    Person.find({}).then(persons => res.json(persons))
})

app.get('/api/persons/:id', (req, res) => {
    const id = req.params.id
    Person.findById(id)
        .then(person => res.json(person))
        .catch(res.status(404).end())
})

app.delete('/api/persons/:id', (req, res) => {
    const id = req.params.id
    Person.findByIdAndDelete(id)
        .then( res.status(204).end())
        .catch( res.status(404).end())
})

app.post('/api/persons', (req, res) => {

    const newPerson = Person({...req.body})

    if (!newPerson.name){
        res.status(400)
            .json({"error":"name is misssing"})
    }
    else if (!newPerson.number){
        res.status(400)
            .json({"error":"number is misssing"})
    }
//    else if (persons.find(p => p.name === newPerson.name)){
//        res.status(403)
//            .json({"error":"name already exists"})
//    }
    else {
        newPerson.save().then(result => res.json(newPerson))
    }
})
