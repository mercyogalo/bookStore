
function checkRole(role){
    return(req,res,next)=>{
        if(!roles.includes(req.user.role)){
            return res.status(403).json({message:"Access denied. Your role does not allow that request"});
        }
    }
}


module.exports=checkRole;