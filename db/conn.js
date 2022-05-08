const { default: mongoose } = require("mongoose");
require('dotenv').config();
    

mongoose.connect(process.env.uri
    // "mongodb://localhost:27017/Users"
, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useCreateIndex: true
}).then(() => {
    console.log(`db connection succesfull`);
}).catch((e) => {
    console.log("no connection");
})