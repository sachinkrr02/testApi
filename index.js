const express = require("express");
const fs = require("fs");
const mongoose = require("mongoose");


// const users = require('./MOCK_DATA.json');


const app = express();
const PORT = 2002;

//mongoose connection

mongoose.connect("mongodb://127.0.0.1:27017/property").then(() => console.log("MongoDB Connected")).catch((err) => console.log("Mongo Error" ,err));

//schema 
const userSchema = new mongoose.Schema({
    first_name:{
        type:String,
        required:true,
    },
    last_name:{
        type:String,
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    gender:{
        type: String
    },
    job_title:{
        type: String
    }
}
);

// create model
const User = mongoose.model("user" ,userSchema);

//middleware 
app.use(express.urlencoded({extended :false}));

// Routes
app.get("/users" ,(req ,res)=> {
    const html = `
    <ul>
    ${users.map((user) => `<li> ${user.first_name} </li>`).join("")}
    </ul>
    `;
    res.send(html);
}) //to display the json file in html format


//Rest api points
app.get("/" , async(req ,res) =>{
    const allusers = await User.find({});
    return res.json(allusers);
}) // get users api 


app.get("/api/users/:id" , async (req,res)=> {

    const user = await User.findById(req.params.id);
    if(!user) return res.status(404).json({error:"user not found"});
    // const id = Number(req.params.id);
    // const user = users.find((user) => user.id == id);
    return res.json(user);
}) // api to get a particular user

app.post("/api/users" , async (req ,res) =>{
const body = req.body;
if(!body || !body.first_name || !body.last_name || !body.email || !body.gender || !body.job_title ){
    return res.status(400).json({msg : "All field are required..."})
}

// add user in mongodb
const result = await User.create({
first_name: body.first_name,
last_name:  body.last_name,
email:body.email,
gender:body.gender,
job_title: body.job_title,
});
console.log("result" , result);
return res.status(201).json({msg: "success"});


// add user directly to json file
// users.push({ ...body ,id:users.length +1});
// fs.writeFile("./MOCK_DATA.json" ,JSON.stringify(users) ,(err ,data) => {
//     return res.json({status : "success"  ,id:users.length +1});
// });
// console.log("Body" ,body);

}) ;// create a user 

app.patch("/api/users/:id" ,(req ,res) =>{
    return res.json({status : "pending"});
}) // edit an user details with id

app.delete("/api/users/:id" ,(req ,res) =>{
    return res.json({status : "pending"});
}) //delete the user with id 

app.listen(PORT , ()=> console.log(`Server started at port ${PORT}`));
