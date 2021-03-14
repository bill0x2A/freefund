
const shortId = require('shortid')

module.exports = function(io, dbe){
    const db= dbe.collection('CrowdfundProject')
    const user = dbe.collection('CrowdfundUsers')
    const chats = dbe.collection("CrowdfundChats")

    io.on('connection', socket=>{
        console.log("User joined", socket.id )
        
        socket.emit("User", socket.id)

        socket.on("join", data=>{
            socket.join(data._id)
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
            let id = shortId.generate()
            user.findOneAndUpdate({address:data.userAddress}, {$push: {$chats: {id,name: data.name} }})
            chats.insertOne({id, message:[{time:new Date(), chat: data.message}]})
            user.findOne({address: data.userAddress}, doc =>{
                socket.to(data._id).emit("send", {chatId:id, message:data.message, temp:socket.id, userId: doc._id, userName: doc.firstName+" "+doc.lastName})
            })
            
        })

        // respond to new chat
        socket.on("accept", data =>{
            user.findOneAndUpdate({address:data.userAddress}, {$push: {$chats: {id: data.chatId,name: data.name} }})
            socket.to(data._id).emit("accepted", data.chatId)
        })

        // continue chat
        socket.on("chat", data=>{
            chats.insertOne({id: data.chatId, message:[{time:new Date(), chat: data.message}]})
            socket.to(data._id).emit("chatted", {message: data.message, chatId: data.chatId})
        })

        // disconnection listener
        socket.on('disconnect', ()=>{
            console.log("User "+socket.id+ " disconnected")
        })
    })

}