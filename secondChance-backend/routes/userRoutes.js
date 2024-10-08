const express =require("express")
const bcrypt=require("bcryptjs")

const contectToDatabes=require("../models/db");
const connectToDatabase = require("../models/db");
const{ userDoesExist,generateToken, verifyToken }=require("../auth/authRoutes");
const logger = require("../../sentiment/logger");
const router=express.Router()

router.post('/register', async (req, res) => {
    try {
       let user={};
       if(req.body){
        user.firstName=req.body.firstName;
        user.lastName=req.body.lastName
        user.email=req.body.email;
       user.createdAt=new Date()
       console.log(user)
       }
       else{
        return res.status(401).json({message:"All fields are required"})
       }
       
        // Task 1: Connect to `secondChance` in MongoDB through `connectToDatabase` in `db.js`.
      const db = await connectToDatabase();
        // Task 2: Access MongoDB `users` collection
      const users=await db.collection("users")
        // Task 3: Check if user credentials already exists in the database and throw an error if they do
        const userExists=userDoesExist(req.body.email)
        if(userExists) return res.status(401).json({message:"User already Exists."})
        // Task 4: Create a hash to encrypt the password so that it is not readable in the database
        const salt= await bcrypt.genSalt(10)
        const hashedPassword= await bcrypt.hash(req.body.password,salt)
        user.password=hashedPassword;
        // Task 5: Insert the user into the database
        const newUser= await users.insertOne(user)
        // Task 6: Create JWT authentication if passwords match with user._id as payload
        const payload={user:{
            id:newUser.insertedId
        }}
        const authToken=generateToken(payload)
        if(authToken)  {
            logger.info("User registered successfully")
            res.status(201).json({authToken,email})
        }
        else{
            res.status(401).json({message:""})
        }
        // Task 7: Log the successful registration using the logger
        // Task 8: Return the user email and the token as a JSON
    } catch (e) {
         return res.status(500).send('Internal server error');
    }
});
router.post('/login', async (req, res) => {
    try {
        // Task 1: Connect to `secondChance` in MongoDB through `connectToDatabase` in `db.js`.
       const db= await connectToDatabase()
        // Task 2: Access MongoDB `users` collection
        const users=await db.collection("users")
        // Task 3: Check for user credentials in database
        const user= await users.findOne({email:req.body.email}).toArray();
        if(!user) return res.status(404).json({message:"User not found"})
        // Task 4: Check if the password matches the encrypted password and send appropriate message on mismatch
        const isMatch= await bcrypt.compare(req.body.password,user.password);
        if(!isMatch) return res.status(401).json({message:"User name or password does not match"})
        // Task 5: Fetch user details from a database
       const userName=user.firstName
       const userEmail=user.email;
        // Task 6: Create JWT authentication if passwords match with user._id as payload
        const authtoken= generateToken({user:{
            id:user._id.toString()
        }})

        res.json({authtoken, userName, userEmail });
        // Task 7: Send appropriate message if the user is not found
    } catch (e) {
         return res.status(500).send('Internal server error');

    }
});
module.exports=router;