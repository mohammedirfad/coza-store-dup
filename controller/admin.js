const Login = require('../models/usersignin')
const Addcategory = require('../models/category_schema')
const categoryupload = require('../middleware/multer')
const Addproduct = require('../models/product_schema')
const Bannerdb = require('../models/banner_schema')
const userdb = require("../models/usersignin")

const orderdb = require('../models/order_schema')
const coupondb = require('../models/coupon_schema')


const adminlogin = (req, res) => {

    try {
        if (req.session.adminLogedIn) {
         
        res.redirect('/admin/add-product')
        } else {
          res.render("admin/adminlogin");
          // req.session.adminLoggErr = false;
        }
      } catch (error) {
        res.render("admin/404");
      }
    // res.render('admin/adminlogin')
}

const dash = async (req, res) => {

    // const report = await orderdb.aggregate([{ $match: { orderStatus: { $eq: 'DELIVERED' } } },
    //         {
    //             $group:{
    //                 month: { $month: "$createdAt" },
    //                 day: { $dayOfMonth: "$createdAt" },
    //                 year: { $year: "$createdAt" },
    //              },
    //               totalPrice: { $sum: "$total" }
                
    //         }]);
    const report = await orderdb.aggregate([
        {
          $match: { orderStatus: { $eq: "DELIVERED" } },
        },
       
        {$group: { _id : {
            year:{$year:"$createdAt"},
            month:{$month:"$createdAt"},
            day:{$dayOfMonth:"$createdAt"}
            },
            totalPrice: { $sum: "$total" },
            items: { $sum: { $size: "$items" } },
            count: { $sum: 1 },
          }
        
          }
        
      ]);

      const order = await orderdb.find().count()
      const User  = await userdb.find().count()
      const Total = await orderdb.aggregate([{
        $group:{_id:order._id,
                total:{$sum:'$total'}
               },
      },
      
      {$project:{_id:0}}
    ]);

    const Totalprofit = Total[0].total


    const pending = await orderdb.aggregate([{
        $match:{paymentStatus:"payment pending"}
    },{
        $count:"Count"
    }
])

console.log(pending)

let Paymentpending ;
if(pending.length !=0){
    Paymentpending=pending[0].Count
}
else{
    Paymentpending=0
}

console.log(Paymentpending)




      console.log(Totalprofit)

    console.log(report ,"hbhbh.,lklk,,,,,,,,,kjnb");

    res.render('admin/admindash',{report,order,User,Totalprofit,Paymentpending})
}






const getadminhome = async (req, res) => {


    const Adminemail = process.env.ADMIN_EMAIL
    const adminpassword = process.env.ADMIN_PASSWORD

    console.log(req.body)

    const { email, password } = req.body


    if (Adminemail == email && adminpassword == password) {
        console.log("120")
        req.session.adminLogedIn = true;

       





        res.redirect('/admin/adminhome')
    }
    else {
        console.log("12poko0")
        res.redirect("/admin")
    }


}
const admindashboard = (req, res) => {
    res.render('admin/admindash')
}


const error = (req, res) => {
    res.render('admin/404')
}

const category = (req, res) => {

    res.render('admin/add-category')
}


const categorylist = async (req, res) => {

    console.log("finding clients..")
    let get_categorylist = await Addcategory.find()

    console.log(get_categorylist)
    // res.send("list is here")
    res.render('admin/category-list', { get_categorylist })

}


const getclientDetails = async (req, res) => {
    let clientdetails = await Login.find()
    console.log(clientdetails)
    res.render('admin/clientview', { clientdetails })
}

const blockuser = async (req, res) => {
    const userid = req.params.id;
    let data = await Login.findByIdAndUpdate(userid, { block: false });
    if (data) {
        res.redirect('/admin/clientview')
    }
    else {
        res.send(" somethiing went wrong")
    }
}
const unblockuser = async (req, res) => {
    const userid = req.params.id;
    let data = await Login.findByIdAndUpdate(userid, { block: true });
    if (data) {
        res.redirect('/admin/clientview')
    }
    else {
        res.send(" somethiing went wrong")
    }
}



const addcategory = async (req, res) => {

    console.log(req.body)
    console.log(req.files)
    // console.log(req.files[0].filename)

    const imgurl = req.files;
    const catInfo = req.body




    Object.assign(catInfo, { image: imgurl })
    await Addcategory.create(catInfo)
    res.redirect('/admin/category')









}
const get_editcategory = async (req, res) => {

    const IDs = req.params.id
    console.log(IDs)
    let edit_cat = await Addcategory.find({ _id: IDs })
    console.log("finding for editing....", edit_cat)

    res.render('admin/category-edit', { edit_cat })
}

