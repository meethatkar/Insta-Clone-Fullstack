const mongoose = require("mongoose");

async function connectToDB(){
    try {
        await mongoose.connect(process.env.MONGOOSE_URI)
        console.log("Database connected");
    } catch (error) {
        console.log("Error occured", error);
    }
}

module.exports = connectToDB;