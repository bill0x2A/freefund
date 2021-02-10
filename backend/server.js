require('dotenv').config()
const express = require('express')
const mongodb = require('mongodb')
const routes = require('./functions/routes')
const app = express()
app.use(express.json())


mongodb.connect(process.env.DB, { useUnifiedTopology: true }, (err, client)=>{
    if(err){
         console.log(err)
         return
    }
    const db = client.db('Cluster0')
    routes(app, db)
    app.listen(5000, ()=>{
        console.log("app listening at port 5000")
    })
})