const app=require('./app')
const mongoose = require('./config/connection')


mongoose
    .then(() => {
        console.log("data base connected..")
    })
    .catch((err) => {
        console.log("err in db" + err)
    })

const PORT = process.env.PORT || 3000


app.listen(PORT, (error) => {
    if (error) {
        console.log("error occured " + error)
    }
    else {
        console.log(`server running strated at ${PORT}`)
    }
})