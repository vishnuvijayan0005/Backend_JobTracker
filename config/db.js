import mongoose from "mongoose";


const dbConnect =async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI,{
            dbName: "JOBTRACKER" 
        })
        console.log("DB CONNECTED SUCCESSFULLY");
        
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}
export default dbConnect