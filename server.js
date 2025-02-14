import app from './app.js'
import * as dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGOURL);
        console.log("Server Connected to database");
    } catch (e) {
        console.log(e);
    }
}

// start the server
app.listen(process.env.PORT, () => {
    connectDb();
    console.log(`server started `);
})
