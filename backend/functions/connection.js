
const shortId = require('shortid')

module.exports = function(io, dbe){
    const db= dbe.collection('CrowdfundProject')
    const user = dbe.collection('CrowdfundUsers')

    io.on('connection', socket=>{
        console.log("User joined", socket.id )
        
        socket.emit("User", socket.id)

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

        // disconnection listener
        socket.on('disconnect', ()=>{
            console.log("User "+socket.id+ " disconnected")
        })
    })

}