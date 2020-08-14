if (![3,5].includes(process.argv.length) ) {
    console.log('example: node mongo.js <password> <name> <number>')
    process.exit(1)
}

const mongoose = require('mongoose')
const password = process.argv[2]

const url =
    `mongodb+srv://fullstackopen:${password}@cluster0.nifva.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })


const personSchema = new mongoose.Schema({
    name : String,
    number : String
})

const Person = mongoose.model('Person', personSchema)

const newPerson = Person({
    name : process.argv[3],
    number : process.argv[4],
})

if (process.argv.length === 5){
    newPerson.save().then( result => {
        console.log('saved', result)
        mongoose.connection.close()
    })
} else if (process.argv.length === 3){
    Person.find({}).then( result => {
        console.log(result)
        mongoose.connection.close()
    })
}
