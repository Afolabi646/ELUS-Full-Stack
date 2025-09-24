import React, { useState, useEffect } from "react";
import axios from "axios";
import NoData from "../components/NoData";

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("/api/order/all-orders");
        console.log("API Response:", response.data);
        setOrders(response.data.data);
        console.log("Orders state:", response.data.data);
      } catch (error) {
        setError(error.message);
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <div className="bg-white shadow-md p-3 font-semibold">
        <h1>Manage Orders</h1>
      </div>
      {orders?.length > 0 ? (
        orders.map((order, index) => (
          <div
            key={order._id + index + "order"}
            className="border rounded p-4 text-sm"
          >
            <p>Order No: {order?.orderId}</p>
            <div className="flex gap-3">
              <img src={order?.product_details?.image} className="w-14 h-14" />
              <p className="font-medium">{order?.product_details?.name}</p>
            </div>
            <p>
              {" "}
              Customer: {order?.user_name} ({order?.user_email}){" "}
            </p>
            <p>
              {" "}
              Address: {order?.delivery_address_details?.address_line_1},{" "}
              {order?.delivery_address_details?.city},{" "}
              {order?.delivery_address_details?.state}{" "}
              {order?.delivery_address_details?.postal_code}{" "}
            </p>
            <p>Order Date: {new Date(order?.createdAt).toLocaleString()}</p>
            <p>Status: {order?.payment_status}</p>
          </div>
        ))
      ) : (
        <NoData />
      )}
    </div>
  );
};

export default ManageOrders;
