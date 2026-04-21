import productModel from "../models/product.model.js";
import { uploadFile } from "../services/storage.service.js";
import mongoose from "mongoose";    

export async function createProduct(req, res) {

    const { title, description, priceAmount, priceCurrency } = req.body;
    const seller = req.user;

    const images = await Promise.all(req.files.map(async (file) => {
        return await uploadFile({
            buffer: file.buffer,
            fileName: file.originalname
        })
    }))

    const product = await productModel.create({
        title,
        description,
        price: {
            amount: priceAmount,
            currency: priceCurrency || "INR"
        },
        images,
        seller: seller._id
    })


    res.status(201).json({
        message: "Product created successfully",
        success: true,
        product
    })
}

export async function getSellerProducts(req, res) {
    const seller = req.user;

    const products = await productModel.find({ seller: seller._id });


    res.status(200).json({
        message: "Products fetched successfully",
        success: true,
        products
    })
}


export async function getAllProducts(req, res) {

    const products = await productModel.find();
    res.status(200).json({
        message: "Products fetched successfully",
        success: true,
        products
    })
}

export async function getProductById(req, res) {
    const { _id } = req.params;

    const product = await productModel.findById(_id)
    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
        message: "Product fetched successfully",
        success: true,
        product
    })
}

export async function updateProduct(req,res){
    const { _id } = req.params;
    const {title,description,priceAmount,priceCurrency} = req.body;
    const image = req.file; 

    const product = await productModel.findById(_id);
    
    if (!product) {
        return res.status(404).json({ message: "Product not found", success: false });
    }

    if(req.user._id.toString() !== product.seller.toString()){
        return res.status(403).json({
            message: "Unauthorized access",
            success: false
        })
    }   

    if(title){
        product.title = title
    }
    if(description){
        product.description = description
    }
    if(priceAmount){
        product.price.amount = priceAmount
    }
    if(priceCurrency){
        product.price.currency = priceCurrency
    }
    if(image){
        product.images = await uploadFile({
            buffer: image.buffer,
            fileName: image.originalname
        })
    }

    await product.save()

    return res.status(200).json({
        message: "Product updated successfully",
        success: true,
        product
    })
}

export async function deleteProduct(req, res) {
  try {
    const id = req.params._id;  

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid product ID",
        success: false
      });
    }

    const product = await productModel.findById(id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
        success: false
      });
    }

    // 🔐 Check auth BEFORE delete
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized",
        success: false
      });
    }

    if (req.user._id.toString() !== product.seller.toString()) {
      return res.status(403).json({
        message: "Unauthorized access",
        success: false
      });
    }

    // 🗑️ Now delete
    await product.deleteOne();

    return res.status(200).json({
      message: "Product deleted successfully",
      success: true
    });

  } catch (error) {
    console.error("Delete Error:", error);
    return res.status(500).json({
      message: error.message,
      success: false
    });
  }
}

export async function addProductVariant(req, res) {

    const productId = req.params._id;

    const product = await productModel.findOne({
        _id: productId,
        seller: req.user._id
    });

    if (!product) {
        return res.status(404).json({
            message: "Product not found",
            success: false
        })
    }

    const files = req.files;
    const images = [];
    if (files && files.length > 0) {
        (await Promise.all(files.map(async (file) => {
            const image = await uploadFile({
                buffer: file.buffer,
                fileName: file.originalname
            })
            return image
        }))).map(image => images.push(image))
    }

    const price = req.body.priceAmount
    const stock = req.body.stock
    const attributes = JSON.parse(req.body.attributes || "{}")

    console.log(price)

    product.variants.push({
        images,
        price: {
            amount: Number(price) || product.price.amount,
            currency: req.body.priceCurrency || product.price.currency
        },
        stock,
        attributes
    })

    await product.save();

    return res.status(200).json({
        message: "Product variant added successfully",
        success: true,
        product
    })

}
export async function getProductVariants(req, res) {
    const { _id } = req.params;

    const product = await productModel.findById(_id);

    if (!product) {
        return res.status(404).json({
            message: "Product not found",
            success: false
        })
    }

    return res.status(200).json({
        message: "Product variants fetched successfully",
        success: true,
        product
    })
}

export async function updateProductVariant(req, res) {
    const { _id, variantId } = req.params;
    const product = await productModel.findOne({ _id, seller: req.user._id });

    if (!product) {
        return res.status(404).json({ message: "Product not found", success: false });
    }

    const variantIndex = product.variants.findIndex(v => v._id.toString() === variantId);
    if (variantIndex === -1) {
        return res.status(404).json({ message: "Variant not found", success: false });
    }

    const { priceAmount, priceCurrency, stock, attributes } = req.body;

    if (priceAmount !== undefined) {
        product.variants[variantIndex].price.amount = Number(priceAmount);
    }
    if (priceCurrency !== undefined) {
        product.variants[variantIndex].price.currency = priceCurrency;
    }
    if (stock !== undefined) {
        product.variants[variantIndex].stock = Number(stock);
    }
    if (attributes !== undefined) {
        let parsedAttributes = attributes;
        if (typeof attributes === 'string') {
            parsedAttributes = JSON.parse(attributes);
        }
        product.variants[variantIndex].attributes = parsedAttributes;
    }

    await product.save();

    return res.status(200).json({
        message: "Product variant updated successfully",
        success: true,
        product
    });
}

export async function deleteProductVariant(req, res) {
    const { _id, variantId } = req.params;
    const product = await productModel.findOne({ _id, seller: req.user._id });

    if (!product) {
        return res.status(404).json({ message: "Product not found", success: false });
    }

    product.variants = product.variants.filter(v => v._id.toString() !== variantId);
    await product.save();

    return res.status(200).json({
        message: "Product variant deleted successfully",
        success: true,
        product
    });
}

export async function searchProducts(req, res) {
  try {
    const query = req.query.q?.trim();

    if (!query) {
      return res.status(400).json({
        message: "Query parameter is required",
        success: false
      });
    }

    const products = await productModel.find(
      { $text: { $search: query } },
      { score: { $meta: "textScore" } }
    )
    .sort({ score: { $meta: "textScore" } }) // 🔥 ranking
    .limit(20);

    return res.status(200).json({
      message: "Products fetched successfully",
      success: true,
      products
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false
    });
  }
}