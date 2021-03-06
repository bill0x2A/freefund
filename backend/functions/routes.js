const jwt = require('jsonwebtoken')
const shortId = require('shortid')
const secret = "Hellow Helllo Hellloo/\\"

function verify(req, res, next){
    jwt.verify(req.body.token, secret, function(err, decoded) {
        if (err) return res.status(400).send({ message: err });
        
        req.user = decoded.address
        next()
    });
}

module.exports = function (app, dbe){
    const db= dbe.collection('CrowdfundProject')
    const user = dbe.collection('CrowdfundUsers')
    const chats = dbe.collection("CrowdfundChats")

    app.get('/', (req,res)=>{
        res.send("Hello and Welcome to Freefund")
    })
    
    app.post('/login', (req, res)=>{
        const address = req.body.address
        if(address){
            user.findOne({address}, (err,doc)=>{
                if(doc){
                    var token = jwt.sign({_id: doc._id, email: doc.email, address, time: Date.now()} , secret, {
                        expiresIn: 86400 // expires in 24 hours
                    });
                    let dc = {...doc}
                    delete dc.password
                    res.json({message: "Login successful", data: dc, token, _id: doc._id})
                }else{
                    res.status(400).json({message:"User not yet registered"})
                }
            })
        }else{
            res.status(400).json({message:"Address missing", error:true})
        }
    })

    app.post('/register', (req,res)=>{
        const {address, countryCode, bio, imgHash, email, firstName, lastName} = req.body
        if(address && email && firstName && lastName && countryCode){
            user.findOne({address}, (err,doc)=>{
                if(doc){
                    res.status(400).json({message:"User already registered"})
                }else{
                    
                    user.insertOne({address, email, firstName, lastName, countryCode, bio, imgHash, fundedProjects:[], createdProjects:[], balance:"0.00", createdAt: new Date(), updatedAt: new Date(), chats:[]}, (err, docs)=>{
                        var token = jwt.sign({_id: docs.ops[0]._id, email: email, address, time: Date.now()} , secret, {
                            expiresIn: 86400 // expires in 24 hours
                        });
                        res.json({message:"registered successfully", token, _id:docs.ops[0]._id})
                    })
                }
            })
            
        }else{
            res.status(400).json({message: "One or more required fields not provided", error:true})
        }
    })

    app.post('/addProject',verify, (req, res)=>{
        const {title, tagline, creatorAddress, fundingAddress, imgHashes, description, fundingLimit, 
            funding, tiers, funders, headerHash, videoUrl, tags, endTime} = req.body
        
        if(title && imgHashes && description && fundingLimit && creatorAddress){
            const id = shortId.generate()+shortId.generate()
            //const address = null //generate address
            user.findOne({address: creatorAddress}, (err,doc)=>{
                if(doc){
                    user.findOneAndUpdate({address: creatorAddress}, {$set: {updatedAt: new Date()}, 
                    $push :{ createdProjects: {title, tagline, id, description, fundingAddress, imgHashes, fundingLimit} }} )
                    db.insertOne({title, tagline, user: req.user, id, description, creatorAddress, fundingAddress,
                        imgHashes, fundingLimit, funding: funding?funding:0, tiers, funders, headerHash,
                         videoUrl, tags, endTime, createdAt: new Date(), updatedAt: new Date() }, (err,doc)=>{
                            res.json({message:"Project created successfully",title, id, creatorAddress, fundingAddress })
                    })
                }else{
                    res.status(400).json({error:true, message:"Creator not a registered user"})
                }
            })
            
        }else{
            res.status(400).json({error:true, message:"One or more required fields not provided"})
        }
    })

    app.get('/listProjects', async (req,res)=>{
        let data = await db.find()
        data = await data.toArray()
        
        let datum = data.map(i=> {
            delete i._id
            return i
        })

        res.json({projects: datum})
    })

    app.post('/project', (req,res)=>{
        const id = req.body.id
        if(id){
            db.findOne({id}, (err,doc)=>{
                if(doc){
                    delete doc._id
                    res.json({message:"Found successfully", data:doc})
                }else{
                    res.status(400).json({message:"Incorrect Id"})
                }
            })
        }else{
            res.status(400).json({error:true, message: "No id given"})
        }
    })

    app.post('/user', (req, res)=>{
        const address = req.body.address
        if(address){
            user.findOne({address}, (err,doc)=>{
                if(doc){
                    delete doc.password
                    res.json({message: "User registered", data: doc})
                }else{
                    res.status(400).json({message:"User not yet registered"})
                }
            })
        }else{
            res.status(400).json({message:"Address missing", error:true})
        }
    })
    
    app.post('/short', (req, res)=>{
        const address = req.body.address
        if(address){
            user.findOne({address}, (err,doc)=>{
                if(doc){
                    let {firstName, lastName, countryCode, bio, imgHash, address} = doc
                    let data = {firstName, lastName, bio, imgHash, countryCode, address}
                    res.json({message: "User registered", data})
                }else{
                    res.status(400).json({message:"User not yet registered"})
                }
            })
        }else{
            res.status(400).json({message:"Address missing", error:true})
        }
    })

    app.post('/addBalance', verify, (req,res)=>{
        const address = req.body.address
        if(address){
            user.findOne({address}, (err,doc)=>{
                if(doc){
                    user.findOneAndUpdate({address}, { $add: {balance: req.body.amount} })
                    res.json({message: "Balance Updated", data: doc})
                }else{
                    res.status(400).json({message:"User not yet registered"})
                }
            })
        }else{
            res.status(400).json({message:"Address missing", error:true})
        }
    })

    app.post('/reduceBalance', verify, (req,res)=>{
        const address = req.body.address
        if(address){
            user.findOne({address}, (err,doc)=>{
                if(doc){
                    user.findOneAndUpdate({address}, { $add: {balance: req.body.amount*-1} })
                    res.json({message: "Balance Updated", data: doc})
                }else{
                    res.status(400).json({message:"User not yet registered"})
                }
            })
        }else{
            res.status(400).json({message:"Address missing", error:true})
        }
    })
    
    app.post('/getChats', verify, async(req, res)=>{
        const address = req.body.address
        if(address){
            user.findOne({address}, (err,doc)=>{
                if(doc){
                    let chats = doc.chats
                    res.json({message: "Success", data: chats})
                }else{
                    res.status(400).json({message:"User not yet registered"})
                }
            })
        }else{
            res.status(400).json({message:"Address missing", error:true})
        }
    })

    app.post('/getChat', async(req, res)=>{
        const id = req.body.chatId
        if(id){
            chats.findOne({id}, (err, doc)=>{
                if(doc){
                    let chat = doc.message
                    res.json({message: "Success", data: chat})
                }else{
                    res.status(400).json({message:"Chat not found"})
                }
            })
        }else{
            res.status(400).json({message:"Address missing", error:true})
        }
    })
}
