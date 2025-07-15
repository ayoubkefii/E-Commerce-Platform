import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiMail,
  FiPhone,
  FiMapPin,
  FiFacebook,
  FiTwitter,
  FiInstagram,
  FiLinkedin,
  FiGithub,
  FiArrowUp,
  FiGift,
  FiShield,
  FiTruck,
  FiCreditCard,
  FiHeadphones,
  FiStar,
  FiTrendingUp,
  FiAward,
  FiUsers,
  FiPackage,
  FiHeart,
} from "react-icons/fi";

const Footer = () => {
  const [hoveredSection, setHoveredSection] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Handle scroll to top
  React.useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const features = [
    {
      icon: FiGift,
      title: "Free Gifts",
      description: "Get free gifts with every order",
    },
    {
      icon: FiShield,
      title: "Secure Payment",
      description: "100% secure payment processing",
    },
    {
      icon: FiTruck,
      title: "Fast Delivery",
      description: "Free shipping on orders over $50",
    },
    {
      icon: FiHeadphones,
      title: "24/7 Support",
      description: "Round the clock customer support",
    },
  ];

  const quickLinks = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
    { name: "About Us", path: "/about" },
    { name: "Contact", path: "/contact" },
    { name: "Blog", path: "/blog" },
    { name: "FAQ", path: "/faq" },
  ];

  const categories = [
    { name: "Electronics", path: "/products?category=Electronics" },
    { name: "Clothing", path: "/products?category=Clothing" },
    { name: "Books", path: "/products?category=Books" },
    { name: "Home & Garden", path: "/products?category=Home & Garden" },
    { name: "Sports", path: "/products?category=Sports" },
    { name: "Beauty", path: "/products?category=Beauty" },
  ];

  const socialLinks = [
    {
      icon: FiFacebook,
      href: "https://facebook.com",
      label: "Facebook",
      color: "hover:text-blue-500",
    },
    {
      icon: FiTwitter,
      href: "https://twitter.com",
      label: "Twitter",
      color: "hover:text-blue-400",
    },
    {
      icon: FiInstagram,
      href: "https://instagram.com",
      label: "Instagram",
      color: "hover:text-pink-500",
    },
    {
      icon: FiLinkedin,
      href: "https://linkedin.com",
      label: "LinkedIn",
      color: "hover:text-blue-600",
    },
    {
      icon: FiGithub,
      href: "https://github.com",
      label: "GitHub",
      color: "hover:text-gray-700 dark:hover:text-gray-300",
    },
  ];

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 right-1/4 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-0 left-1/2 w-24 h-24 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>

        {/* Floating particles */}
        <div className="absolute top-20 left-10 w-2 h-2 bg-blue-400 rounded-full animate-bounce opacity-30"></div>
        <div className="absolute top-40 right-20 w-1 h-1 bg-purple-400 rounded-full animate-ping opacity-40"></div>
        <div className="absolute bottom-40 left-20 w-1.5 h-1.5 bg-pink-400 rounded-full animate-pulse opacity-35"></div>
        <div className="absolute bottom-20 right-10 w-1 h-1 bg-yellow-400 rounded-full animate-bounce opacity-25"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="py-16 border-b border-gray-700/50">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="text-center group">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl mb-4 shadow-lg group-hover:shadow-2xl transition-all duration-300">
                  <feature.icon className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="text-lg font-semibold mb-2 text-white group-hover:text-blue-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="lg:col-span-1">
              <div className="flex items-center space-x-3 mb-6">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-xl">E</span>
                </motion.div>
                <span className="text-2xl font-bold bg-gradient-to-r from-white via-blue-400 to-purple-400 bg-clip-text text-transparent">
                  EStore
                </span>
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Your premier destination for quality products. We provide the
                best shopping experience with secure payments, fast delivery,
                and exceptional customer service.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="text-center p-3 bg-white/5 rounded-xl backdrop-blur-sm">
                  <div className="text-2xl font-bold text-blue-400">10K+</div>
                  <div className="text-xs text-gray-400">Happy Customers</div>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="text-center p-3 bg-white/5 rounded-xl backdrop-blur-sm">
                  <div className="text-2xl font-bold text-purple-400">500+</div>
                  <div className="text-xs text-gray-400">Products</div>
                </motion.div>
              </div>

              {/* Social Links */}
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.2, y: -3 }}
                    whileTap={{ scale: 0.9 }}
                    className={`w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center text-gray-400 ${social.color} transition-all duration-300 hover:bg-white/20`}>
                    <social.icon className="w-5 h-5" />
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              onHoverStart={() => setHoveredSection("quick")}
              onHoverEnd={() => setHoveredSection(null)}
              className="relative">
              <h3 className="text-lg font-semibold mb-6 flex items-center space-x-2">
                <FiTrendingUp className="w-5 h-5 text-blue-400" />
                <span>Quick Links</span>
              </h3>
              <ul className="space-y-3">
                {quickLinks.map((link, index) => (
                  <motion.li
                    key={link.name}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ x: 5 }}
                    className="transition-all duration-300">
                    <Link
                      to={link.path}
                      className="text-gray-400 hover:text-blue-400 transition-colors duration-300 flex items-center space-x-2 group">
                      <div className="w-1 h-1 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <span>{link.name}</span>
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Categories */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              onHoverStart={() => setHoveredSection("categories")}
              onHoverEnd={() => setHoveredSection(null)}
              className="relative">
              <h3 className="text-lg font-semibold mb-6 flex items-center space-x-2">
                <FiPackage className="w-5 h-5 text-purple-400" />
                <span>Categories</span>
              </h3>
              <ul className="space-y-3">
                {categories.map((category, index) => (
                  <motion.li
                    key={category.name}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ x: 5 }}
                    className="transition-all duration-300">
                    <Link
                      to={category.path}
                      className="text-gray-400 hover:text-purple-400 transition-colors duration-300 flex items-center space-x-2 group">
                      <div className="w-1 h-1 bg-purple-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <span>{category.name}</span>
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
              onHoverStart={() => setHoveredSection("contact")}
              onHoverEnd={() => setHoveredSection(null)}
              className="relative">
              <h3 className="text-lg font-semibold mb-6 flex items-center space-x-2">
                <FiUsers className="w-5 h-5 text-pink-400" />
                <span>Contact Us</span>
              </h3>
              <div className="space-y-4">
                <motion.div
                  whileHover={{ x: 5 }}
                  className="flex items-center space-x-3 text-gray-400 hover:text-pink-400 transition-colors duration-300">
                  <FiMapPin className="w-5 h-5 text-pink-400 flex-shrink-0" />
                  <span className="text-sm">
                    123 Store Street, City, Country
                  </span>
                </motion.div>
                <motion.div
                  whileHover={{ x: 5 }}
                  className="flex items-center space-x-3 text-gray-400 hover:text-pink-400 transition-colors duration-300">
                  <FiPhone className="w-5 h-5 text-pink-400 flex-shrink-0" />
                  <span className="text-sm">+1 234 567 890</span>
                </motion.div>
                <motion.div
                  whileHover={{ x: 5 }}
                  className="flex items-center space-x-3 text-gray-400 hover:text-pink-400 transition-colors duration-300">
                  <FiMail className="w-5 h-5 text-pink-400 flex-shrink-0" />
                  <span className="text-sm">info@estore.com</span>
                </motion.div>
              </div>

              {/* Newsletter */}
              <div className="mt-6">
                <h4 className="text-sm font-semibold mb-3 text-white">
                  Newsletter
                </h4>
                <div className="flex space-x-2">
                  <input
                    type="email"
                    placeholder="Your email"
                    className="flex-1 px-3 py-2 bg-white/10 backdrop-blur-sm border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl">
                    <FiMail className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          viewport={{ once: true }}
          className="py-8 border-t border-gray-700/50">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-6">
              <p className="text-gray-400 text-sm">
                © 2024 EStore. All rights reserved.
              </p>
              <div className="flex items-center space-x-4 text-sm">
                <Link
                  to="/privacy"
                  className="text-gray-400 hover:text-blue-400 transition-colors">
                  Privacy Policy
                </Link>
                <Link
                  to="/terms"
                  className="text-gray-400 hover:text-blue-400 transition-colors">
                  Terms of Service
                </Link>
                <Link
                  to="/shipping"
                  className="text-gray-400 hover:text-blue-400 transition-colors">
                  Shipping Info
                </Link>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <FiAward className="w-4 h-4 text-yellow-400" />
                <span>Trusted by 10K+ customers</span>
              </div>
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.2, rotate: 10 }}
                    className="text-yellow-400">
                    <FiStar className="w-4 h-4 fill-current" />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            whileHover={{ scale: 1.1, y: -3 }}
            whileTap={{ scale: 0.9 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 z-50 flex items-center justify-center">
            <FiArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </footer>
  );
};

export default Footer;
