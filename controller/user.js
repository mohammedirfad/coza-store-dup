const UserDb = require('../models/usersignin')
const User_cat = require('../models/category_schema')
const productdb = require('../models/product_schema')
const Cartdb = require('../models/cart_schema')
const Address = require('../models/address_schema')
const Orderdb = require('../models/order_schema')
const Wishlistdb = require('../models/wishlist_schema')
const coupondb   = require('../models/coupon_schema')
const Bannerdb   = require("../models/banner_schema")
const bcrypt = require('bcrypt');
const {sendotp,verifyotp } = require("../utilities/otpverify");
const { default: mongoose } = require('mongoose');
const { findOne } = require('../models/usersignin');
const router = require('../routes/userrouter');
const crypto = require('crypto')
const dotenv = require('dotenv')
dotenv.config({ path: './.env' })


const randomstring = require('randomstring')

const nodemailer = require('nodemailer')


const mailer = nodemailer.createTransport({
    host:process.env.server,
    port:process.env.mailerport,
    auth:{
        user:process.env.Login,
        pass:process.env.pass
    },
})




const userhomepage = async (req, res) => {

    let usercat = await User_cat.find();
    

    let product = await productdb.find().limit(8);
    const Banner = await Bannerdb.find()
    console.log(Banner)
    console.log(req.session.user_detail,"<><><><<<><");
     const user = req.session.user_detail
    



    if (user) {
        const wishlist = await Wishlistdb.findOne({ user: req.session.user_detail._id })
        const owner_id = req.session.user_detail
        
     

        let wishproducts;
        if (wishlist) {

            wishproducts = wishlist.items;
        }
        else {
            wishproducts = []
            
        }
        console.log("wish---------------",wishproducts);
        

        res.render('user/userhome', { login: req.session.loggedin, usercat, product, wishproducts,Banner })

    }
    else {
      
        console.log("not loged yet")
        res.render('user/userhome', { login: req.session.loggedin, usercat, product,Banner, })
    }


    // console.log(product)

}

const userLogin = (req, res) => {

    const message = req.session.msg;
    res.render('user/userlogin',{message})
}

const userSignup = (req, res) => {
    res.render('user/usersign')
}

const logout = (req, res) => {
    req.session.destroy()
    res.redirect('/login')
}


const getotp = (req, res) => {
    res.render('user/otp')
}

const profile = async (req, res) => {


    const id = req.session.user_detail._id
    console.log(id)

    const find_user = await UserDb.findOne({ _id: id })
    const address = await Address.findOne({ user: id }).populate('user')


    let user_address;
    if (address) {
        user_address = address.address

    }
    else {
        user_address = []
    }
    console.log(user_address)
    res.render('user/profile', { login: req.session.loggedin, find_user, user: req.session.user_detail, address, user_address })
}

//add-address(get)

const addressManage = async (req, res) => {

    try {
        res.render('user/addaddress', { login: req.session.loggedin,user: req.session.user_detail })

    }
    catch (err) {
        res.render('user/404')
    }

}

//post-address (post)
const addaddress = async (req, res) => {

    try {
        console.log(req.body)
        id = req.session.user_detail._id
        console.log("hi.........................,,,,,,,,...,,,,,")
        const existAddress = await Address.findOne({ user: id })

        console.log("hiiiii", existAddress)

        if (existAddress) {
            await Address.findOneAndUpdate({ user: id },
                {
                    $push: {
                        address: [req.body]

                    }
                }).then(() => {
                    res.redirect('/profile')
                })
        }
        else {
            const address = new Address({
                user: id,
                address: [req.body]

            })
            address.save().then(() => {
                res.redirect('/profile')
            })

        }
    }
    catch (err) {
        res.send("somthing wrong")   // res.render('user/404error')
    }

}


//edit-address (get)

const editaddress = async (req, res) => {

    try {
        // console.log(req.params.id)
        // const ids= req.params.id
        //follow according to the schema,find the user and then find the user address
        //    let findUser_address = await Address.find({ user:req.session.user_detail})
        //    console.log("ejnfb3oy4uwe3yuoiryhvy",findUser_address)
        id = req.params.id
        ids = req.session.user_detail._id

        const address = await Address.findOne({ user: ids })
        const address1 = await Address.findOne({ _id: mongoose.Types.ObjectId(ids) })


        console.log("............................................")
        console.log(address)

        res.render('user/editaddress',{length:req.session.Cartlength})
    }
    catch (error) {
        res.send("eroor occured")
    }
}

