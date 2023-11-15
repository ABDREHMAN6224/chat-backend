import mongoose from "mongoose";
const connection = () => {
    try {
        mongoose.connect(process.env.MONGO_URI);
        console.log("connected database");
    } catch (error) {
        console.log("failed to connect");
    }
}
export default connection