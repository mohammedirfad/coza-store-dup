const user =require('../models/usersignin')

const logincheck = (req,res,next)=>{
    
    if(req.session.loggedin){
        next();
    }
    else{
        res.redirect('/login')
    }
   
}




module.exports=logincheck