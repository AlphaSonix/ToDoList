import express from 'express';
import https from 'https';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { getDate } from './date.js'; 

const app = express();
app.use(express.static('public'));
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const items = ["Shower", "Brush Teeth", "Make Breakfast"];
const workItems = [];

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true })); 

app.get("/", function(req, res){

    const day = getDate();
    // const today = new Date();

    // const options = {
    //     weekday: 'long',
    //     day: 'numeric',
    //     month: 'long'
    // }
    // let dayoftheWeek = today.toLocaleString('en-gb', options);

    // *USING AN ARRAY *
    // var dayIndex = today.getDay();
    // var dayList = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    // var day = dayList[dayIndex];
    //let day = "";

    // if (today.getDay() === 6 || today.getDay() === 0) {
    //     day = dayoftheWeek; 
    // } else {
    //     day = dayoftheWeek; 
    // }

    res.render('list', {listTitle: day, newItems: items});
    //res.send(); 
})

app.post("/", function (req, res) {
    let item = req.body.newTask; 
    console.log(item);
    if (req.body.list === "Work") {
        workItems.push(item);
        res.redirect("/work");
    } else {
        items.push(item);
        res.redirect("/");
    } 
})

app.get("/work", function (req, res) {
    res.render('list', {listTitle: "Work", newItems: workItems});
})

app.get("/about", function (req, res) {
    res.render('aboutme');
})

// app.post("/work", function (req, res) {
//     let item = req.body.newTask;
//     workItems.push(item);
//     res.redirect("/work")
// })

app.listen(3000,function(){
    console.log("Communications succesful with port 3000");
})