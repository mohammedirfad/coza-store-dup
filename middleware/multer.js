const multer = require("multer");
const path = require("path");


// module.exports = multer({
//   storage: multer.diskStorage({
//     destination:(req,file,cb)=>{
//         cb(null,'public/admin/img')
//     }
//   }),
//   fileFilter: (req, file, cb) => {
//     let ext = path.extname(file.originalname);  
//     if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
//       cb(new Error("File type is not supported"), false);
//       return;
//     }
//     cb(null, true);
//   },
// //   filename: function (req, file, cb) {
// //     cb(null,  "IMG-" + Date.now() + path.extname(file.originalname));
// //     cb(null,'IMG-'+Date.now() + " " +file.originalname)
// //   }
// filename:(req,file,cb)=>{
//     const ext =file.mimetype.split("/")[1];
//     cb(null, `img-${file.fieldname}-${Date.now()}.${ext}`);
// },
  
// });
const categorystorage = multer.diskStorage({
    destination:(req,res,cb)=>{
        cb(null,'public/admin/img')
    },
    
    filename:(req,file,cb)=>{
        // cb(null,'category-'+Date.now() + path.extname(file.originalname))
        cb(null,'category-'+Date.now() + " " +file.originalname)
    }
})

const categoryimageupload = multer({
    storage:categorystorage
})

const categoryupload = categoryimageupload.array('image',3)

module.exports = {categoryupload}












































// const multerStorage = multer.diskStorage({
//     destination: (req, file, cb) => {
//       cb(null, "public/images");
//     },
//     filename: (req, file, cb) => {
//       const ext = file.mimetype.split("/")[1];
//       cb(null, `img-${file.fieldname}-${Date.now()}.${ext}`);
//     },
//   });
//   const upload = multer({
//     storage: multerStorage,
//     // fileFilter: multerFilter,
//   });
//   module.exports=upload