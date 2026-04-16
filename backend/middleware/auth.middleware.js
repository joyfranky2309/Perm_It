const jwt = require('jsonwebtoken')

const authMiddleware=async(req,res,next)=>{
    try {
        const token=req.headers.authorization?.split(' ')[1]
        if(!token){
            throw new Error("Unauthorized")
        }
        const decoded=jwt.verify(token,process.env.JWT_SECRET)
        req.user=decoded;
        next();
    } catch (error) {
        res.status(401).json({"message":"Unauthorized"})
    }
}
module.exports=authMiddleware;