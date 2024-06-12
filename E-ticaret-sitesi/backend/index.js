const port = 4000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");

app.use(express.json());
app.use(cors());

// veritabanı bağlantısı mongodb 
mongoose.connect("mongodb+srv://nordo:nordo55@cluster0.q14dxxd.mongodb.net/e-ticaret-sitesi");

// api oluşturma
app.get("/",(req,res)=>{
    res.send("Express App çalıştırılıyor.")
})

// image storage engine

const storage = multer.diskStorage({
    destination: './upload/images',
    filename:(req,file,cb)=>{
        return cb(null,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})

const upload = multer({storage:storage})

// imagesler için upload endpoint oluşturma
app.use('/images',express.static('upload/images'))

app.post("/upload",upload.single('product'),(req,res)=>{
    res.json({
        success:1,
        image_url:`http://localhost:${port}/images/${req.file.filename}`
    })
})

// ürünleri oluşturmak için şema

const Product = mongoose.model("Product", {
    id:{
        type: Number,
        required: true,
    },
    name:{
        type: String,
        required: true,
    },
    image:{
        type: String,
        required: true,
    },
    category:{
        type: String,
        required: true,
    },
    new_price:{
        type: Number,
        required: true,
    },
    old_price:{
        type: Number,
        required: true,
    },
    date:{
        type: Date,
        default: Date.now,
    },
    avilable:{
        type: Boolean,
        default: true,
    },
})

app.post('/addproduct',async(req,res)=>{
    let products = await Product.find({});
    let id;
    if(products.length>0)
    {
        let last_product_array = products.slice(-1);
        let last_product = last_product_array[0];
        id = last_product.id+1;
    }
    else{
        id=1;
    }
    const product = new Product({
        id:id,
        name:req.body.name,
        image:req.body.image,
        category:req.body.category,
        new_price:req.body.new_price,
        old_price:req.body.old_price,
    });
    console.log(product);
    await product.save();
    console.log("Kaydedildi");
    res.json({
        success:true,
        name:req.body.name,
    })
})

// ürünleri silmek için API

app.post('/removeproduct',async(req,res)=>{ 
    await Product.findOneAndDelete({id:req.body.id});
    console.log("Kaldırıldı");
    res.json({
        success:true,
        name:req.body.name
    })
})

// tüm ürünleri almak için API
app.get('/allproducts',async(req,res)=>{
    let products = await Product.find({});
    console.log("Tüm ürünler getirildi");
    res.send(products);
})

// kullanıcı oluşturmak için şema

const Users = mongoose.model('Users',{
    name:{
        type:String,
    },
    email:{
        type:String,
        unique:true,
    },
    password:{
        type:String,
    },
    cartData:{
        type:Object,
    },
    date:{
        type:Date,
        default:Date.now,
    }
})

// kullanıcı kaydı için Uçnokta oluşturmak

app.post('/signup',async (req,res)=>{

    let check = await Users.findOne({email:req.body.email});
    if (check){
        return res.status(400).json({success:false,errors:"bu maile kayıtlı bir hesap sistemde mevcuttur !"})
    }
    let cart = {};
    for (let i = 0; i < 300; i++) {
        cart[i]=0;
    }
    const user = new Users({
        name:req.body.username,
        email:req.body.email,
        password:req.body.password,
        cartData:cart,
    })

    await user.save();

    const data = {
        user:{
            id:user.id
        }
    }

    const token = jwt.sign(data,'secret_ecom');
    res.json({success:true,token})

})

// kullanıcı girişi için Uçnokta oluşturmak

app.post('/login',async (req,res)=>{
    let user = await Users.findOne({email:req.body.email});
    if (user){
        const passCompare = req.body.password === user.password;
        if (passCompare) {
            const data = {
                user:{
                    id:user.id
                }
            }
            const token = jwt.sign(data,'secret_ecom');
            res.json({success:true,token});
        }
        else{
            res.json({success:false,errors:"Yanlış şifre !"});
        }
    }
    else{
        res.json({success:false,errors:"Yanlış email !"});
    }
})

// Yeni Koleksiyon verileri oluşturmak için Uç Nokta
app.get('/newcollections',async (req,res)=>{
    let products = await Product.find({});
    let newcollection = products.slice(1).slice(-8);
    console.log("Yeni Ürünler Getirildi");
    res.send(newcollection);
})

// Kadınlar arasında populer ürünler için Uç Nokta
app.get('/popularinwomen',async (req,res)=>{
    let products = await Product.find({category:"women"});
    let popular_in_women = products.slice(0,4);
    console.log("Kadınlar arasında populer olanlar getirildi");
    res.send(popular_in_women);
})

// Kullanıcıyı getirmek için middleware oluşturmak
const fetchUser = async (req,res,next)=>{
    const token = req.header('auth-token');
    if (!token) {
        res.status(401).send({errors:"Lütfen geçerli bir token kullanarak doğrulama yapın"})
    }
    else{
        try {
            const data =jwt.verify(token,'secret_ecom');
            req.user = data.user;
            next();
        } catch (error) {
            res.static(401).send({errors:"Lütfen geçerli bir token kullanarak doğrulama yapın"})
        }
    }
}

// Sepete ürün eklemek için oluşturulan Uç Nokta
app.post('/addtocart',fetchUser,async (req,res)=>{
    console.log("added",req.body.itemId);
    let userData = await Users.findOne({_id:req.user.id});
    userData.cartData[req.body.itemId] += 1;
    await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData});
    res.send("Eklendi")
})

// Sepetten ürün silmek için oluşturulan Uç Nokta
app.post('/removefromcart',fetchUser,async (req,res)=>{
    console.log("removed",req.body.itemId);
    let userData = await Users.findOne({_id:req.user.id});
    if (userData.cartData[req.body.itemId]>0)
    userData.cartData[req.body.itemId] -= 1;
    await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData});
    res.send("Silindi")
})

// Sepet verisini almak için oluşturulan Uç Nokta
app.post('/getcart',fetchUser,async (req,res)=>{
    console.log("Sepet Alındı");
    let userData = await Users.findOne({_id:req.user.id});
    res.json(userData.cartData);
})

app.listen(port,(error)=>{
    if (!error) {
        console.log("Sunucu şu portta çalıştırılıyor: "+port)
    }
    else
    {
        console.log("Hata : "+error)
    }
})