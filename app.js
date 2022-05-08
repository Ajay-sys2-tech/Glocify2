const express = require("express");
const session = require("express-session");
const app = express();
const path = require("path");
const hbs = require("hbs");
const cookieParser = require("cookie-parser");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");

require('dotenv').config()


const dbConnection = require("./db/conn");

const user = require("./models/user");
const auth = require("./middlewares/auth");



const port = process.env.PORT || 3000;

const static_path = path.join(__dirname, "/public");
const partials_path = path.join(__dirname, "/views/partials");


app.use(express.static(static_path));
app.set("view engine", "hbs");
// app.set("views", views_path);
hbs.registerPartials(partials_path);


app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false}));
// app.use(session({
//     secret:'mysupersecret',
//     resave: false,
//     saveUninitialized: false,
//     store: new MongoStore({mongooseConnection: dbConnection.connection}),
//     cookie: {maxAge: 180 * 60 * 1000}
// }));


app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.uri }),
    cookie: {maxAge: 120 * 60 * 1000}
  }));

  app.use(flash());
  
app.use((req, res, next) => {
    res.locals.session = req.session;
    next();
});



app.get("/", (req, res) =>{
    res.render("index");
} );

const userRoutes = require("./routes/user");
app.use("/user", userRoutes);

const shopRoutes = require("./routes/shops");
app.use("/shops", shopRoutes);

const cartRoutes = require("./routes/cart");
app.use("/cart", cartRoutes);

const paymentRoutes = require("./routes/payment");
app.use("/payment", paymentRoutes);

app.get("*", (req, res) =>  {
    res.render("error");
})




app.listen(port, () => console.log(`App listening on port ${port}!`))