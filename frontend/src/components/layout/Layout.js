import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import ProductComparison from "../products/ProductComparison";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="flex-1 pt-16 lg:pt-20">{children}</main>
      <Footer />
      <ProductComparison />
    </div>
  );
};

export default Layout;
