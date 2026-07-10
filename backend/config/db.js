const mongoose = require("mongoose");

const connectDB = async () => {
    try{
        const db = await mongoose.connect(process.env.MONGO_URL);

        console.log(`MongoDB Connected Successfully`);

    }catch(err){
        console.log(err);
        process.exit(1);
    }
}

module.exports = connectDB;
