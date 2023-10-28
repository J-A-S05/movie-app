import express from 'express';
import cors from "cors";
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

const app = express();

app.use(cors());
app.use(bodyParser.json());

mongoose.connect("mongodb+srv://EddieBoi:teGeua3OCu9Tlrmu@cluster0.u9u7zfs.mongodb.net/?retryWrites=true&w=majority/movieDB").then(()=>{
    console.log("connected to db")
})

const movieSchema = new mongoose.Schema({
    
    adult: Boolean,
    backdrop_path: String,
    genre_ids: Array,
    id: Number,
    original_language: String,
    original_title: String,
    overview: String,
    popularity: Number,
    poster_path: String,
    release_date: String,
    title: String,
    video: Boolean,
    vote_average: Number,
    vote_count: Number
        
})

const userSchema = new mongoose.Schema({
    email : String,
    password : String
});

const User = mongoose.model('User' , userSchema);


const FavMovie = new mongoose.model("FavMovie" , movieSchema);
const WatchedMovie = new mongoose.model("WatchedMovie" , movieSchema);


const aisi = () => {
    FavMovie.find({}).then((result) => {
        console.log(result)
    })
}

app.post("/sendSForm" , async (req , res) =>{

    // let present = false;
    
    User.find({email : req.body.email , password : req.body.password}).then(async (result) => {
        if(result.length === 0){
            let user = new User(req.body);
            const doc = await user.save();
            console.log(user);
        }
        else{
            console.log(result);
            console.log("account already present , head to login page");
        }

    })


})

app.post("/sendLForm" , async (req , res) =>{

    User.find({email : req.body.email , password : req.body.password}).then(async (result) => {
        if(result.length === 0){
            console.log("Account not present , pehle register kar");
        }
        else{
            console.log(result);
            console.log("You are logged in");
        }
    })    

})

app.get("/getFav" , async (req , res) => {
    FavMovie.find({}).then((result) => {
        res.send(result);
    })
})

app.get("/getWatched" , async (req , res) => {
    WatchedMovie.find({}).then((result) => {
        res.send(result);
    })
})


app.post("/sendFav" , async (req , res) =>{

    // console.log(req.body);
    // res.json(doc);
    const movie = new FavMovie(req.body);
    const doc = await movie.save();
    // console.log(doc);
})

app.post("/sendWatched" , async (req , res) =>{

    // console.log(req.body);
    // res.json(doc);
    const movie = new WatchedMovie(req.body);
    const doc = await movie.save();
    // console.log(doc);
})

app.post("/remFav" , async (req , res) => {
    console.log(req.body)
    const movie = req.body;
    FavMovie.find({id: movie.id}).then((results) => {
        console.log(results[0])
        FavMovie.findByIdAndRemove({_id : results[0]._id}).then((result) =>{
            if(result){
              console.log("movie deleted successfully");
            }
            else{
              console.log("movie not found");
            }
        })
    })
}) 

app.post("/remWatched" , async (req , res) => {
    console.log(req.body)
    const movie = req.body;
    WatchedMovie.find({id: movie.id}).then((results) => {
        console.log(results[0])
        WatchedMovie.findByIdAndRemove({_id : results[0]._id}).then((result) =>{
            if(result){
              console.log("movie deleted successfully");
            }
            else{
              console.log("movie not found");
            }
        })
    })
}) 


app.listen(5000 , () => {
    console.log("Server running successfully at port 5000");
})