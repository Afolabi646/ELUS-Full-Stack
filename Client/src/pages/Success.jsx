import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useGlobalContext } from "../provider/GlobalProvider";
import Axios from "../utils/Axios";

const Success = () => {
  const location = useLocation();
  const { fetchCartItem } = useGlobalContext();

  const clearCart = async () => {
    try {
      const response = await Axios({
        url: "/api/order/clear-cart",
        method: "POST",
      });
      if (response.data.success) {
        console.log("Cart cleared successfully:", response.data);
        // Refresh cart data in the UI
        if (fetchCartItem) {
          fetchCartItem();
        }
      } else {
        console.error("Failed to clear cart:", response.data.message);
      }
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  };

  useEffect(() => {
    clearCart();
  }, []);

  return (
    <div className="m-2 w-full max-w-md bg-green-200 p-4 py-5 rounded mx-auto flex flex-col justify-center items-center gap-5">
      <p className="text-green-800 font-bold text-lg text-center">
        {Boolean(location?.state?.text) ? location?.state?.text : "payment"}{" "}
        Successfully
      </p>
      <Link
        to="/"
        className="border border-green-900 text-green-900 hover:bg-green-900 hover:text-white transition-all px-4 py-1"
      >
        Go To Home
      </Link>
    </div>
  );
};

export default Success;
