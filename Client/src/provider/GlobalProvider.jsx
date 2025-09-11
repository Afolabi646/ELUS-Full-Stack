import { createContext, useContext, useEffect, useState } from "react";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import { useDispatch, useSelector } from "react-redux";
import { handleAddItemCart } from "../store/cartProduct";
import AxiosToastError from "../utils/AxiosToastError";
import toast from "react-hot-toast";
import { handleAddAddress } from "../store/addressSlice";
import { setOrder } from "../store/orderSlice";

export const GlobalContext = createContext(null);
export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
  const dispatch = useDispatch();
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalQty, setTotalQty] = useState(0);
  const cartItem = useSelector((state) => state.cartItem.cart);
  const user = useSelector((state) => state?.user);

  const fetchCartItem = async () => {
    try {
      const response = await Axios({ ...SummaryApi.getCartItem });
      const { data: responseData } = response;
      if (responseData.success) {
        dispatch(handleAddItemCart(responseData.data));
      } else {
        throw new Error(responseData.message);
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  const updateCartItem = async (id, qty, action, unit = null) => {
    try {
      const response = await Axios({
        ...SummaryApi.updateCartItemQty,
        data: { _id: id, qty: qty, unit: unit },
      });
      const { data: responseData } = response;
      if (responseData.success) {
        if (action === "decrease") {
          toast.success("Quantity decreased");
        } else {
          toast.success(responseData.message);
        }
        fetchCartItem();
      } else {
        throw new Error(responseData.message);
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  const deleteCartItem = async (cartId) => {
    try {
      const response = await Axios({
        ...SummaryApi.deleteCartItem,
        data: { _id: cartId },
      });
      const { data: responseData } = response;
      if (responseData.success) {
        toast.success("Item removed");
        fetchCartItem();
      } else {
        throw new Error(responseData.message);
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  const fetchAddress = async () => {
    try {
      const response = await Axios({ ...SummaryApi.getAddress });
      const { data: responseData } = response;
      if (responseData.success) {
        dispatch(handleAddAddress(responseData.data));
      } else {
        throw new Error(responseData.message);
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  const fetchOrder = async () => {
    try {
      const response = await Axios({ ...SummaryApi.getOrderItems });
      const { data: responseData } = response;
      if (responseData.success) {
        dispatch(setOrder(responseData.data));
      } else {
        throw new Error(responseData.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleStripePayment = async (sessionId) => {
    try {
      const response = await stripe.redirectToCheckout({ sessionId });
      if (response.error) {
        throw new Error(response.error.message);
      } else {
        fetchOrder();
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchCartItem();
      fetchAddress();
      fetchOrder();
    }
  }, [user]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("payment_success") === "true") {
      fetchOrder();
    }
  }, []);

  useEffect(() => {
    const qty = cartItem.reduce((preve, curr) => {
      return preve + curr.quantity;
    }, 0);
    setTotalQty(qty);

    const tPrice = cartItem.reduce((preve, curr) => {
      return preve + curr.productId.price * curr.quantity;
    }, 0);
    setTotalPrice(tPrice);
  }, [cartItem]);

  const handleLogout = () => {
    localStorage.clear();
    dispatch(handleAddItemCart([]));
  };

  return (
    <GlobalContext.Provider
      value={{
        fetchCartItem,
        updateCartItem,
        deleteCartItem,
        fetchAddress,
        totalPrice,
        totalQty,
        fetchOrder,
        handleStripePayment,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
