import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Layout from "../components/layout/Layout";
import { getUserOrders } from "../features/orders/orderSlice";
import { Link } from "react-router-dom";

const Orders = () => {
  const dispatch = useDispatch();
  const { orders, isLoading, isError, message } = useSelector(
    (state) => state.orders
  );

  useEffect(() => {
    dispatch(getUserOrders());
  }, [dispatch]);

  if (isLoading) {
    return (
      <Layout>
        <div className="text-center py-12">Loading orders...</div>
      </Layout>
    );
  }

  if (isError) {
    return (
      <Layout>
        <div className="text-center py-12 text-red-500">
          {message || "Error loading orders."}
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
          My Orders
        </h1>
        {!orders || orders.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            You have no orders yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg shadow">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left">Order #</th>
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Total</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order.id || order._id}
                    className="border-t border-gray-200 dark:border-gray-700">
                    <td className="px-4 py-2">{order.id || order._id}</td>
                    <td className="px-4 py-2">
                      {new Date(
                        order.createdAt || order.created_at
                      ).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2 capitalize">{order.status}</td>
                    <td className="px-4 py-2 font-semibold">${order.total}</td>
                    <td className="px-4 py-2">
                      <Link
                        to={`/orders/${order.id || order._id}`}
                        className="text-blue-600 hover:underline">
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Orders;
