import functions from "firebase-functions";
import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import mySecretKey from "./secret.js"

const users = [ //mock database
    {id: 1, email:'john@bocacode.com', password:'abcd123' },
    {id: 2, email:'jane@bocacode.com',password: 'defg456'},
    {id: 3, email:'bob@bocacode.com', password: 'ghij789'}
]

const app= express();
app.use(cors())
app.use(express.json());

app.post('/login', (req, res)=> {
    const{email, password} = req.body
    //check to see if email and password exist in db
    //if they do create and send back token
    //if not send error message
    let user = users.find(user => user.email === email && user.password === password)
    if(!user) {
        res.status(401).send({error: "invalid email or password"}) 
        return;  
     }
     user.password = undefined //erasing password from user object
     //create and sign a token
     const token = jwt.sign(user, mySecretKey, {expiresIn: '1hr'}) //.sign creates key and turns it into a token
     res.send({token})
});

app.get('/public', (req, res)=> {
    res.send({message: 'Welcome!'})
});

app.get('/private', (req, res)=> {
    //let's require valid token to see this
    const token = req.headers.authorization || "";
    if(!token) {
        res.status(401).send({error: 'You must be logged in to see this'})
    }
    jwt.verify(token, mySecretKey, (err, decoded) => {
        if(err){
            res.status(401).send({error:'You must use a valid token to see this' + error});
            return;
        }
        //we will know if token is valid
        //check if decoded.id is the user they claim to be
        //can update this record in db
        res.send({message:`Welcome ${decoded.email}!`})
    })
});

export const api = functions.https.onRequest(app);