//edit-adddress
const edittedaddress = async (req, res) => {
    console.log(req.body)

    res.redirect('/profile')
}


//delete-address
const deleteAddress = async (req, res) => {
    try {
        console.log(";;;;;", req.session.user_detail._id)
        const Ids = req.session.user_detail._id

        console.log("qdowug................", req.query.address)
        const id = req.query.address

        await Address.updateOne({ user: Ids }
            ,
            {
                $pull: { address: { _id: id } }
            });
        res.json("sucessfully deleted", data)

    }
    catch (error) {
        res.send("oops!! somthong went wrong")

    }

}

//searching ...
const search = async (req,res)=>{
    console.log(req.body)
   const Sresult= [];
    let payload = req.body.payload;
    console.log(req.body)
    console.log(payload)
    let regExp = new RegExp('^'+payload+'.*','i')
    let search = await productdb.aggregate([{$match:{$or:[{name:regExp},{brand:regExp}]}}])
    console.log(search,"<><><><><><><>><")
    search.forEach((el,i)=>{
        Sresult.push({name:el.name , type:'product' ,id:el._id})
    })
    // search = search).slice(0,10);
    res.send({payload:Sresult})

   


}

// porduct- view
const productView = async (req, res) => {

    console.log(req.query,"<<<<<><><><><><><><><><><><><><><><><><>>><><><><><")
    const sort = req.query.sort;
    let usercats = await User_cat.find();
    let products = await productdb.find();
    let product;
    if(sort=='Default'){
        product = await productdb.find()
        console.log(product,"1")

    }
    else if(sort =='Newness'){
        product = await productdb.find().sort({createdAt:1})
    }
    else if(sort =='acending'){
        product = await productdb.find().sort({price:1})
    }
    else if(sort =='decending'){
        product = await productdb.find().sort({price:-1})
    }
    else if(sort =='all'){
        product = await productdb.find()
    }
    else if(sort =='100-500'){
        product = await productdb.find({price:{$gte:100 ,$lte:500}})
    }
    else if(sort =='600-800'){
        product = await productdb.find({price:{$gte:600 ,$lte:800}})
    }
    else if(sort =='900-1100'){
        product = await productdb.find({price:{$gte:900 ,$lte:1100}})
    }
    else if(sort =='1200-2000'){
        product = await productdb.find({price:{$gte:1200 ,$lte:2000}})
    }
    else if(sort =='2100'){
        product = await productdb.find({price:{$gte:2100 }})
    }
    else if(sort == 'allProduct'){
        product = await productdb.find()
    }
    else if(sort == 'Women'){
        product = await productdb.find({category:{$eq:'womens'}})
   
    }
    else if(sort == 'Mens'){
        product = await productdb.find({category:{$eq:'Mens'}})
   
    }
    else if(sort == 'cap'){
        product = await productdb.find({category:{$eq:'cap'}})
   
    }

    else{
        product = await productdb.find()
    }

   
  
    const user = req.session.user_detail 

    if (user) {
        const wishlist = await Wishlistdb.findOne({ user: req.session.user_detail._id })

        let wishproducts;
        if (wishlist) {

            wishproducts = wishlist.items;
        }
        else {
            wishproducts = []
            
        }
        console.log("wish---------------",wishproducts);

        // res.render('user/userhome', { login: req.session.loggedin, usercat, product, wishproducts,Banner })
        res.render('user/shop', { login: req.session.loggedin, product,wishproducts })
    }
    else {
        console.log("not loged yet")
        res.render('user/shop', { login: req.session.loggedin, product })

    }


}

//single-productView
const productDetails = async (req, res) => {

    let ID = req.params.id
    let usercats = await User_cat.find();
    // let products = await productdb.find({user: ID });

    let products = await productdb.find({ _id: ID })
    res.render('user/productdetails', { login: req.session.loggedin, products, usercats })
}


// Cart-view
const cartview = async (req, res) => {
    try {
        console.log(req.session.user_detail)
        let owner_id = req.session.user_detail._id
        const cartItems = await Cartdb.findOne({ user: mongoose.Types.ObjectId(owner_id) })
            .populate('items.product')

        res.render('user/cartview', { login: req.session.loggedin, cartItems, user: req.session.user_detail})
       
    }

    catch (rr) {
        console.log(rr)
    }
}
const error = (req, res) => {
    res.render('user/404error', { login: req.session.loggedin })
}


