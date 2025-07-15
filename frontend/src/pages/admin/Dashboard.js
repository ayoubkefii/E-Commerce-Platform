import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  FiShoppingBag,
  FiUsers,
  FiDollarSign,
  FiTrendingUp,
  FiPackage,
  FiClock,
  FiEye,
  FiEdit,
  FiPlus,
} from "react-icons/fi";
import Layout from "../../components/layout/Layout";
import {
  getDashboardStats,
  getUserStats,
  getRecentOrders,
  updateOrderStatus,
} from "../../features/admin/adminSlice";
import { toast } from "react-toastify";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { dashboardStats, userStats, recentOrders, isLoading } = useSelector(
    (state) => state.admin
  );

  useEffect(() => {
    dispatch(getDashboardStats());
    dispatch(getUserStats());
    dispatch(getRecentOrders());
  }, [dispatch]);

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await dispatch(
        updateOrderStatus({ orderId, statusData: { status: newStatus } })
      ).unwrap();
      toast.success("Order status updated successfully");
    } catch (error) {
      toast.error("Failed to update order status");
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "processing":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "shipped":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      case "delivered":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const stats = [
    {
      title: "Total Orders",
      value: dashboardStats?.stats?.totalOrders || 0,
      icon: FiShoppingBag,
      color: "bg-blue-500",
      change: "+12%",
      changeType: "positive",
    },
    {
      title: "Total Revenue",
      value: formatPrice(dashboardStats?.stats?.totalRevenue || 0),
      icon: FiDollarSign,
      color: "bg-green-500",
      change: "+8%",
      changeType: "positive",
    },
    {
      title: "Total Users",
      value: userStats?.totalUsers || 0,
      icon: FiUsers,
      color: "bg-purple-500",
      change: "+15%",
      changeType: "positive",
    },
    {
      title: "Average Order",
      value: formatPrice(dashboardStats?.stats?.averageOrderValue || 0),
      icon: FiTrendingUp,
      color: "bg-orange-500",
      change: "+5%",
      changeType: "positive",
    },
  ];

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-lg p-6">
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
                  <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/3"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Welcome back! Here's what's happening with your store today.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {stat.value}
                  </p>
                  <p
                    className={`text-sm mt-2 ${
                      stat.changeType === "positive"
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}>
                    {stat.change} from last month
                  </p>
                </div>
                <div className={`p-3 rounded-full ${stat.color} text-white`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Recent Orders */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Recent Orders
                </h2>
                <Link
                  to="/admin/orders"
                  className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium">
                  View All
                </Link>
              </div>
            </div>
            <div className="p-6">
              {recentOrders.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                  No recent orders
                </p>
              ) : (
                <div className="space-y-4">
                  {recentOrders.slice(0, 5).map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            <FiPackage className="w-5 h-5 text-gray-400" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              Order #{order.order_number}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {order.user?.name || "Unknown User"}
                            </p>
                            <p className="text-xs text-gray-400 dark:text-gray-500">
                              {formatDate(order.created_at)}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                            order.order_status
                          )}`}>
                          {order.order_status}
                        </span>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {formatPrice(order.total)}
                        </p>
                        <div className="flex space-x-1">
                          <button
                            onClick={() =>
                              handleStatusUpdate(order.id, "processing")
                            }
                            className="p-1 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                            title="Mark as Processing">
                            <FiClock className="w-4 h-4" />
                          </button>
                          <Link
                            to={`/admin/orders/${order.id}`}
                            className="p-1 text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                            title="View Details">
                            <FiEye className="w-4 h-4" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Quick Actions
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 gap-4">
                <Link
                  to="/admin/products"
                  className="flex items-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                  <FiPlus className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                      Add New Product
                    </p>
                    <p className="text-xs text-blue-700 dark:text-blue-300">
                      Create a new product listing
                    </p>
                  </div>
                </Link>

                <Link
                  to="/admin/orders"
                  className="flex items-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
                  <FiEdit className="w-5 h-5 text-green-600 dark:text-green-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-green-900 dark:text-green-100">
                      Manage Orders
                    </p>
                    <p className="text-xs text-green-700 dark:text-green-300">
                      View and update order status
                    </p>
                  </div>
                </Link>

                <Link
                  to="/admin/users"
                  className="flex items-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors">
                  <FiUsers className="w-5 h-5 text-purple-600 dark:text-purple-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-purple-900 dark:text-purple-100">
                      Manage Users
                    </p>
                    <p className="text-xs text-purple-700 dark:text-purple-300">
                      View and manage user accounts
                    </p>
                  </div>
                </Link>

                <Link
                  to="/admin/products"
                  className="flex items-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors">
                  <FiShoppingBag className="w-5 h-5 text-orange-600 dark:text-orange-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-orange-900 dark:text-orange-100">
                      Product Catalog
                    </p>
                    <p className="text-xs text-orange-700 dark:text-orange-300">
                      Manage your product inventory
                    </p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Order Status Summary */}
        {dashboardStats?.statusStats && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Order Status Summary
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {dashboardStats.statusStats.map((status, index) => (
                  <div key={index} className="text-center">
                    <div
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        status.order_status
                      )}`}>
                      {status.order_status}
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                      {status.count}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AdminDashboard;
