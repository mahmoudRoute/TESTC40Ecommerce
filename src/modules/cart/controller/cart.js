import cartModel from "../../../../DB/model/Cart.model.js";
import productModel from "../../../../DB/model/Product.model.js";
import { asyncHandler } from "../../../utils/errorHandling.js";



export const addToCart = asyncHandler(async (req, res, next) => {
    const { productId, quantity } = req.body;

    // check product availability
    const product = await productModel.findById(productId);
    if (!product) {
        return next(new Error("In-valid product", { cause: 400 }))
    }
    if (product.stock < (quantity || 1) || product.isDeleted) {
        return next(new Error(`Sorry only ${product.stock} left in stock `, { cause: 400 }))
    }
    // check cart exist
    const cart = await cartModel.findOne({ userId: req.user._id });
    if (!cart) {
        const newCart = await cartModel.create({
            userId: req.user._id,
            products: [
                { productId, quantity }
            ]
        })
        return res.status(201).json({ message: "Done", cart: newCart })
    }

    let matchedProduct = false;
    for (let i = 0; i < cart.products.length; i++) {
        if (cart.products[i].productId.toString() == productId) {
            cart.products[i].quantity = quantity || 1;
            matchedProduct = true
            break;
        }
    }

    if (!matchedProduct) {
        cart.products.push({ quantity, productId })
    }

    await cart.save();
    return res.status(200).json({ message: "Done", cart })


})

export async function removeItems(userId, productIds) {
    const cart = await cartModel.findOneAndUpdate({ userId }, {
        $pull: {
            products: {
                productId: { $in: productIds }
            }
        }
    }, { new: true })
    return cart
}
export const deleteSelectedItems = asyncHandler(async (req, res, next) => {
    const { productIds } = req.body;
    const cart = await removeItems(req.user._id, productIds)
    return res.status(200).json({ message: "Done", cart })

})

export async function clearCart(userId) {
    const cart = await cartModel.findOneAndUpdate({ userId }, {products: []}, { new: true })
    return cart
}
export const emptyCart = asyncHandler(async (req, res, next) => {
    const cart = await clearCart(req.user._id)
    return res.status(200).json({ message: "Done", cart })

})