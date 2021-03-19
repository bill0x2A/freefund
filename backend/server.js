require('dotenv').config()
const express = require('express')
const mongodb = require('mongodb')
const routes = require('./functions/routes')
const socket = require('./functions/connection')
const cors = require('cors')
const app = express()
const http = require('http').createServer(app);
const io = require('socket.io')(http, {cors: {origin: "*", methods:["GET", "POST"]} });

app.use(express.json())
app.use(cors())

mongodb.connect(process.env.DB, { useUnifiedTopology: true }, (err, client)=>{
    if(err){
         console.log(err)
         return
    }
    const db = client.db('Cluster0')
    routes(app, db)
    socket(io, db)
    http.listen((process.env.PORT || 5000), ()=>{
        console.log("app listening at port " + (process.env.PORT || 5000))
    })
})

module.exports = app