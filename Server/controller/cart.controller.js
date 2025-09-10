import CartProductModel from "../models/cartProduct.model.js";
import UserModel from "../models/user.model.js";

export const addToCartItemController = async (request, response) => {
  try {
    const userId = request.userId;
    const { productId, unit } = request.body;

    if (!productId || !unit) {
      return response.status(402).json({
        message: "provide productId and unit",
        error: true,
        success: false,
      });
    }

    const checkItemCart = await CartProductModel.findOne({
      userId: userId,
      productId: productId,
      "unit._id": unit._id, // Check for unit._id to prevent duplicate units
    });

    if (checkItemCart) {
      return response.status(400).json({
        message: "item already in cart with this unit",
      });
    }

    const cartItem = new CartProductModel({
      quantity: 1,
      userId: userId,
      productId: productId,
      unit: unit,
    });

    const save = await cartItem.save();
    const updateCartUser = await UserModel.updateOne(
      { _id: userId },
      { $push: { shopping_cart: productId } }
    );

    return response.json({
      data: save,
      message: "item added to cart",
      error: false,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};


export const getCartItemController = async (request, response)=>{
        try {
            const userId = request.userId

            const cartItem = await CartProductModel.find({
                userId : userId
            }).populate('productId')

            return response.json({
                data : cartItem,
                error : false,
                success : true
            })

        } catch (error) {
            return response.status(500).json({
                message : error.message || error,
                error : true,
                success : false
            })
        }
}

export const updateCartItemQtyController = async (request, response) => {
  try {
    const userId = request.userId;
    const { _id, qty, unit } = request.body;
    if (!_id || !qty) {
      return response.status(400).json({
        message: "provide _id, qty",
      });
    }
    const updateCartItem = await CartProductModel.updateOne(
      { _id: _id, userId: userId },
      { quantity: qty, unit: unit }
    );
    return response.json({
      message: "Item updated",
      success: true,
      error: false,
      data: updateCartItem,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};


export const deleteCartItemQtyController = async(request, response) =>{
    try {
        const userId = request.userId
        const {  _id  } = request.body

        if(!_id){
            return response.status(400).json({
                message : "provide _id",
                error : true,
                success : false
            })
        }

        const deleteCartItem = await CartProductModel.deleteOne({_id : _id, userId : userId})

        return response.json({
            message : "item removed",
            error : false,
            success : true,
            data : deleteCartItem
        })

    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}