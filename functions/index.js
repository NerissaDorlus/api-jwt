import functions from "firebase-functions";
import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";

const users = [ //mock database
    {id: 1, email:'john@bocacode.com', password:"abcd123" },
    {id: 1, email:'jane@bocacode.com',password: 'defg456'},
    {id: 1, email:'bob@bocacode.com', password: 'ghij789'}
]

const app= express();
app.use(cors())
app.use(express.json());

app.post('/login', (req, res)=> {
    const{email, password} = req.body
    //check to see if email and password exist in db
    //if they do create and send back token
    //if not send error message
    const user = users.find(use => user.email === email && use.password === password)
    if(!user) {
        res.status(401).send("invalid email or password") 
        return;  
     }
     user.password = undefined //erasing password from user object
     res.send('Welcome!')
});
app.get('/public', (req, res)=> {
    res.send('Welcome!')
});
app.get('/private', (req, res)=> {});

export const api = functions.https.onRequest(app);
