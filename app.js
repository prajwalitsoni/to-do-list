const express=require('express');
const bodyParser=require('body-parser');
const mongoose =require('mongoose');
const encrypt=require('mongoose-encryption');
const ejs=require('ejs');
const path = require("path");
const session = require('express-session'); // Add this line
var app=express();
app.use(express.static(path.join(__dirname, "public")));
app.set('view engine','ejs');
app.use(express.urlencoded({extended:true}));
mongoose.connect('mongodb://localhost:27017/todo',{useNewUrlParser:true,useUnifiedTopology:true});
const itemSchema={
    name:String
};
const secret='Thisisourlittlesecret.';
const registerSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String
});
registerSchema.plugin(encrypt, { secret: secret, encryptedFields: ['password'] });
const Item=mongoose.model('Item',itemSchema);
const Register = mongoose.model('Register', registerSchema, 'registers');

// const item1=new Item({
//     name:'Welcome to your todolist'
// });
// item1.save();

// Configure session middleware
app.use(session({
    secret: 'Thisisourlittlesecret.', // Use a secure secret
    resave: false,
    saveUninitialized: false
}));

app.listen(8002,()=>{
    console.log('Server is running on port 8002');
}
);
var items= [];

app.get('/to-do-list', (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/');
    }
    Item.find({})
        .then(items => res.render('list', { items_ejs: items }))
        .catch(err => {
            console.error(err);
            res.status(500).send("Error fetching items");
        });
});
app.get('/',(req,res)=>{
    res.render('login');
});
app.get('/register',(req,res)=>{
    res.render('register');
}
);
app.post('/register',async(req,res)=>{
    try{
        const newUser=new Register({
            username:req.body.username,
            email:req.body.email,
            password:req.body.password
        });
        await newUser.save();
        res.redirect('/');
    }catch(err){
        console.error(err);
        res.status(500).send("Error registering user");
    }
}
);
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log("Email:", email);
        console.log ("Password:", password);    

        // Check if email and password are provided
        if (!email || !password) {
            console.error("Email or password not provided");
            return res.status(400).send("Email and password are required");
        }

        const user = await Register.findOne({ email });
        if (!user) {
            console.error("User not found for email:", email);
            return res.status(400).send("Invalid email or password");
        }

        // Debugging: Log the decrypted password
        console.log("Decrypted password from database:", user.password);

        // Password is automatically decrypted by mongoose-encryption when fetched
        if (user.password === password) {
            req.session.userId = user._id; // Save user ID in session
            res.redirect('/to-do-list');
        } else {
            console.error("Password mismatch for email:", email);
            res.status(400).send("Invalid email or password");
        }
    } catch (err) {
        console.error("Error during login:", err);
        res.status(500).send("Error logging in user");
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error("Error during logout:", err);
            return res.status(500).send("Error logging out");
        }
        res.redirect('/');
    });
});

app.post('/add', async (req, res) => {
    try {
        const itemName = req.body.task;
        const newItem = new Item({ name: itemName });
        await newItem.save();
        res.redirect('/to-do-list'); // Redirect to the to-do list page
    } catch (err) {
        console.error(err);
        res.status(500).send("Error saving item");
    }
});

app.post('/delete', (req, res) => {
    const itemId = req.body.id;

    Item.findByIdAndDelete(itemId)
        .then(() => res.redirect('/to-do-list')) // Redirect to the to-do list page
        .catch(err => {
            console.error(err);
            res.status(500).send("Error deleting item");
        });
});

