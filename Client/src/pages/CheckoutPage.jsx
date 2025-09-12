import React, { useState } from "react";
import { DisplayPriceInPounds } from "../utils/DisplayPriceInPounds";
import { useGlobalContext } from "../provider/GlobalProvider";
import AddAddress from "../components/AddAddress";
import { useSelector } from "react-redux";
import AxiosToastError from "../utils/AxiosToastError";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";

const CheckoutPage = () => {
  const { totalQty, fetchCartItem, fetchOrder } = useGlobalContext();
  const cartItemsList = useSelector((state) => state.cartItem.cart);
  const totalPrice = cartItemsList.reduce((acc, item) => {
    return (
      acc + (item?.unit?.price || item?.productId?.price || 0) * item.quantity
    );
  }, 0);
  const grandTotal = totalPrice + 7.99;
  const [openAddAddress, setOpenAddAddress] = useState(false);
  const addressList = useSelector((state) => state.addresses.addressList);
  const [selectAddress, setSelectAddress] = useState(0);
  const navigate = useNavigate();

  // New function to clear cart after successful payment
  const clearCart = async () => {
    try {
      console.log("Clearing cart after successful payment");
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
      // Don't show error to user - this is a background operation
      // that shouldn't interrupt the success flow
    }
  };

  const handleCashOnDelivery = async () => {
    console.log("handleCashOnDelivery called");
    const selectedAddress = addressList[selectAddress];
    console.log("selectedAddress:", selectedAddress);
    console.log("cartItemsList:", cartItemsList);
    if (!selectedAddress) {
      toast.error("Please select a valid address");
      return;
    }

    console.log("cartItemsList:", cartItemsList);
    console.log(
      "list_items:",
      cartItemsList.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      }))
    );

    try {
      const totalPrice = cartItemsList.reduce((acc, item) => {
        return (
          acc +
          (item?.unit?.price || item?.productId?.price || 0) * item.quantity
        );
      }, 0);
      const grandTotal = totalPrice + 7.99;
      const response = await Axios({
        ...SummaryApi.payment_url,
        data: {
          addressId: selectedAddress._id,
          list_items: cartItemsList.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
          totalAmt: Math.round(grandTotal * 100),
        },
      });

      const { data: responseData } = response;
      if (responseData.success) {
        // Clear cart after successful order
        await clearCart();

        // Handle successful response
        toast.success(responseData.message);
        navigate("/success", { state: { text: "Order" } });
      } else {
        // Handle error response
        toast.error(responseData.message);
      }
    } catch (error) {
      console.log("Request payload:", {
        addressId: selectedAddress._id,
        list_items: cartItemsList.map((item) => ({
          productId: item.productId,
        })),
        totalAmt: grandTotal,
        subTotal: totalPrice,
      });

      console.error(error);
      if (error.response) {
        console.error("Error response status:", error.response.status);
        console.error("Error response data:", error.response.data);
        toast.error("An error occurred on the server. Please try again later.");
      } else {
        AxiosToastError(error);
      }
    }
  };

  const handleOnlinePayment = async () => {
    try {
      toast.loading("loading...");
      const selectedAddress = addressList[selectAddress];
      if (!selectedAddress) {
        toast.error("Please select a valid address");
        return;
      }

      const totalPrice = cartItemsList.reduce((acc, item) => {
        return (
          acc +
          (item?.unit?.price || item?.productId?.price || 0) * item.quantity
        );
      }, 0);
      const grandTotal = totalPrice + 7.99;

      const stripePublickKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
      const stripePromise = await loadStripe(stripePublickKey);
      const response = await Axios({
        ...SummaryApi.payment_url,
        data: {
          addressId: selectedAddress._id,
          list_items: cartItemsList.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
          totalAmt: Math.round(grandTotal * 100),
        },
      });
      const { data: responseData } = response;
      // For online payments, cart clearing happens on the success page
      // after Stripe redirects back to our site
      stripePromise.redirectToCheckout({ sessionId: responseData.id });
      if (fetchCartItem) {
        fetchCartItem();
      }
      if (fetchOrder) {
        fetchOrder();
      }
    } catch (error) {
      toast.dismiss(); // Dismiss loading toast
      if (error.response) {
        console.error("error response status", error.response.status);
        console.error("error response data", error.response.data);
      } else {
        console.error("error handling online payment", error);
      }
      AxiosToastError(error);
    }
  };

  return (
    <section className="bg-blue-50">
      <div className="container mx-auto p-4 flex flex-col lg:flex-row w-full gap-5 justify-between">
        <div className="w-full">
          {/**Address */}
          <h3 className="text-lg font-semibold">Choose Address</h3>

          <div className="bg-white p-2 grid gap-4">
            {addressList.map((address, index) => {
              return (
                <label
                  htmlFor={"address" + index}
                  key={index}
                  className={!address.status && "hidden"}
                >
                  <div className="border rounded p-3 flex gap-3 hover:bg-blue-50">
                    <div>
                      <input
                        id={"address" + index}
                        type="radio"
                        name="address"
                        value={index}
                        onChange={(e) => setSelectAddress(e.target.value)}
                      />
                    </div>
                    <div>
                      <p>{address.address_line}</p>
                      <p>{address.city}</p>
                      <p>
                        {address.state} - {address.pincode}
                      </p>
                      <p>{address.mobile}</p>
                    </div>
                  </div>
                </label>
              );
            })}
            <div
              onClick={() => setOpenAddAddress(true)}
              className="h-16 bg-blue-50 border-2 border-dashed flex justify-center items-center cursor-pointer"
            >
              Add address
            </div>
          </div>
        </div>

        <div className="w-full max-w-md bg-white py-4 px-2">
          {/**summary */}
          <h3 className="text-lg font-semibold">Summary</h3>
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
          <div className="w-full flex flex-col gap-4">
            <button
              onClick={handleOnlinePayment}
              className="py-2 px-4 bg-green-600 hover:bg-green-700 rounded text-white font-semibold"
            >
              Online Payment
            </button>
          </div>
        </div>
      </div>

      {openAddAddress && <AddAddress close={() => setOpenAddAddress(false)} />}
    </section>
  );
};

export default CheckoutPage;
