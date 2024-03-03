const express=require("express");
const path=require('path');
const cookieParser=require("cookie-parser");
const { connectToMongoDB } = require("./connect");
const {restrictToLoggedinUserOnly,checkAuth}=require("./middlewares/auth");
const URL =require('./models/url');
const urlRoute= require('./routes/url');
const staticRouter = require('./routes/staticRouter');
const {request} =require("http");
const userRouter=require('./routes/user');




const app=express();
app.set("view engine","ejs");  //we tell our appication that which engine we are going to use
app.set("views",path.resolve("./views")); //we mention path where all ejs files 


const PORT=8001;
connectToMongoDB("mongodb://0.0.0.0:27017/short-url")
.then(()=> console.log('Mongodb connected'));

app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.get("/test",async(req,res) =>{
    const allUrls=await URL.find({});
    return res.render("home",{
        urls:allUrls,
    });
});

app.use("/url",restrictToLoggedinUserOnly,urlRoute);
app.use("/user",userRouter);
app.use("/",checkAuth,staticRouter);


app.get('/url/:shortId',async(req,res) =>{
    const shortId=req.params.shortId;
    const entry =await URL.findOneAndUpdate({
        shortId,
    },{
        $push:{
        visitHistory:{
            timestamp:Date.now(), 
        },
    },
}
);
res.redirect(entry.redirectURL);


});

app.listen(PORT,()=>{
    console.log("server is started at 8001");
})