const homepage = async (req, res) => {
    console.log(req.body)
    const { email, password } = req.body

    const userlogindetails = await UserDb.findOne({ email: email })
    console.log("ho", userlogindetails)
    console.log("looking")

    if (userlogindetails) {

        req.session.user_detail = userlogindetails
        console.log("successfull user");
        await bcrypt.compare(password, userlogindetails.password, (err, data) => {


            if (err) throw err;

            else if (data) {
                console.log(UserDb.block)
                if (userlogindetails.block === true) {

                    console.log(data, "1111115")
                    req.session.loggedin = true
                    res.redirect('/')
                }
                else {
                     req.session.msg = "Account has been Blocked"
                    res.redirect('/404error')
                    //  res.send("user blocked")
                }

            }
            else {
                console.log("wrong passeord")
                req.session.msg = "Password Wrong."
                res.redirect('/login')
            }
        })
    }
    else {
        console.log("wrong user")
        req.session.msg = "You have Entered Wrong Email"
        res.redirect('/login')
    }
}


const otp = async (req, res) => {
    console.log(req.body)

    const email = req.body.email;
    const number = req.body.mobile;
    const user = await UserDb.findOne({ email: email })

    if (user) {
        console.log("user exists already")
        res.redirect('/signin')
    }
    else {
        console.log("new user")
        sendotp(number)

        req.session.usersign = req.body
        res.redirect('/otp')

    }
}

const otpverification = async (req, res) => {
    console.log("hailooooooo")

    console.log(req.body)
    const otp = req.body.otp;
    console.log(req.session.usersign)

    const { fname, email, password, repassword, mobile } = req.session.usersign
    console.log("started to verify....")
    verifyotp(mobile, otp).then(async (verification_check) => {
        if (verification_check.status == "approved") {
            console.log(password);
            console.log("still verifying....")
            const hashpassword = await bcrypt.hash(password, 10)
            const hashrepassword = await bcrypt.hash(repassword, 10)

            userdetails = UserDb({
                fname: fname,
                email: email,
                password: hashpassword,
                repassword: hashrepassword,
                mobile: mobile

            });

            req.session.loggedin = true

            console.log(userdetails,"userdetails");
            userdetails.save().then((res) => {


               
                console.log('-b\\\\\\\\\\\\\\\\\\\\\\\\\\\\',res)
            })
            req.session.user_detail = userdetails


            res.redirect('/')
        }
        else {
            // req.send("entered password is error");
            res.redirect('/otp')

        }
    })

}

const addtocart = async (req, res) => {
    

    const id = req.params.id
    console.log(id)

    console.log(req.session.user_detail)

    const owner_id = req.session.user_detail._id

    const producting = await productdb.findOne()

    // console.log("ijanweiugur", producting)

    const USER = await Cartdb.findOne({ user: req.session.user_detail._id });
    const product = await productdb.findOne({ _id: id })
    console.log(product.stock)
    console.log("qjwbraushdyferu")
    console.log(product)
    const cartTotal = product.price;

    if (product.stock <= 0) {
        console.log("no stock availabilty")
        res.json({ notAvailable: true })




    }
    else {
        console.log("stock is there")

        // const cartTotal =product.price;
        console.log(product.price, "---------------------------------------------------------------------------------------------")
        if (!USER) {
            console.log("new user withoout cart")
            const addToCart = await Cartdb({
                user: req.session.user_detail._id,
                items: [{ product: id, Totalprice: product.price }],
                cartTotal: cartTotal

            });
            await addToCart.save().then((resp) => {
                console.log("saved succed=sfully")
                res.redirect("/productDetails/" + id)

            })

        }
        else {
            const ExitProduct = await Cartdb.findOne({
                user: req.session.user_detail._id,
                "items.product": id



            });

            if (ExitProduct != null) {
                // console.log(ExitProduct)
                console.log("same product exist")
                // let productitem = USER.items[ExitProduct]
                // productitem.quantity=items.quantity;
                // USER.items[ExitProduct]=productitem
                //         console.log("qunatity incresed")
                const Product_quantity = await Cartdb.aggregate([ 
                    {
                        $match:{user: mongoose.Types.ObjectId(req.session.user_detail._id)},


                    },{
                        $project:{
                            items:{
                                $filter:{
                                    input:"$items",
                                    cond:{
                                        $eq:['$$this.product',
                                        mongoose.Types.ObjectId(id),
                                    ],
                                    },
                                },

                            },
                        },
                    },

                ])
                console.log(Product_quantity)
                const quantity = Product_quantity[0].items[0].quantity;
                if(product.stock<=quantity){
                    console.log("stock reached to limit")
                    res.json({ stockReached: true });
                }
                else{

                await Cartdb.findOneAndUpdate({
                    user: req.session.user_detail._id,
                    "items.product": id
                },
                    {
                        $inc: {
                            "items.$.quantity": 1,
                            "items.$.Totalprice": product.price,
                            cartTotal: cartTotal


                        },
                    }).then(() => {
                        res.redirect("/productDetails/" + id)
                    })

                 }

            }
            else {
                console.log("new product ")
                const addTOcart = await Cartdb.findOneAndUpdate({
                    user: req.session.user_detail._id
                }, {
                    $push: {
                        items: {
                            product: id, Totalprice: product.price
                        }



                    },
                    $inc: {
                        cartTotal: cartTotal
                        // +product.price
                    }
                });

                addTOcart.save().then((response) => {
                    console.log("differnet prodcut reading....")
                    res.redirect("/productDetails/" + id)
                })

            }

        }

    }
    // res.json({status : true})
}

