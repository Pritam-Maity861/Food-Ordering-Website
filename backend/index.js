import app from "./app.js";
import connectDB from "./config/db.config.js";

const PORT = process.env.PORT || 3000;


//database connection...
connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`server running on port no : ${PORT}`)
        })
    })
    .catch((err) => {
        console.log("Error regarding server connection:", err)
    })
