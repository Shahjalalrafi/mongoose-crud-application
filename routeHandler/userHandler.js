const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const router = express.Router()
const userScema = require('../scemas/userScema')

const User = new mongoose.model('user', userScema)

router.post('/singUp', async (req, res) => {
    try{
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        const newUser = new User({
            name: req.body.name,
            userName: req.body.userName,
            password: hashedPassword
    })
        await newUser.save()
        res.status(200).json({
        message: "Sign up susccesfully"
    })
    }catch {
        res.status(500).json({
            error: "signup failed!"
        })
    }
})

// // Login
// router.post('/login', async (req, res) => {
//     try {
//         const user = await User.find({userName: req.body.userName})
//         if(user && user.length > 0) {
//             const isPassWordValid = await bcrypt.compare(req.body.password, user[0].password)
//             if(isPassWordValid){
//                 // generate token
//                 const token = jwt.Sign({
//                     userName: user[0].userName,
//                     userId: user[0]._id
//                 }, process.env.JWT_SECRET, { expiresIn: '1h' })
                
//                 res.status(200).json({
//                     access_token: token,
//                     message: "Login success"
//                 })
//             }else {
//                 res.status(404).json({
//                     error: 'authentication failed!'
//                 })
//             }

//         }else {
//             res.status(401).json({
//                 error: 'authentication failed!'
//             })
//         }
//     }catch{
//         res.status(401).json({
//             error: 'authentication failed!'
//         })
//     }
// })


// LOGIN
router.post("/login", async(req, res) => {
    try {
        const user = await User.find({ userName: req.body.userName });
        if(user && user.length > 0) {
            const isValidPassword = await bcrypt.compare(req.body.password, user[0].password);

            if(isValidPassword) {
                // generate token
                const token = jwt.sign({
                    userName: user[0].userName,
                    userId: user[0]._id,
                }, process.env.JWT_SECRET, {
                    expiresIn: '1h'
                });

                res.status(200).json({
                    "access_token": token,
                    "message": "Login successful!"
                });
            } else {
                res.status(401).json({
                    "error": "Authetication failed!"
                });
            }
        } else {
            res.status(401).json({
                "error": "Authetication failed!"
            });
        }
    } catch {
        res.status(401).json({
            "error": "Authetication failed!"
        });
    }
});

module.exports= router