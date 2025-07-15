import React from 'react';
import Layout from '../components/layout/Layout';

const OrderDetail = () => {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Order Detail
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            This page will show detailed order information, items purchased, shipping details, and order status.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default OrderDetail; 