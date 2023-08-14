import express from 'express';
import https from 'https';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { getDate } from './date.js';
import { mongoose } from 'mongoose';
import pkg from 'lodash';
import 'dotenv/config';

const app = express();
app.use(express.static('public'));
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const _ = pkg; 
//const mongoose = mongoose();

// const items = ["Shower", "Brush Teeth", "Make Breakfast"];
// const workItems = [];

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

main().catch(err => console.log(err));
async function main(){
await mongoose.connect('mongodb+srv://' + process.env.DB_USERNAME + ':' + process.env.DB_PASSWORD + '@cluster0.4bae75f.mongodb.net/todolistDB')   
}

    //.then(() => console.log('Connected!'));

const itemsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
});

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
    name: "Welcome to To-Do List!"
});
const item2 = new Item({
    name: "Add a task to be carried out"
});
const item3 = new Item({
    name: "<-- Check off tasks with this"
});

const itemsArr = [item1, item2, item3];

const listSchema = {
    name: String,
    items: [itemsSchema]
};

const List = mongoose.model("List", listSchema);

app.get("/", function (req, res) {

    // const day = getDate();

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
    // if (items.length === 0) {
    //         Item.insertMany(itemsArr) 
    //     .catch (function (err){
    //     console.log(err);
    //         }); 

    async function findItem() {

        try {
            const items = await Item.find();

            if (items.length === 0) {
                Item.insertMany(itemsArr)
                res.redirect("/");
            }
            res.render('list', { listTitle: "Today", newItems: items });
        } catch (e) {
            console.log(e);
        }
    }
    findItem();
    //res.send(); 
});

app.post("/", function (req, res) {
    const itemName = req.body.newTask;
    const listName = req.body.list;

    const item = new Item({
        name: itemName
    });

    if (listName === "Today") {
        item.save();
        res.redirect("/");
    } else {
        List.findOne({name: listName})
        .then (function (foundList){
            foundList.items.push(item);
            foundList.save();
            res.redirect("/" + listName);
        })
        // .finally(
        //     res.redirect("/" + listName)
        // )
    };

    // if (req.body.list === "Work") {
    //     workItems.push(item);
    //     res.redirect("/work");
    // } else {
    //     items.push(item);
    //     res.redirect("/");
    // } 
})

app.post("/delete", function (req, res) {
    const checkedItem = req.body.checkbox;
    const listName = req.body.listName; 

    if (listName === "Today") {
        Item.deleteOne({ _id: checkedItem })
        .finally(
            res.redirect("/")
        ) 
    } else {
        List.findOneAndUpdate({name: listName},{$pull: {items: {_id: checkedItem}}})
        .then(function(err) {
            if (!err) {
                res.redirect("/" + listName);
            }
        });
    }

   
})

app.get("/:listName", function (req, res) {
    const listName = _.capitalize(req.params.listName);

    List.findOne({ name: listName })
        .then(function (foundList) {
            if (!foundList) {
                //Create a new list
                const list = new List({
                    name: listName,
                    items: itemsArr
                });

                list.save()
                .then( function () { 
                    console.log("saved!");
                res.redirect("/" + listName); //redirect after saving
                });          
            } else {
                //Show existing list
                res.render('list', {listTitle: foundList.name, newItems: foundList.items});
            }
        })
        .catch(function (err) {
            console.log(err);
        });



})

// app.get("/work", function (req, res) {
//     res.render('list', {listTitle: "Work", newItems: workItems});
// })

app.get("/about", function (req, res) {
    res.render('aboutme');
})

// app.post("/work", function (req, res) {
//     let item = req.body.newTask;
//     workItems.push(item);
//     res.redirect("/work")
// })

const port = process.env.PORT || 3000

app.listen(port, function () {
    console.log("Communications succesful!");
})