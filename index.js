const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const authRoute = require("./routes/authRoute");
const userRoute = require("./routes/userRoute");
const postRoute = require("./routes/postRoute");
const uploadRoute = require("./routes/uploadRoute")
const cors = require("cors");
const path = require("path");
const { searchUser } = require("./Controllers/UserController");

dotenv.config(); // to use .env

mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true, useUnifiedTopology: true},()=>{
    console.log("Database connected");
})

//to get the images and videos from public folder
// app.use(express.static('public'));
// app.use('/images', express.static("images"));
// app.use('/videos', express.static("videos"));

//middleware function
app.use(bodyParser.json({ limit:"30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit:"30mb", extended: true }));
app.use(express.json());// body parser that parses the incoming request to json
// app.use(helmet());
// app.use(morgan("common"));
app.use(cors());
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  });


//routes
// app.use("/", async(req, res)=>{res.send("Hello user")});

app.use("/auth", authRoute);
app.use("/user", userRoute);
app.use("/post", postRoute);

/* for uploading images and videos to local storage*/
app.use("/upload", uploadRoute);

//for hosting
app.use(express.static(path.join(__dirname, "/client/build")));

app.get("*", (req, res)=>{
    res.sendFile(path.join(__dirname, "/client/build", "index.html"));
});

app.listen(process.env.PORT, ()=>{
    console.log("Listening");
})