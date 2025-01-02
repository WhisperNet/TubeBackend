import 'dotenv/config';
import connectDB from "./db/index.js";
import app from './app.js';

connectDB()
    .then(() => {
        app.listen(process.env.PORT || 8000, () => {
            console.log(`🖥️  Server is running on port ${process.env.PORT}\n`);
        })
    })
    .catch((error) => {
        console.error(`Server Error: ${error.message}`)
    })