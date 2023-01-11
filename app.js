const express = require('express')
const path    = require('path');
const { mainModule } = require('process');
const logger = require('morgan');
const mongoose = require('mongoose');
const session=require('express-session')



const app= express()

const adminrouter = require('./routes/adminrouter')
const userrouter  = require('./routes/userrouter')


app.use(express.static(path.resolve('./public')));

app.set('views' ,path.join(__dirname , 'views'));
app.set('view engine','ejs');
app.use(session({
    secret:"secretkey",
    resave:false,
    saveUninitialized:true,
    cookie: {maxAge:60000000}
  
  
  }))


app.use(logger('dev')); // used to avoid the datils coming in the terminal such as GET post etc.. when we do an action .... 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/admin',adminrouter)
app.use('/',userrouter)


module.exports =app