const quantityChange = async (req, res) => {
    console.log("hiiii--------------------------------------------------------------------123-----------------------------------------------------------------------------")
    console.log(req.query)
    const { cartId, productId, count } = req.query


    const produc = await productdb.findOne({ _id: productId })
    console.log(produc)
    cartTotal = produc.price

    console.log("going to chnge th qunatity")

    if (count == 1) {
        var productprice = produc.price
        console.log(productprice)
    }
    else {
        var productprice = -produc.price
        console.log(productprice)
    }
    const Product_quantity = await Cartdb.aggregate([ 
        {
            $match:{user: mongoose.Types.ObjectId(req.session.user_detail._id)},


        },{
            $project:{
                items:{
                    $filter:{
                        input:"$items",
                        cond:{
                            $eq:['$$this.product',
                            mongoose.Types.ObjectId(productId),
                        ],
                        },
                    },

                },
            },
        },

    ])
    console.log(Product_quantity)
    const quantity = Product_quantity[0].items[0].quantity;
    if(produc.stock<=quantity && count == 1){
        console.log("stock reached to limit")
        res.json({ stockReached: true });
    }


    else{
        await Cartdb.findOneAndUpdate({
            _id: cartId,
            "items.product": productId
        },
            {
                $inc: {
                    "items.$.quantity": count,
                    "items.$.Totalprice": productprice,
                    cartTotal: productprice
    
    
                },
            })



            const data = await Cartdb.findOne({
                _id:cartId,
                "items.product":productId
            })

            console.log(data,"````````````````````````````````````````````````````````````````")
            const index = data.items.findIndex((el)=>{
                el.product == productId
            })
          
            console.log(index,"`````````````````````````~~~~~~!~!!2345657")



            let qty =  Product_quantity[0].items[0].quantity;
            let totalprice =   Product_quantity[0].items[0].Totalprice
            let carttotal = data.cartTotal
            // .then(() => {
            //     console.log(":):):):)")
    
              res.json({qty , totalprice,carttotal});
            //     res.status(200).json({ success: true });
    
    
    
            // })
    }


}

//delete-cart items.
const deletecart = async (req, res) => {
    try {


        console.log(req.query)
       const prodductID = req.query.productid
       const userID = req.session.user_detail._id;
        const product = await productdb.findOne({ _id: prodductID })
        const user = await Cartdb.findOne({ user: userID })
        const index = await user.items.findIndex((index) => {
            return index.product == prodductID
        })


        const price = user.items[index].Totalprice


        const deletecart = await Cartdb.findOneAndUpdate({ user: userID },
            {
                $pull: { items: { product: prodductID } },

                $inc: { cartTotal: -price }


            });

        deletecart.save()
        res.json("deleted");


    }
    catch (error) {
        console.log(error)
    }

}

//get-wishlist
const getwishlist = async (req, res) => {

    try {

        user_id = req.session.user_detail._id;
        const getwish = await Wishlistdb.findOne({ user: user_id })
            .populate('items.product')

        res.render('user/wishlist', { login: req.session.loggedin, getwish, user: req.session.user_detail })

    }
    catch (error) {

        console.log(error)

    }

}


