require("dotenv").config()

const config={
    appPort:process.env.PORT,
    dbUri:process.env.MONGODB_URI,
}

module.exports=config