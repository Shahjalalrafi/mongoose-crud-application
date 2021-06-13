const express = require('express')
const mongoose = require('mongoose')
const todoHandler = require('./routeHandler/todoHandler')

const app = express()
app.use(express.json())

const url = "mongodb+srv://myTodos:rafi1234@cluster0.fltsf.mongodb.net/todos?retryWrites=true&w=majority"

// database connect with mongoose
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('connect'))
.catch(err => console.log(err))

app.use('/todo', todoHandler)

function errorHandler(err, req, res, next) {
    if(req.headersSent) {
        return next(err)
    }else {
        res.status(500).json({error: err})
    }
}

app.listen(3000, () => console.log('listening to port 3000'))