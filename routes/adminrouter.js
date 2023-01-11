const express = require('express')
const  {categoryupload} = require('../middleware/multer')
const  {session} = require('../middleware/adminSession')

const {
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
}=require('../controller/admin')
const router =express.Router();


router
      .route('/')
      .get(adminlogin)
      .post(getadminhome)

router.get('/adminhome',session,dash)

router.get('/clientview',session,getclientDetails)
router.get('/block/:id' , session,blockuser)
router.get('/unblock/:id' ,unblockuser)
router.get('/404error',error)
router.get('/category',session,category)

router.get('/category-list',session,categorylist)
router.get('/edit-category/:id',get_editcategory)
router.get('/deletecategory/:id',deletecategory)



router.get('/add-product',session,add_products)
router.get('/product-list',session,get_productlist)
router.get('/edit-product/:id',session,get_editproduct)
router.get('/delete-product/:id',session,delete_product)

router.get("/orderList",session,orderList)

router.get('/orderDetails/:id',session,OrderDetails)


router.get('/bannerManage',session,getBanner)
router.get('/delete-banner/:id',session,delete_banner)

router.get('/addBanner',session,addBanner)
router.post('/bannerManage',session,categoryupload,addedBanner)






router.post('/add-category',session,categoryupload,addcategory)
router.post('/categoryedited/:id',session,categoryupload,edit_category)
router.post('/upload-product',session,categoryupload, upload_products)
router.post('/upload-editproduct/:id',session,categoryupload,upload_editproduct)

router.post('/orderstatus',session,orderstatus)



router.get('/getCoupon',session,getcoupon)
router.get('/addcoupon',session,addcoupon)
router.post('/addedcoupon',session,addedcoupon)

router.get('/couponActive',session,couponActive)
router.get('/couponBlock',session,couponBlock)

router.get('/salesReport',session,salesreport)
router.get('/monthreport',session,monthreport)
router.get('/yearreport',session,yearreport)

router.get('/Logout',logout)










module.exports=router