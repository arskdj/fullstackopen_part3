require('dotenv').config()
const mongoose = require('mongoose')

const uri = process.env.DB_URI
console.log('connecting to', uri)

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then( result => {
        console.log('connected to DB')
    })
    .catch( error => {
        console.log('error connecting to DB')
    })

const personSchema = new mongoose.Schema({
    name : String,
    number : String
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

const Person = mongoose.model('Person', personSchema)
module.exports = Person
