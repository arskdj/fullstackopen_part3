const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/Person.js')
const app = express()
const PORT = process.env.PORT || 3001

app.use(express.static('frontend'))
app.use(cors())
app.use(express.json())

morgan.token('req_data', req => {
    return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :response-time ms - :req_data'))

app.listen(PORT, () => {
    console.log(`Listening to port ${PORT}`)
})

app.get('/info', (req, res) => {
    const msg = `<p> phonebook has ${persons.length} people </p> ${Date()}`
    res.send(msg)
})

app.get('/api/persons', (req, res, next) => {
    Person.find({}).then(persons => res.json(persons))
        .catch( error => next(error))
})

app.get('/api/persons/:id', (req, res, next) => {
    const id = req.params.id
    Person.findById(id)
        .then(person => {
            if (person) {
                res.json(person)
            } else {
                res.status(404).end()
            }
        })
        .catch( error => {
            next(error)
        })
})

app.delete('/api/persons/:id', (req, res, next) => {
    const id = req.params.id
    Person.findByIdAndDelete(id)
        .then( res.status(204).end())
        .catch( error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
    Person.findByIdAndUpdate(req.params.id , newPerson, { new : true })
        .then(result => res.json(result))
        .catch(error => {
            console.log(error)
            next(error)
        })
})

app.post('/api/persons/', (req, res, next) => {

    const newPerson = Person({...req.body})

    if (!newPerson.name){
        res.status(400)
            .json({"error":"name is misssing"})
    }
    else if (!newPerson.number){
        res.status(400)
            .json({"error":"number is misssing"})
    }
    else {
        newPerson.save().then(result => res.json(newPerson))
            .catch(error => next(error))
    }
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }

    return response.status(500).send({ error: error.message})
}

app.use(errorHandler)
