const mongoose=require('mongoose')

const ProductSchema = mongoose.Schema({
    name: String,
    category:String,
    image: String,
    price: String,
    description: String,
  });
  const productModel = mongoose.model("product",ProductSchema)
  module.exports={productModel}
