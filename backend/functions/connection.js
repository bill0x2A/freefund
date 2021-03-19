
const shortId = require('shortid')
const ObjectId = require('mongodb').ObjectID
const secret = "Hellow Helllo Hellloo/\\"

function verify(token){
    jwt.verify(token, secret, function(err, decoded) {
        if (err) return 

        return decoded._id
    });
}

module.exports = function(io, dbe){
    const db= dbe.collection('CrowdfundProject')
    const user = dbe.collection('CrowdfundUsers')
    const chats = dbe.collection("CrowdfundChats")

    io.on('connection', socket=>{
        console.log("User joined", socket.id )
        
        //socket.emit("User", socket.id)

        socket.on("join", data=>{
            //console.log('this')
            socket.join(data._id)
        })

        socket.on("joinToken", data=>{
            console.log('this!')
            let _id = verify(data)
            if(_id){
                socket.join(_id)
            }
        })

        // a new contributor to a project
        socket.on("newContributor", (data)=>{
            user.findOne({address:data.address}, (err,doc)=>{
                if(doc){
                    user.findOneAndUpdate({address:data.address}, {$push:{fundedProjects: data.id} } )
                    socket.join(data.room)
                }
            })
            
        })

        // new Project
        socket.on("newProject", (data)=>{
            let id = shortId.generate()
            
            db.findOneAndUpdate({id: data.id}, {$set: {room:id} } )
            socket.join(id).emit("projectCreated", id)
        })

        // notification on payment made to a project
        socket.on("fund", (data)=>{
            socket.to(data.room).emit("projectFunded", data)
        })

        // payment notifications for other contributors on a project
        socket.on("funded", (data)=>{
            socket.broadcast.to(data.room).emit("aNewContributor", data)
        })

        // Notifications for project goal reached
        socket.on("goal", (data)=>{
            socket.to(data.room).emit("goalReached", data)
        })

        //project added on the platform
        socket.on("add", (data)=>{
            io.emit("newProjectAdded", data)
        })

        //new chat created
        socket.on("createChat", data =>{
            //socket.join(data.roomId)
            console.log('help')
            let id = shortId.generate()
            
            user.findOne({address: data.address}, (err,doc) =>{
                chats.insertOne({id, message:[{name: doc.firstName+" "+doc.lastName, time:new Date(), chat: data.message}]})
                
                user.findOne({address: data.userAddress}, (err2, docs) =>{
                    user.findOneAndUpdate({address:data.address}, {$push: {$chats: {id,name: docs.firstName+" "+docs.lastName, timeCreated: new Date(), timeUpdated: new Date(), accepted: false, imgHash: data.imgHash} }})
                    socket.emit("save", id)
                    socket.to(docs._id).emit("send", {chatId:id, message:data.message, temp:socket.id, userId: doc._id, userName: doc.firstName+" "+doc.lastName})
                })
                
            })
            
        })

        // respond to new chat
        socket.on("accept", data =>{
            user.findOne({_id: new ObjectId(data._id)}, (err, doc)=>{
                user.findOneAndUpdate({address:data.userAddress}, {$push: {$chats: {id: data.chatId,name: doc.firstName+" "+doc.lastName, timeCreated: new Date(), timeUpdated: new Date(), accepted: false, imgHash: doc.imgHash} }})
            })
            
            socket.to(data._id).emit("accepted", data.chatId)
        })

        // continue chat
        socket.on("chat", data=>{
            chats.findOneAndUpdate({id: data.chatId}, { $push: {message: data.message } })
            socket.to(data._id).emit("chatted", {message: data.message, chatId: data.chatId})
        })

        // disconnection listener
        socket.on('disconnect', ()=>{
            console.log("User "+socket.id+ " disconnected")
        })
    })

}