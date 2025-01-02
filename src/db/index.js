import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
const connectDB = async () => {
    try {
        const dbConnection = await mongoose.connect(`${process.env.MONGO_URI_LOCAL}/${DB_NAME}`)
        console.log(`🗄️  MongoDB Connected: ${dbConnection.connection.host}\n`)
    } catch (error) {
        console.error(`Database Connection Error: ${error.message}`)
        process.exit(1)
    }
}
export default connectDB