//add-to-wishlist

const addTowishlist = async (req, res) => {

    try {
        console.log(req.body)
        console.log(req.body.prod_id)
        console.log("hi")
        const prodcutid = req.body.prod_id;
        const userid = req.session.user_detail._id;

        const existwish = await Wishlistdb.findOne({ user: userid })

        if (existwish) {
            const existproduct = await Wishlistdb.findOne({
                user: userid,
                "items.product": prodcutid
            });
            console.log("...", existproduct)

            if (!existproduct) {
                await Wishlistdb.findOneAndUpdate({
                    user: userid
                },
                    { $push: { items: { product: prodcutid } } }
                );
                res.json("pushed..")
            }
        }
        else {
            console.log("new whishhhhh")
            const newWish = await Wishlistdb({
                user: userid,
                items: [{ product: prodcutid }]
            });
            newWish.save();
            console.log("saved succefully...")
            res.json("saved new");

        }

    }
    catch (error) {
        console.log("error", error)
    }



}

//wish to add to cart

const wishtoCart = async (req, res) => {

    console.log("adding to cart./////.")
    console.log(req.query)
    const productId = req.query.productId;

    console.log(productId)
    const user_id = req.session.user_detail._id;
    const User = await Cartdb.findOne({ user: user_id })
    console.log(user_id)

 

    const product = await productdb.findOne({_id : productId})


    console.log("...", product)
    const cartTotal = product.price

    if (product.stock < 1) {
        console.log("no stock availabilty")
        res.json({ notAvailable: true })




    }
    else {
        console.log("stock is there")

        if (!User) {
            console.log("new user adding ")
            const addToCart = await Cartdb({
                user: req.session.user_detail._id,
                items: [{ product: productId, Totalprice: product.price }],
                cartTotal: cartTotal

            });
            await addToCart.save().then((resp) => {
                console.log("saved succed=sfully")
                // res.redirect("/productDetails/" + id)

            })

        }
        else {
            console.log("user alredy exists..")

            const existProduct = await Cartdb.findOne({
                user: req.session.user_detail._id,
                "items.product":productId

            });

            if (existProduct != null) {
                console.log("same product exixst")
                await Cartdb.findOneAndUpdate({
                    user: req.session.user_detail._id,
                    "items.product": productId
                },
                    {
                        $inc: {
                            "items.$.quantity": 1,
                            "items.$.Totalprice": product.price,
                            cartTotal: cartTotal


                        },
                    }).then(() => {
                        // res.redirect("/productDetails/" + req.body.wish_id)
                        res.json("added to cart")
                    })

            }
            else {
                console.log("new product..")

                const addTOcart = await Cartdb.findOneAndUpdate({
                    user: req.session.user_detail._id
                }, {
                    $push: {
                        items: {
                            product: productId, Totalprice: product.price
                        }



                    },
                    $inc: {
                        cartTotal: cartTotal
                        // +product.price
                    }
                });

                addTOcart.save().then((response) => {
                    console.log("differnet prodcut reading....")
                    // res.redirect("/productDetails/" + id)
                    res.json("new product added")
                })




            }

        }
    }



}



//remove wishlist

const deletewish = async (req, res) => {

    try {
        console.log(req.body)
        console.log("deleting in progress.")

        const userid = req.session.user_detail._id;

        await Wishlistdb.findOneAndUpdate({ user: userid },
            {
                $pull: { items: { product: req.body.wish_id } }
            });
        res.json("removed")

    }
    catch (error) {
        console.log(error)
    }


}


const checkout = async (req, res) => {
    console.log("hiii")

    // req.session.NewOrder = 

    const id = req.session.user_detail._id
    const address = await Address.findOne({ user: id }).populate('user')
    let user_address;
    if (address) {
        user_address = address.address

    }
    else {
        user_address = []
    }

    const cartItems = await Cartdb.findOne({ user: mongoose.Types.ObjectId(id) })
        .populate('items.product')

        
    res.render('user/checkoutpage', { login: req.session.loggedin, user_address, cartItems })
}



