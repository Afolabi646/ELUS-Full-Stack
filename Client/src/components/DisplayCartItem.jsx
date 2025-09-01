import React from 'react'
import { IoClose } from 'react-icons/io5'
import { Link, useNavigate } from 'react-router-dom';
import { DisplayPriceInPounds } from '../utils/DisplayPriceInPounds';
import { useGlobalContext } from '../provider/GlobalProvider';
import { FaCaretRight } from 'react-icons/fa6';
import { useSelector } from 'react-redux';
import AddToCartButton from './AddToCartButton';
import emptyCart from '../assets/emptyCart.jpeg'
import toast from 'react-hot-toast';


const DisplayCartItem = ({close}) => {
    const { totalPrice, totalQty } = useGlobalContext();
    const cartItem = useSelector(state => state.cartItem.cart)
    const grandTotal = totalPrice + 7.99;
    const user = useSelector(state => state.user)
    const navigate = useNavigate()

    const redirectToCheckoutPage = ()=>{
        if(user?._id){
          navigate("/checkout")
          if(close){
            close()
          }
          return
        }
        toast("please login")
    }

  return (
    <section className="bg-neutral-900/70 fixed top-0 bottom-0 right-0 left-0 z-50">
      <div className="bg-white w-full max-w-sm min-h-screen max-h-screen ml-auto">
        <div className="flex items-center p-4 shadow-md gap-3 justify-between">
          <h2 className="font-semibold">Cart</h2>
          <Link to={"/"} className="lg:hidden">
            <IoClose size={25} />
          </Link>
          <button onClick={close} className="hidden lg:block">
            <IoClose size={25} />
          </button>
        </div>

        <div className="min-h-[75vh] lg:min-h-[80vh] h-full max-h-[calc(100vh-150px)] bg-blue-50">
          {/**Display Items */}
          {cartItem[0] ? (
            <>
              <div className="mb-4"></div>
              <div className="bg-white rounded-lg p-4 grid gap-5 overflow-auto max-h-[calc(100vh-300px)]">
                {cartItem[0] &&
                  cartItem.map((item, index) => {
                    return (
                      <div
                        key={item?._id + "cartItemDisplay"}
                        className="flex w-full gap-4"
                      >
                        <div className="w-16 h-16 min-h-16 min-w-16 bg-red-500 border rounded">
                          <img
                            src={item?.productId?.image[0]}
                            className="object-scale-down"
                          />
                        </div>
                        <div className="w-full max-w-sm text-xs">
                          <p className="text-xs text-ellipsis line-clamp-2">
                            {item.productId?.name}
                          </p>
                          <p className="text-neutral-400">
                            {item?.productId?.unit}
                          </p>
                          <p className="font-semibold">
                            {DisplayPriceInPounds(item.productId.price)}
                          </p>
                        </div>
                        <div>
                          <AddToCartButton data={item?.productId} />
                        </div>
                      </div>
                    );
                  })}
              </div>

              <div className="bg-white p-1 mt-6">
                <h3 className="font-semibold">Bill details</h3>
                <div className="flex gap-4 justify-between ml-1">
                  <p>Items Total</p>
                  <p>
                    <span>{DisplayPriceInPounds(totalPrice)}</span>
                  </p>
                </div>
                <div className="flex gap-4 justify-between ml-1">
                  <p>Total Quantity</p>
                  <p>{totalQty} items</p>
                </div>
                <div className="flex gap-4 justify-between ml-1 border-b-1">
                  <p>Delivery Fee</p>
                  <p>{DisplayPriceInPounds(7.99)}</p>
                </div>

                <div className="font-semibold flex items-center justify-between gap-4 mt-2">
                  <p>Total</p>
                  <p>{DisplayPriceInPounds(grandTotal)}</p>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white flex flex-col justify-center items-center">
              <img
                src={emptyCart}
                className="w-full h-full object-scale-down"
              />
              <Link
                onClick={close}
                to={"/"}
                className="block bg-green-600 px-4 py-2 text-white rounded"
              >
                Shop Now
              </Link>
            </div>
          )}
        </div>

        {cartItem[0] && (
          <div className="p-2">
            <div className="bg-green-700 text-neutral-100 px-4 font-bold text-base py-4 sticky bottom-3 rounded flex items-center gap-4 justify-between">
              <div>
                Total: {DisplayPriceInPounds(grandTotal)} (incl. delivery)
              </div>

              <button
                onClick={redirectToCheckoutPage}
                className="flex items-center gap-1 hover:cursor-pointer"
              >
                Proceed
                <span>
                  <FaCaretRight />
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default DisplayCartItem