const edit_category = async (req, res) => {


    console.log("updateing the clients......")
    const update_id = req.params.id

    console.log(update_id)
    console.log("irfad .......", req.body)
    console.log("mohammed ", req.files)

    const cat_info = req.body.name
    const img = req.files


    Object.assign(req.body, { name: cat_info, image: img })
    const edited = await Addcategory.findByIdAndUpdate(update_id, { $set: req.body }, {

        upsert: true,
        new: true,
        runValidators: true
    })


    res.redirect('/admin/category-list')

}



const deletecategory = async (req, res) => {
    console.log("del")
    let ID = req.params.id

    let del_cat = await Addcategory.findOne({ _id: ID }).remove()

    console.log(del_cat)
    res.redirect('/admin/category-list')

}



const add_products = async (req, res) => {
    console.log("finfing cat----ehroitye5nf-")
    try {



        let Category = await Addcategory.find();


        console.log(Category)


        res.render('admin/add_product', { Category })


    }
    catch {
        console.log("error")
        res.render('admin/404error')
    }


}

//get product-list:
const get_productlist = async (req, res) => {
    const pro_details = await Addproduct.find();

    res.render('admin/product_list', { pro_details })
}


//post add-category:
const upload_products = async (req, res) => {
    console.log(req.body)
    console.log(req.files)

    const pro_info = req.body
    const img = req.files

    Object.assign(pro_info, { image: img })
    await Addproduct.create(pro_info)

    res.redirect('/admin/add-product')

}

const get_editproduct = async (req, res) => {

    let ids = req.params.id

    const prod_details = await Addproduct.find({ _id: ids });
    let cat_detail = await Addcategory.find()
    console.log(ids)

    console.log(prod_details)
    console.log(cat_detail);
    res.render('admin/edit_product', { prod_details, cat_detail })
}

const upload_editproduct = async (req, res) => {


    console.log("upload images")
    try {
        let IDS = req.params.id
        const data = req.body
        const img = req.files
        console.log(img);
        if (img == 0) {
            Object.assign(data)
            await Addproduct.findByIdAndUpdate(IDS, { $set: data });

            console.log(img);
            //  res.redirect('/admin/edit-product/'+ IDS)
            res.redirect('/admin/product-list')
        }
        else {
            console.log("upadteing products..")
            Object.assign(data, { image: img })
            await Addproduct.findByIdAndUpdate(IDS, { $set: data });
            res.redirect('/admin/product-list')
        } 1


    }
    catch (err) {
        console.log(err)
        res.redirect('/admin/404error')
    }


};

const delete_product = async (req, res) => {
    del_id = req.params.id;

    let delete_product = await Addproduct.findOne({ _id: del_id }).remove()
    res.redirect('/admin/product-list')



}

const orderList = async (req, res) => {


    const Order = await orderdb.find({}).sort({ createdAt: -1 }).populate('user').populate('address')
    console.log(".,,,,,,,,,,,,,,,,,,,````````````,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,", Order)
    res.render('admin/orderlist', { login: req.session.loggedin, Order })


}

const OrderDetails = async (req, res) => {

    console.log(req.params.id)

    const orderDetail = await orderdb.findOne({ _id: req.params.id }).populate('items.product')

    res.render('admin/orderdetails', { orderDetail })

}

const getBanner = async (req, res) => {

    const Banner_details = await Bannerdb.find();



    res.render('admin/bannerMange', { Banner_details })
}
const addBanner = async (req, res) => {
    let Category = await Addcategory.find();


    console.log(Category)



    res.render('admin/add-banner', { Category })

}
const addedBanner = async (req, res) => {



    console.log(req.body)
    console.log(req.files)

    const Banner_info = req.body;
    const img = req.files


    Object.assign(Banner_info, { image: img })
    await Bannerdb.create(Banner_info)


    console.log("savved succesfully")


    res.redirect('/admin/bannerManage')
}

const delete_banner = async (req, res) => {
    console.log(req.params.id)
    let banner_del = await Bannerdb.findOne({ _id: req.params.id }).remove()


    res.redirect('/admin/bannerManage')

}


const getcoupon = async (req, res) => {

    try {
        const coupon = await coupondb.find().sort({ createdAt: -1 })
        res.render('admin/getcoupon', { coupon })


    }
    catch {
        res.redirect('/admin/404')
    }
    // res.render('admin/getcoupon')
}

const addcoupon = async (req, res) => {
    res.render('admin/couponform')
}

const addedcoupon = async (req, res) => {

    try {

        const { code, percentage, amount, minCartAmount, expireDate, available, maxRedeemAmount } = req.body

        if (code && percentage && amount && expireDate && available && minCartAmount && maxRedeemAmount) {

            let regexp = new RegExp(code, "i")

            const coupen = await coupondb.findOne({ code: { $regex: regexp } })
            if (coupen) {
                res.redirect('/addCoupen')

            } else {
                console.log("dweedsdsdssdsssssssss");
                const coupen = { code, percentage, amount, expireDate, available, minCartAmount, maxRedeemAmount }
                await coupondb.create(coupen)
                    .catch((err) => {
                        console.log(err);
                    })

                res.redirect('/admin/getcoupon')
            }
        } else {
            console.log('fill full column')
            res.redirect('/addCoupen')
        }
        console.log(code + "  " + minCartAmount);


    } catch {
        res.redirect('/admin/404')

    }

}