const placeorder = async (req, res) => {


         try{
            
    console.log(req.body)
    console.log("hoooo..............................<><><<<><>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
    const paymode = req.body.paymode;
    const addressIndex = req.body.address;
    const couponAmount = req.body.couponamount;

    console.log(couponAmount);
    console.log(addressIndex, 1);
    const userid = req.session.user_detail._id
    const addresses = await Address.findOne({ user: userid })
    console.log("🚀 ~ file: user.js:843 ~ placeorder ~ addresses", addresses)

    const coupon = await coupondb.find({code:req.body.couponCode})

let Total;
    if(coupon){
        console.log("coupon Exists");
       Total = req.body.subTotal - couponAmount
      
    }
    else{
         Total = req.body.subTotal
    }


    console.log(Total,req.body.subTotal,".,m.m.,m.m.m,,,,",)



    const deliveryAddress = addresses.address[addressIndex]
    console.log(deliveryAddress, 2);


    req.session.deliverAddress = deliveryAddress

    const cartitems = await Cartdb.findOne({ user: userid }).populate("items.product")
    const products = cartitems.items

    console.log("hoooo.....nmbnmnnnmnnmm...........")
    const cartTotal = cartitems.cartTotal

    if (paymode === 'cashOnDelivery') {
        const Order = await Orderdb({
            date: new Date().toLocaleDateString(),
            time: new Date().toLocaleTimeString(),
            user: userid,
            items: products,
            total: Total,
            couponDiscount:couponAmount,
            address: deliveryAddress,
            paymentMethod: paymode,
            paymentStatus: "payment pending",
            orderStatus: "CONFIRMED",


        })
        console.log(Order, 4);
        Order.save().then(async (result) => {

            console.log(result._id, "................................................")
             req.session.order = result._id


            const orderdItems = await Orderdb.findOne({ _id: result._id })

            

            const ordedproducts = orderdItems.items

            console.log(".,,.,.,.,.,..,.",orderdItems)
            ordedproducts.forEach(async(elem)=>{
                let removeStock = await productdb.findOneAndUpdate({_id: elem.product},
                    { $inc:{stock:-elem.quantity} })
            })
            console.log("removed stock accordingly.....")
            const coupon1 = await coupondb.findOne({code:req.body.couponCode})

            console.log(coupon1)



            if (coupon1) {
                console.log("remoning product..,.,.,.,.,",coupon1._id)
                let cartCount = await coupondb.findOneAndUpdate(
                  { _id: coupon1._id },
                  { $inc: { available: -1 } }
                );
                console.log("removed the couon ><><><><><><><")
              }
              console.log("Coupon Removed succesfully.,,,....,.,.......")

            const removeCart = await Cartdb.findOneAndRemove({ user: userid })
            res.json(result)
            console.log("saved succefully..")


        })

    }
    else if(paymode == "Wallet"){
        user = await UserDb.findOne({_id:userid})
        const WalletBalance = user.Wallet

        if(WalletBalance<=0){
            res.send("no balnace in the Wallet")
        }
        else if(WalletBalance < Total){
            res.send("please use other payment method ! no enought money for payment")
        }
        else{
            const Order = await Orderdb({
                date: new Date().toLocaleDateString(),
                time: new Date().toLocaleTimeString(),
                user: userid,
                items: products,
                total: Total,
                couponDiscount:couponAmount,
                address: deliveryAddress,
                paymentMethod: paymode,
                paymentStatus: "payment Completed",
                orderStatus: "CONFIRMED",
    
    
            })
            Order.save().then(async(result)=>
            {
                req.session.order = result._id;
                
            const orderdItems = await Orderdb.findOne({ _id: result._id })

            

            const ordedproducts = orderdItems.items

            console.log(".,,.,.,.,.,..,.",orderdItems)
            ordedproducts.forEach(async(elem)=>{
                let removeStock = await productdb.findOneAndUpdate({_id: elem.product},
                    { $inc:{stock:-elem.quantity} })
            })
            console.log("removed stock accordingly.....")
            //addding to orderwallet
            let orderWallet=await Orderdb.findByIdAndUpdate({_id:result._id },
                {$set:{
                    useWallet:Total
              }});
            //adding to useer wallet
            console.log("```````````````````````````````````````````````````````~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")
              let walletAmount = await UserDb.findOneAndUpdate(
                { _id: userid },
                { $inc: { Wallet:-Total } }
              );
              const coupon1 = await coupondb.findOne({code:req.body.couponCode})

              console.log(coupon1)
              if (coupon1) {
                console.log("remoning product..,.,.,.,.,",coupon1._id)
                let cartCount = await coupondb.findOneAndUpdate(
                  { _id: coupon1._id },
                  { $inc: { available: -1 } }
                );
                console.log("removed the couon ><><><><><><><")
              }
              console.log("Coupon Removed succesfully.,,,....,.,.......")


              // removing from cart
            const removeCart = await Cartdb.findOneAndRemove({ user: userid })
            res.json(result)
            console.log("saved succefully..")


            })
        }
    }
         }  
         catch(err){
            res.send("404",err)
         }


}


const ordersucess = async (req, res) => {

    console.log("hiii")
    const user_id = req.session.user_detail._id

    

    const orderDetail = await Orderdb.findById(req.session.order).populate("items.product")
    console.log(",,,,,,,,,,,,,,,,,,,,,,,,,[popi],,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,")
    console.log(req.session.deliverAddress)

    console.log("`````````````````````````````[pop[]]``````````````````````````````````")
    console.log(orderDetail)

    

    const deliver_Address = req.session.deliverAddress

    res.render('user/ordersucess', { login: req.session.loggedin, orderDetail, deliver_Address })

}


const myOrders = async (req, res) => {

    const user = req.session.user_detail._id
    const Order = await Orderdb.find({ user }).sort({ createdAt: -1 })


    console.log( Order)

    res.render('user/myorders', { login: req.session.loggedin, Order })

}


const returnOrder = async (req,res)=>{
    console.log(req.body)
const Reason = req.body.Reason;
const orderid = req.body.order_id;

let returning = await Orderdb.findByIdAndUpdate({_id:orderid},{
    $set:{orderStatus : "RETURNED",Returnreason:Reason}
})

console.log(returning);

    console.log("hihihihihihihihihihihihihih")

    res.json({status:true})
}


const refund = async (req,res)=>{
    
    try{
        console.log(req.body);
        console.log("hello refund");


    const order_id = req.body.orderId;

    const userOrder = await Orderdb.findOne({_id:order_id}).populate("user")
    console.log(userOrder.user.fname)
    console.log(userOrder.useWallet)
    console.log(userOrder.user.Wallet)

    if(userOrder.user.Wallet == 0) {
        await UserDb.updateOne({_id:userOrder.user},
            {
                $set:{Wallet :userOrder.total}
            })
    }
    else{
        await UserDb.updateOne({_id:userOrder.user},{
           $inc:{Wallet :userOrder.total }
        })
    }
    console.log("setting up")

    const changepaystatus = await Orderdb.findByIdAndUpdate({_id:order_id},{
        $set:{paymentStatus:"REFUNDED"}
    })
    console.log(changepaystatus,"````````````````````````````~~~~~~~~~~~~~~~~~~~~~~`~~~`~~")

    res.json({status:true})
   

   }
    catch(error){
        res.render('user/404error')
    }


}








const forgetpassword = async (req, res) => {
  res.render('user/forgetpass',{login: req.session.loggedin})


}

const forgetpass_validate = async (req, res) => {

    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log(err)
            return res.redirect('/forgetpass')
        }

        const token = buffer.toString("hex");
        UserDb.findOne({ email: req.body.email })
            .then((user) => {

                console.log(user, "...................................................................")
                if (!user) {
                    return res.redirect('/forgetpassword')
                }
                user.resetToken = token;
                user.resetTokenExpiration = Date.now() + 3600000;
                return user.save();

            })
            .then((result) => {
                console.log("```````````````123````````````", result);
                res.redirect("/");
                var emails ={
                    to:[result.email],
                    from:"muhammedirfad43@gmail.com",
                    subject:"password reseted",

                    html: `
                <p>You Requested a Password reset </p>
                <p>Click this <a href="http://localhost:3000/reset/${token}">link</a>to set your Password </p>
                `,
                };

                console.log("working till here../././/")

                mailer.sendMail(emails, function (err, res) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        console.log(res.response + "email sended");
                    }
                });
            }).catch((err) => {
                console.log(err);
            });

    })

}

