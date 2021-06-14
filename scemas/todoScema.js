const mongoose = require('mongoose')

const todoScema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    status: {
        type: String,
        enum: ['active', 'inactive'],
    },
    date: {
        type: Date,
        default: Date.now
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    }
})

// instance method 
todoScema.methods = {
    findActive: function () {
        return mongoose.model('Todo').find({status: 'inactive'})
    }
}

// static method
todoScema.statics = {
    findcode: function() {
        return this.find({title: /code/i})
    }
}

// query
todoScema.query = {
    queryLanguage: function (language) {
        return this.find({title: new RegExp(language, 'i')})
    }
}

module.exports = todoScema