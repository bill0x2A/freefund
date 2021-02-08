const jwt = require('jsonwebtoken')
const shortId = require('shortid')
const secret = "Hellow Helllo Hellloo/\\"

function verify(req, res, next){
    jwt.verify(req.body.token, secret, function(err, decoded) {
        if (err) return res.status(400).send({ message: 'Failed to authenticate token.' });
        
        req.user = decoded.address
        next()
    });
}

module.exports = function (app, dbe){
    const db= db.collection('Crowdfund')

    app.post('/login', (req, res)=>{
        const address = req.body.address
        if(address){
            db.FindOne({address}, (err,doc)=>{
                if(doc){
                    var token = jwt.sign({email: doc.email, address} , secret, {
                        expiresIn: 86400 // expires in 24 hours
                    });
                    res.json({message: "User registered"})
                }else{
                    res.status(400).json({message:"User not yet registered"})
                }
            })
        }else{
            res.status(400).json({message:"Address missing"})
        }
    })

    app.post('/register', (req,res)=>{
        const {address, email, firstName, lastName, location} = req.body
        if(address && email && firstName && lastName && location){
            db.insertOne({address, email, firstName, lastName, location}, (err, docs)=>{
                res.json({message:"registered successfully"})
            })
        }else{
            res.status(400).json({message: "One or more required fields not provided"})
        }
    })

    app.post('/addProject',verify, (req, res)=>{
        const {name, pictures, description, reason, goal, tier1, tier2, tier3 } = req.body
        if(name && pictures && description && reason && goal){
            const id = shortId.generate()
            const address //generate address
            db.insertOne({name, user: req.user, pictures, description, reason, tier1, tier2, tier3, goal, current:0}, (err,doc)=>{
                res.json({message:"Project created successfully",name, id, address })
            })
        }else{
            res.status(400).json({error:true, message:"One or more required fields not provided"})
        }
    })
}