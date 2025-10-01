import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import NoData from "../components/NoData";
import { Link } from "react-router-dom";

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const reduxOrders = useSelector((state) => state.order?.order);

  console.log("Redux Orders:", reduxOrders);

  useEffect(() => {
    console.log("Fetching orders...");
    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/order/all-orders");
        if (!response.ok) {
          throw new Error(`Error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("API Response:", data);
        setOrders(data?.data || []);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setError(error.message);
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

  console.log("Orders State:", orders);

  return (
    <div>
      <div className="bg-white shadow-md p-3 font-semibold">
        <h1>Manage Orders</h1>
      </div>
    
{
  Array.isArray(orders) && orders.length > 0 ? (
    orders.map((order) => (
      <div key={order._id} className="border rounded p-4 text-sm mb-4">
        <Link to={`/orders/${order._id}`}>
          <p>Customer: {order.userId?.name}</p>
          <p>Email: {order.userId?.email}</p>
          <p>Order Date: {new Date(order.createdAt).toLocaleString()}</p>
        </Link>
      </div>
    ))
  ) : (
    <NoData />
  )
}

    </div>
  );
};

export default ManageOrders;
