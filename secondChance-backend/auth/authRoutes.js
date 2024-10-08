const jwt=require("jsonwebtoken")
const connectToDatabase=require("../models/db")

 function generateToken(payload){

   return jwt.sign(payload,process.env.JWT_SECRET,{
        expiresIn:"1h"
    },(err,token)=>{
        if(err) return false
        return token;
    })

}
//verify token
 function verifyToken(token){
    jwt.verify(token,process.env.JWT_SECRET,(err,decoded)=>{
        if(err){
            return false;
        }
        
        return decoded;
    })

}
//verify if user exists in a database
 async function userDoesExist(email){
    try {
    const db= await connectToDatabase()
    const users= db.collection("users")
    const doesExist= await users.find({email}).toArray();
    if(!doesExist.length>=1) return false;
    return true;
    } catch (error) {
        return error
        
    }
  
}
module.exports={
    verifyToken,
    generateToken,
    userDoesExist
}