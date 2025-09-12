const express=require("express");
const cors=require("cors");
const dotenv=require("dotenv");
const mongoose=require("mongoose");
const app=express();
const authRoutes=require("./routes/auth");
const bookRoutes=require("./routes/book");

app.use(express.json());
app.use(cors());
dotenv.config();

const PORT=process.env.PORT || 5000;


app.use('/api/auth', authRoutes);
app.use('/api/book', bookRoutes);




mongoose
.connect(process.env.MONGO_URI,{})
.then(()=>console.log(`Mongodb running`))
.catch((err)=>console.log(`The error is ${err}`))

app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`)
})