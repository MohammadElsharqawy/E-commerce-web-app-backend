const mongoose = require("mongoose")

const dbConnection = ()=>{
mongoose
.connect(process.env.DB_URI)
.then((conn)=>{
    console.log(`DB connected successfully to host: ${conn.connection.host}`);
})
// .catch((err)=>{
//     console.log("failed...", err)
//     process.exit(1);
// })
};

module.exports = dbConnection;