const resetPassowrd = (req,res)=>{
    try{
        const token = req.params.token;

        console.log( req.params.token)
        UserDb.findOne({resetToken:token,resetTokenExpiration:{$gt:Date.now()}}).then(users=>{
          console.log(";lkjhgfffffffffff",users)
          
            res.render('user/reset',{userid:users._id})
        })
   
    }
    catch(error){
        res.render('user/404error')
    }
}


const newpassword =async (req,res)=>{
    let updatedUser;

    console.log("sqwdfgggggggggggggggggggggggggggggggggggg")
    const newpassword = req.body.password;
    // const repassword     = req.body.repassword
    const userId = req.body.userid;
    console.log(req.body)
    console.log(userId,"lkjhhhhhhhhhhh")
     UserDb.findOne({_id:userId}).then(users=>{
       updatedUser = users
      return bcrypt.hash(newpassword,12)
     }).then(hashedpassword=>{
       updatedUser.password = hashedpassword
    //    updatedUser.repassword = hashedpassword
       updatedUser.resetToken=undefined
       updatedUser.resetTokenExpiration = undefined
       return updatedUser.save()
     }).then(result=>{
       res.redirect('/login')
     })
}

const orderdetails = async (req, res) => {

    console.log(req.params.id)
    const orderDetail = await Orderdb.findOne({ _id: req.params.id }).populate('items.product')
    console.log(orderDetail)    
    res.render('user/orderdetails', { login: req.session.loggedin, orderDetail })
}

