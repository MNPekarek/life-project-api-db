import mongoose from "mongoose";
import paginate  from "mongoose-paginate-v2";

const productSchema = new mongoose.Schema({
    title: { type: String },
    description: { type: String, index: "text" },
    thumbnail: { type: String, default: "" },
    code: { type: String, unique: true},
    price: Number,
    stock: Number,
    quantity: {type: String } ,
    category: { type: String, index: true },
    status: { type: Boolean, default: true },
    created_at: {
        type: Date,
        default: Date.now()
    }
}, { collection: "products" });

productSchema.plugin(paginate);

const Product = mongoose.model("Product", productSchema);

export default Product;