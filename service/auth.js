const jwt = require("jsonwebtoken");
const secret="Shha@1617";


//this function make tokens for user
function setUser(user){
    
    return jwt.sign(
        {
        _id:user._id,
        email:user.email,

    },
    secret);
}

//
function getUser(token){
   // return sessionIdToUserMap.get(id);
   if(!token) return null;
   try{
    return jwt.verify(token,secret);
   }catch(error){
    return null;
   }
     
}
module.exports ={
    setUser,
    getUser,
};