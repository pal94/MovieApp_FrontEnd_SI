const fetch = require("node-fetch");
const express = require('express');
const bodyparser = require('body-parser');
const methodOverrride=require("method-override");

const app =express();

app.set("view engine", "ejs");
app.use(express.static('public'));
app.use('/assets',express.static('assets'));
app.use(methodOverrride("_method"));

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:true}));

//GET MOVIES: FETCH the url of api and store the data in an array.
//Render it to index.ejs.
app.get("/movies", async(req, res)=>{
        await fetch('http://ec2-3-83-241-106.compute-1.amazonaws.com:3005/movies')
       .then(response => response.json())
       .then(data => {
         let arr = [];

         for(var i =0;i< data.movies.length; i++){
             arr.push(data.movies[i]);
         }

         res.render("index", {mov:arr});
       })    
         .catch(err => {
           console.log("could not get the data");
       });
    
});

//GET new page for adding new Movie.
app.get("/movies/new", function(req,res){
    res.render("new");
});

//GET the a movie based on ID to show the details. Added id in url.
app.get("/movies/:id", async(req, res)=>{
    const objid = req.params.id;
    console.log("ID is "+ objid);
    await fetch('http://ec2-3-83-241-106.compute-1.amazonaws.com:3005/movies/'+ objid)
       .then(response => response.json())
       .then(data => {
         res.render("show", {mov: data.movie});
        })
        .catch(err => {
            console.log("could not get the data");
        });
});

//POST new movies. FETCH the url, headers and body to 
//post the data on the database.
app.post("/movies",async(req, res)=>{
   const b = 
        {
            name: req.body.mov.name,
            genre: req.body.mov.genre,
            rating: req.body.mov.rating,
            amount: req.body.mov.amount,
            available: req.body.mov.available
        }
    const response = await fetch("http://ec2-3-83-241-106.compute-1.amazonaws.com:3005/movies", {
    method: "POST",
    headers:{
         'Accept': 'application/json',
        'Content-Type':'application/json'
    },
    body: JSON.stringify(b)
   
}).then((res)=>  res.json())
.then((json) =>{
    console.log("JSON DATA");
    console.log(json);
});
    res.redirect('/movies');
});


//Get the movies details to edit the details.
app.get("/movies/:id/edit", async(req, res)=>{
    console.log("editing");
    const objid = req.params.id;
    console.log("ID is "+ objid);
    //console.log(req.params.genre);
    await fetch("http://ec2-3-83-241-106.compute-1.amazonaws.com:3005/movies/"+ objid + "/edit")
       .then(response => response.json())
       .then(data => {
         res.render("edit", {mov: data.movie});
        })
        .catch(err => {
            console.log("could not get the data");
        });
})

app.post("/movies/:id",async(req, res)=>{
    console.log("inside put");
    const id= req.params.id;
    console.log(req.body.mov)
     const response = await fetch("http://ec2-3-83-241-106.compute-1.amazonaws.com:3005/movies/" + id,{
     method: "PUT",
     headers:{
          'Accept': 'application/json',
         'Content-Type':'application/json'
     },
     body: JSON.stringify({
        name: req.body.mov.name,
        genre: req.body.mov.genre,
        rating: req.body.mov.rating,
        amount: req.body.mov.amount,
        available: req.body.mov.available
    })
    
 }).then((res)=> console.log(res.json()))
 .then((json) =>{
     console.log("JSON DATA");
     console.log(json);
 });
     res.redirect('/movies/'+ id);
 });

 app.delete("/movies/:id",async(req, res)=>{
    console.log("inside delete");
    const id= req.params.id;
     await fetch("http://ec2-3-83-241-106.compute-1.amazonaws.com:3005/movies/"+id , {
     method: "DELETE",
     headers:{
        'Accept': 'application/json',
       'Content-Type':'application/json'
   },
 }).then((res)=> console.log(res.json()))
 .catch(err => {
    console.log("could not delete the data");
});

     res.redirect('/movies');
 });



app.listen(4000,function(){

    console.log("now listneing for requests");
    
});






  