const cancelorder = async (req, res) => {
    console.log(req.params.id)

    const order = await Orderdb.findByIdAndUpdate({ _id: req.params.id },
        {
            $set: { orderStatus: 'CANCELLED' }
        })



    res.redirect('/myOrders')

}

//verifying coupon 
const verifycoupon = async (req,res)=>{
    console.log("helooooooooooooooooooooooooooooo")
    console.log(req.body)

    const couponCode = req.body.couponCode;
    const Total = req.body.total;
    let grandtotal;
    let couponMsg;
    const date =new Date()
    const nowdate = date.toLocaleDateString()
    console.log(date);
    console.log(nowdate,".,.,.,.<><><><><>")
    const coupon = await coupondb.find({
        code:couponCode,
        status:"ACTIVE"
    })

    console.log(coupon)
    if(coupon.length == 0 ){
        console.log("invalid coupon")
        couponMsg="invalid Coupon";
        res.json({status:false ,couponMsg})
    }

    else{
        console.log("coupon available...")

        const expireDate = coupon[0].expireDate.toLocaleDateString()
        console.log(expireDate)
        const amount    = coupon[0].amount
        const available = coupon[0].available
        const minAmount = coupon[0].minCartAmount
        const maxAmount = coupon[0].maxRedeemAmount
       const percentage = coupon[0].percentage

        console.log(available,minAmount,maxAmount,percentage)


        if(available !=0){
            if(nowdate>expireDate){
                console.log("hiiii.....")
                if(percentage == false){
                    if (Total < minAmount) {
                        console.log("NO coupon available for this PURSCHASE..")
                        couponMsg =
                          " You Need Minimum of $" + minAmount + " need to Apply this Coupon";
                        res.json({ status: false, couponMsg });
                }
                else{
                    grandtotal = Math.round(Total-amount)
                    console.log("<><><><><><><><>",grandtotal)

                    let response = {
                        status:true,
                        grandtotal:grandtotal,
                        couponMsg,
                        Amount:amount
                    }
                    res.json(response)
                }
                
            }else{
                console.log(" it is in percentage...")
                if(Total<minAmount){
                    console.log("coupon not availacble...")
                    couponMsg =
                    " You Need Minimum of $." + minAmount + " need to Apply this Coupon";
                    res.json({ status: false, couponMsg });

                }
                else{
                    PercentageAmount = Math.round((Total * amount)/100)

                    if(PercentageAmount > maxAmount ){
                        grandtotal = Math.round(Total- maxAmount)
                        console.log("percentage high...",grandtotal)
                        let response = {
                            status:true,
                            grandtotal:grandtotal,
                            couponMsg,
                            Amount :maxAmount
                        }
                        res.json(response)
                    }
                    else{
                        grandtotal = Math.round(Total - PercentageAmount)
                        console.log("correct ammount discounted .. " ,grandtotal)
                        let response = {
                            status:true,
                            grandtotal:grandtotal,
                            couponMsg,
                            Amount :PercentageAmount
                        }
                        res.json(response)

                    }

                    }
                }
            }
            else{
                console.log("coupon expires...")
                couponMsg = "coupon Expired..";
                res.json({status:false , couponMsg})
          }
         
        }
      
      else{
        console.log("coupon limit exceeded")
        couponMsg ="coupon limit exceeded";
        res.json({status:false,couponMsg})
    }
      

    }
  

}
 
























module.exports = {
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

    ordersucess


}