const express = require("express")
const session = require("express-session")

const authRouter = require("../auth/auth-router")
const userRouter = require("../users/user-router")

const server = express()

const sessionConfig = {
    cookie: {
        maxAge: 1000 * 60 * 60,
        secure: process.env.SECURE_COOKIE || false,
        httpOnly: true,
      },
      resave: false,
      saveUninitialized: process.env.USER_ALLOW_COOKIES || true,
      name: 'session',
      secret: process.env.COOKIE_SECRET || 'keepitsecret',
}

server.use(express.json())
server.use(session(sessionConfig))

server.use("/api/users", userRouter)
server.use("/api/auth", authRouter)

server.get("/", (req, res) => {
    res.json({ message: "api is up!"})
})

module.exports = server