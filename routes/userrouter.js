const express = require('express')
const logincheck = require('../middleware/userSession')
const{
    userhomepage,
    addTowishlist,
    userLogin,
    userSignup,
    getotp,
    cartview,
    productView,
    search,
    productDetails,
    error,
    logout,
    profile,
    addressManage,
    addaddress,
    editaddress,
    edittedaddress,
    deleteAddress,
    getwishlist,
    wishtoCart,
    deletewish,

    homepage,
    otp,
    otpverification,
    addtocart,
    quantityChange,
    deletecart,
    checkout,
    placeorder,
    myOrders,
    forgetpassword,
    forgetpass_validate,
    orderdetails,
    cancelorder,
    returnOrder,
    refund,
    verifycoupon,
    resetPassowrd,
newpassword,
resendotp,

    ordersucess
//     ordernow



     } = require('../controller/user');
const { route } = require('./adminrouter');
const { validate } = require('../models/usersignin');
const router=express.Router();


// router.get('/',userhomepage)
router.get('/login',userLogin)
router.get('/signin',userSignup)
router.get('/otp',getotp)
router.get('/productview',productView)
router.get('/404error',error)
router.get('/logout',logout)
router.get('/profile',logincheck,profile)
router.get('/productDetails/:id',productDetails)



router
      .route('/forgetpassword')
      .get(forgetpassword)
      .post(forgetpass_validate)
      
router
      .route('/resendotp')
      .get(resendotp)

router
      .route('/')
      .get(userhomepage)
      .patch(addTowishlist)


//  router.patch('/addfromhome',addTowishlist)


router
      .route('/shoppingcart-view/')
      .get(logincheck,cartview)
      .patch(quantityChange)
      .delete(deletecart)

 router
      .route('/address-manage')
      .get(logincheck,addressManage)
      .post(addaddress)
      

router
      .route('/edit-address/')
      .get(logincheck,editaddress)
      .post(edittedaddress)


router
      .route('/wishlist')
      .get(logincheck,getwishlist)
      .post(wishtoCart)
      .delete(deletewish)



router
      .route('/checkout')   
      .get (logincheck,checkout)
      .post(placeorder) 
      
router 
      .route('/order-success')
      .get(logincheck,ordersucess)     
      
      

router
      .route('/myOrders')
      .get(logincheck,myOrders)

 router
      .route('/orderDetails/:id')   
      .get(logincheck,orderdetails)  

 router
      .route('/cancelorder/:id')   
      .get(logincheck,cancelorder)   

router
      .route('/verifycoupon')
      .post(verifycoupon)
    
router
      .route('/reset/:token')  
      .get(resetPassowrd)
      
router
      .route('/returnOrder')
      .post(returnOrder)

router 
      .route('/refundrequest')
      .post(refund)


router.post("/resets",newpassword)





router      
      .route('/search')
      .post(search)
      

//router.get('/contact',contact)
//router.get('/about',about)


router.post('/home',homepage) //login to home
router.post('/otp',otp)       //signin to otp page
router.post('/otpverify',otpverification) // otp to home
router.post('/cart/:id',logincheck,addtocart)
router.delete('/profile/',deleteAddress)





module.exports=router;