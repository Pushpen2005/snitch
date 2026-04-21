import express from 'express';
import { authenticateSeller, authenticateUser } from '../middlewares/auth.middleware.js';
import { createProduct, getSellerProducts, getAllProducts, getProductById, addProductVariant, getProductVariants, updateProductVariant, deleteProductVariant,updateProduct,deleteProduct,searchProducts } from '../controllers/product.controller.js';
import multer from "multer";
import { createProductValidator } from '../validator/product.validator.js';


const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024 // 5 MB
    }
})


const productRouter = express.Router();


/**
 * @route POST /api/products
 * @description Create a new product
 * @access Private (Seller only)
 */
productRouter.post("/create", authenticateSeller, upload.array('images', 7), createProductValidator, createProduct)


/** 
 * @route GET /api/products/seller
 * @description Get all products of the authenticated seller
 * @access Private (Seller only)
 */
productRouter.get("/seller", authenticateSeller, getSellerProducts)

/** 
 * @route GET /api/products
 * @description Get all products 
 * @access Public
 */
productRouter.get("/", getAllProducts)
productRouter.get("/search",authenticateUser, searchProducts)

productRouter.get("/:_id", getProductById)

productRouter.patch("/:_id", authenticateSeller, upload.array('images', 7), updateProduct)

productRouter.delete("/:_id", authenticateSeller, deleteProduct)

productRouter.post("/:_id/variants", authenticateSeller, upload.array('images', 7), addProductVariant)

productRouter.get("/:_id/variants", getProductVariants)


productRouter.patch("/:_id/variants/:variantId", authenticateSeller, updateProductVariant)
productRouter.delete("/:_id/variants/:variantId", authenticateSeller, deleteProductVariant)


export default productRouter;