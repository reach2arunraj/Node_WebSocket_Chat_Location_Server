const express = require("express")
const http = require("http")
const path = require("path")
const socketio = require("socket.io")
const Filter = require("bad-words")

const app = express()
const server = http.createServer(app)
const io = socketio(server)


const publicDirectoryPath = path.join(__dirname, "../public")

app.use(express.static(publicDirectoryPath))

let count = 0;

//server (emit) --> client ( receive ) - countUpdated
//client (emit) --> server ( receive ) - increment

io.on("connection", (socket) =>{
    console.log("New WebSocket connection.")


    socket.emit("message", "Welcome.!")
    socket.broadcast.emit("message", "A new user has joined")

    socket.on("sendMessage", (message, callback) => {

        const filter = new Filter()
        if(filter.isProfane(message)){
            return callback("Profanity is not allowed!")
        }

        io.emit("message", message)
        callback()
    })

    socket.on("sendLocation", (coords, callback) =>{
        io.emit("message", `https://google.com/maps?q=${coords.latitude},${coords.longitude}`)
        callback()
    })

    socket.on("disconnect", () =>{
        io.emit("message", "A user has left")
    })

})

server.listen(process.env.PORT || 3000 , console.log("Server is running..."))