import { auth } from '../../middleware/auth.js';
import { endpoint } from './cart.endPoint.js';
import * as cartController from './controller/cart.js'
import { Router } from "express";
const router = Router()


router.post("/",
    auth(endpoint.create),
    cartController.addToCart)

router.patch("/deleteItems",
    auth(endpoint.create),
    cartController.deleteSelectedItems
)


router.patch("/empty",
    auth(endpoint.create),
    cartController.emptyCart
)

export default router