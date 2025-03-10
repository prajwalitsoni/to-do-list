const express=require('express');
const bodyParser=require('body-parser');
const path = require("path");
var app=express();
app.use(express.static(path.join(__dirname, "public")));
app.set('view engine','ejs');
app.use(express.urlencoded({extended:true}));

app.listen(8000,()=>{
    console.log('Server is running on port 3001');
}
);
var items= [];

app.get('/',(req,res)=>{
    res.render('list',{items_ejs:items});
}
);

app.post('/add',(req,res)=>{
   var item= req.body.task;
   items.push(item);
    res.redirect('/');
}
);
