const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const todoScema = require('../scemas/todoScema')
const checkLoginHandler = require('../middleWare/checkLogin') 

const Todo = new mongoose.model('Todo', todoScema)

router.get('/', checkLoginHandler, (req, res) => {
    Todo.find({status: "inactive"})
    .select({
        _id: 0,
        date: 0,
        __v: 0
    })
    .limit(2)
    .exec((err, data) => {
        if(err){
            res.status(500).json({
                error: 'there was a server side error'
            })
        }else {
            res.status(200).json({
                result: data,
                message: 'success'
            })
        }
    })
})

router.get('/inactive', async (req, res) => {
   const todo = new Todo()
   const data = await todo.findActive().select({
       _id: 0
   })
   res.status(200).json({
       data
   })
})

router.get('/code', async (req, res) => {
    const data = await Todo.findcode()
    res.status(200).json({
        data
    })
})

router.get('/language', async(req, res) => {
    const data = await Todo.find().queryLanguage('mahbub')
    res.status(200).json({
        data
    })
})

router.get('/:id', (req, res) => {
    Todo.find({_id: req.params.id})
    .select({
        _id: 0,
        __v: 0,
        date: 0
    })
    .exec((err, data) => {
        if(err){
            res.status(500).json({
                error: 'there was a server side error'
            })
        }else {
            res.status(200).json({
                result: data,
                message: 'success'
            })
        }
    })
})

// post single todo
router.post('/', (req, res) => {
    const newTodo = new Todo(req.body)
    newTodo.save((err) => {
        if(err){
            res.status(500).json({
                error: 'there was a server side error'
            })
        }else {
            res.status(200).json({
                message: 'data inserted succesfully'
            })
        }
    })
})

// post multiple todo
router.post('/all', (req, res) => {
    Todo.insertMany(req.body, (err) => {
        if (err) {
          res.status(500).json({
            error: "There was a server side error!",
          });
        } else {
          res.status(200).json({
            message: "Todos were inserted successfully!",
          });
        }
      });
})

router.put('/:id', (req, res) => {
    const result = Todo.findByIdAndUpdate({_id: req.params.id}, {
        $set: {
            status: 'inactive'
        }
    },
    {
        useFindAndModify : false
    },
     (err) => {
        if (err) {
            res.status(500).json({
              error: "There was a server side error!",
            });
          } else {
            res.status(200).json({
              message: "Todo updated successfully!",
            });
          }
    })
    console.log(result)
})

router.delete('/:id', (req, res) => {
    Todo.deleteOne({_id: req.params.id}, (err, data) => {
        if (err) {
            res.status(500).json({
              error: "There was a server side error!",
            });
          } else {
            res.status(200).json({
              message: "Todo deleted successfully!",
            });
          }
    })
})




module.exports= router