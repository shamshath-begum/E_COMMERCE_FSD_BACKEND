var express = require('express');
var router = express.Router();
const Stripe=require("stripe")
const mongoose = require("mongoose");
const { dbUrl } = require("../config/dbConfig");
const { productModel } = require("../schema/productSchema.js");
mongoose.set("strictQuery", true);
mongoose.connect(dbUrl);



router.post('/addProduct',async(req, res)=> {
let data=await productModel(req.body)
await data.save()
res.send({mesage:"Product Added Successfully"})
});

router. get('/getProducts',async(req,res)=>{
let product=await productModel.find({})
res.send(product)
})

// payment gateway
let stripe=new Stripe("sk_test_51N3eh3SHNBZiBdpK3dYZBP2AFDKIPQojVLhwiIBrWAveBfKe1HcagBtom6LjAWC6dv4dPjERBoYR92IehhBFHFkk00ywdcouYo")
router.post("/checkout-payment",async(req,res)=>{
    // console.log(req.body);
    try {
        const params={
submit_type:"pay",
mode:"payment",
payment_method_types:["card"],
billing_address_collection:"auto",
shipping_options:[{
    shipping_rate:"shr_1Nk7cWSHNBZiBdpKdgbrHJmS"
}],
line_items:req.body.map((item)=>{
    return{
        price_data:{
            currency:"inr",
            product_data:{
                name:item.name,
                // images:[item.image]
            },
            unit_amount:item.price*100,
        },
        adjustable_quantity:{
            enabled:true,
            minimum:1,
        },
        quantity:item.qty
    }
}),
success_url:"https://tubular-paletas-df757b.netlify.app/success",// http://localhost:3000/success",
cancel_url:"http://localhost:3000/cancel"

        }

        
    // stripe method for checkout session
    const session=await stripe.checkout.sessions.create(params)
    res.status(200).json(session.id)
    } catch (error) {
        res.status(err.statusCode || 500).json(err.message)
    }
    
})
router.get('/',(req,res)=>{
    res.status(200).send({
       message: "hello"
    })
})
module.exports = router;
