import { Router } from 'express';
import { authenticateUser } from '../middlewares/auth.middleware.js';
import { validateAddToCart } from '../validator/cart.validator.js';
import { addToCart, getCart, removeFromCart } from '../controllers/cart.controller.js';


const cartRouter = Router();


/**
 * @route POST /api/cart/add/:productId/:variantId
 * @desc Add item to cart
 * @access Private
 * @argument productId - ID of the product to add
 * @argument variantId - ID of the variant to add
 * @argument quantity - Quantity of the item to add (optional, default: 1)
 */
cartRouter.post("/add/:productId/:variantId", authenticateUser, validateAddToCart, addToCart)



/**
 * @route GET /api/cart
 * @desc Get user's cart
 * @access Private
 */
cartRouter.get('/', authenticateUser, getCart)


cartRouter.delete('/remove/:productId/:variantId', authenticateUser, removeFromCart);
export default cartRouter;