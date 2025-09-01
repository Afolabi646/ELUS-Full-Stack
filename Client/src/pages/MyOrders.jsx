import React from "react";
import { useSelector } from "react-redux";
import NoData from "../components/NoData";

const MyOrders = () => {
  const orders = useSelector((state) => state.orders.order);
  const filteredOrders = orders.filter(
    (order) => order.product_details.name !== "Delivery Fee"
  );

  return (
    <div>
      <div className="bg-white shadow-md p-3 font-semibold">
        <h1>Orders for {new Date().toLocaleDateString()}</h1>
      </div>
      {Array.isArray(filteredOrders) && filteredOrders.length > 0 ? (
        filteredOrders.map((order, index) => (
          <div
            key={order._id + index + "order"}
            className="border rounded p-4 text-sm"
          >
            <p>Order No: {order?.orderId}</p>
            <div className="flex gap-3">
              <img src={order?.product_details?.image} className="w-14 h-14" />
              <p className="font-medium">{order?.product_details?.name}</p>
            </div>
          </div>
        ))
      ) : (
        <NoData />
      )}
    </div>
  );
};

export default MyOrders;
