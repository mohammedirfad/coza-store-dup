const session= (req,res,next)=>{
    if(req.session.adminLogedIn){
   next();

    }else{
        res.redirect("/admin");
    }
}
module.exports={session}