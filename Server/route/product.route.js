import { Router } from 'express'
import auth from '../middleware/auth.js'
import { createProductController, getProductByCategory, getProductByCategoryAndSubCategory, getProductController, searchProduct, updateProductDetails } from '../controller/product.controller.js'
import { admin } from '../middleware/Admin.js'

const productRouter = Router()

productRouter.post("/create", auth, admin, createProductController)
productRouter.post("/get", getProductController)
productRouter.post("/get-product-by-category", getProductByCategory)
productRouter.post('/get-product-by-category-and-subcategory', getProductByCategoryAndSubCategory)
productRouter.put('/update-product-details',auth, admin, updateProductDetails)

//search product API
productRouter.post("/search-product", searchProduct);


export default productRouter