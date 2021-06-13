const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const todoScema = require('../scemas/todoScema')

const Todo = new mongoose.model('Todo', todoScema)

router.get('/', async (req, res) => {
    await Todo.find({status: "inactive"})
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

router.get('/:id', async (req, res) => {
    await Todo.find({_id: req.params.id})
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
router.post('/', async (req, res) => {
    const newTodo = new Todo(req.body)
    await newTodo.save((err) => {
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
router.post('/all', async (req, res) => {
    await Todo.insertMany(req.body, (err) => {
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

router.put('/:id', async (req, res) => {
    const result = await Todo.findByIdAndUpdate({_id: req.params.id}, {
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

router.delete('/:id', async (req, res) => {
    await Todo.deleteOne({_id: req.params.id}, (err, data) => {
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