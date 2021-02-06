require('dotenv').config()
const express = require('express')
const mongodb = require('mongodb')
const routes = require('./functions/routes')
const app = express()


mongodb.connect(process.env.DB, (err, client)=>{
    const db = client('Cluster0')
    routes(app, db)
    app.listen(5000, ()=>{
        console.log("app listening at port 5000")
    })
})