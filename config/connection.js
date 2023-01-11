const mongoose = require('mongoose')
const dotenv   = require('dotenv')
mongoose.set("strictQuery", false);



dotenv.config({path:'./.env'})
DB=process.env.DATABASE_LOCAL
console.log("started"+DB)


const mongoosedb= mongoose.connect(DB,{
    useNewUrlParser:true,
    useUnifiedTopology:true
});

mongoose.set('strictQuery', false);

module.exports = mongoosedb