const router = require('express').Router()
const bcryptjs = require('bcryptjs')

const Users = require('../users/user-model')

router.post("/register", (req, res) => {
    const credentials = req.body
    
    const rounds = process.env.BCRYPT_ROUNDS || 10

    const hash = bcryptjs.hashSync(credentials.password, rounds)
    credentials.password = hash

    if(credentials){
        Users.add(credentials).then(user => {
            res.status(201).json({ data: user})
        })
        .catch(error => {
            res.status(500).json({ message: error.message })
        })
    } else {
        res.status(400).json({ message: "please provide a valid username and password"})
    }
})

router.post("/login", (req, res) => {
    const { username, password } = req.body

    if(req.body){
        Users.findBy({ username: username })
        .then(([user]) => {
            if(user && bcryptjs.compareSync(password, user.password)){
                req.session.loggedIn = true
                req.session.user = user

                res.status(200).json({ message: `Logged in`})
            } else {
                res.status(401).json({ message: "You shall not pass!" })
            }
        })
        .catch(error => {
            res.status(500).json({ message: error.message })
        })
    } else {
        res.status(400).json({ message: "please provide a valid username and password." })
    }
})

router.get('/logout', (req, res) => {
    if(req.session){
        req.session.destroy(err => {
            if(err){
                res.status(500).json({ message: "we can not log you out"})
            } else {
                res.status(204).end()
            }
        })
    } else {
        res.status(204).end()
    }
})

module.exports = router