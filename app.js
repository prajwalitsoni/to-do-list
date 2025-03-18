const express=require('express');
const bodyParser=require('body-parser');
const mongoose =require('mongoose');
const ejs=require('ejs');
const path = require("path");
var app=express();
app.use(express.static(path.join(__dirname, "public")));
app.set('view engine','ejs');
app.use(express.urlencoded({extended:true}));
mongoose.connect('mongodb://localhost:27017/todo',{useNewUrlParser:true,useUnifiedTopology:true});
const itemSchema={
    name:String
};
const Item=mongoose.model('Item',itemSchema);

// const item1=new Item({
//     name:'Welcome to your todolist'
// });
// item1.save();


app.listen(3003,()=>{
    console.log('Server is running on port 3003');
}
);
var items= [];

app.get('/', (_, res) => {
    Item.find({})
        .then(items => res.render('list', { items_ejs: items }))
        .catch(err => {
            console.error(err);
            res.status(500).send("Error fetching items");
        });
});

app.post('/add', async (req, res) => {
    try {
        const itemName = req.body.task;
        const newItem = new Item({ name: itemName });
        await newItem.save();
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).send("Error saving item");
    }
});
app.post('/delete', (req, res) => {
    const itemId = req.body.id;
    
    Item.findByIdAndDelete(itemId)
        .then(() => res.redirect('/'))
        .catch(err => {
            console.error(err);
            res.status(500).send("Error deleting item");
        });
});