// active coupon

const couponActive = async (req, res) => {
    try {
        console.log(req.query, "...........................")
        coupenId = req.query.id;
        await coupondb.updateOne(
            { _id: coupenId },
            { $set: { status: "ACTIVE" } }
        ).then((result) => {
            res.redirect("/admin/getcoupon");
        });
    } catch (error) {
        res.render("admin/404");
    }
};

// block coupon

const couponBlock = async (req, res) => {
    try {
        coupenId = req.query.id;
        await coupondb.updateOne(
            { _id: coupenId },
            { $set: { status: "BLOCK" } }
        ).then((result) => {
            res.redirect("/admin/getcoupon");
        });
    } catch (error) {
        res.render("admin/404");
    }
};

const orderstatus = async (req, res) => {

    try {

        console.log("<>>>>>>>>>><><<>>>>>>>>")
        const orderId = req.body.orderid;
        const value = req.body.value;
        if (value == "DELIVERED") {
            await orderdb.updateOne({ _id: orderId }, {
                $set: {
                    orderStatus: value,
                    paymentStatus: 'Payment Completed'

                }
            }).then((response) => {
                res.json({ status: true })
            });
        }
        else {
            await orderdb.updateOne(
                {
                    _id: orderId,
                },
                {
                    $set: {

                        orderStatus: value,

                    },
                }
            ).then((response) => {
                res.json({ status: true });
            });
        }

    }
    catch (error) {
        res.render('admin/404')

    }

}

const salesreport = async (req,res)=>{

    try{
        console.log("hoiii")
        const report = await orderdb.aggregate([
            {
              $match: { orderStatus: { $eq: "DELIVERED" } },
            },
           
            {$group: { _id : {
                year:{$year:"$createdAt"},
                month:{$month:"$createdAt"},
                day:{$dayOfMonth:"$createdAt"}
                },
                totalPrice: { $sum: "$total" },
                items: { $sum: { $size: "$items" } },
                count: { $sum: 1 },
              }
            
              },
              { $sort: { date: -1 } },
            
          ]);
        res.render('admin/salesreport',{report}) 
    }
    catch (error) {
        res.render('admin/404')

    }

}
const monthreport = async (req,res)=>{
      try{
        const months = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
          ];
        console.log('monthrepor12546879t...')

       
          const Monthreport = await orderdb.aggregate([
            {
              $match: { orderStatus: { $eq: "DELIVERED" } },
            },
           
            {$group: { _id : {
         
                month:{$month:"$createdAt"}},

                totalPrice: { $sum: "$total" },
                items: { $sum: { $size: "$items" } },
                count: { $sum: 1 },
              }
            
              },
              { $sort: { date: -1 } },
            
          ]);
          console.log(Monthreport,"oijuhygtrffffffffffgyhujmikmnbhgtvfrcedxws4edrcftvbyu")

         const MReport = Monthreport.map((el)=>{
            let newEl=[...el];
            newEl._id.month = months[newEl._id.month - 1];
            return newEl;

         });

        //  console.log(MReport,"````````````````````````````````````````````````````````````````'''")
        res.render('admin/Monthreport',{Monthreport})


      }
      catch (error) {
        res.render('admin/404')

    }
}

const yearreport = async (req,res)=>{

    try{
        console.log('YEAR REPORT .. report...')
        const Yearreport = await orderdb.aggregate([
            {
              $match: { orderStatus: { $eq: "DELIVERED" } },
            },
           
            {$group: { _id : {
                year:{$year:"$createdAt"},
              
                },
                totalPrice: { $sum: "$total" },
                items: { $sum: { $size: "$items" } },
                count: { $sum: 1 },
              }
            
              },
              { $sort: { date: -1 } },
            
          ]);
        res.render('admin/Yearreport',{Yearreport})
    }
    catch (error) {
        res.render('admin/404')

    }

  
}

const logout = (req,res)=>{
    req.session.destroy()
    res.redirect('/admin')
}


module.exports = {
    adminlogin,
    getadminhome,
    getclientDetails,
    category,
    error,

    blockuser,
    unblockuser,
    categorylist,
    dash,
    addcategory,
    get_editcategory,
    edit_category,
    deletecategory,
    add_products,
    get_productlist,
    upload_products,
    get_editproduct,
    upload_editproduct,
    delete_product,
    orderList,
    OrderDetails,
    getBanner,
    addBanner,
    addedBanner,
    delete_banner,
    getcoupon,
    addcoupon,
    addedcoupon,
    couponActive,
    couponBlock,
    orderstatus,
    salesreport,
    monthreport,
    yearreport,
    logout



}