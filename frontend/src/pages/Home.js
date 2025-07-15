import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  FiArrowRight,
  FiStar,
  FiTruck,
  FiShield,
  FiRefreshCw,
  FiChevronLeft,
  FiChevronRight,
  FiShoppingBag,
  FiHeart,
  FiTrendingUp,
  FiAward,
  FiZap,
  FiGift,
  FiCheckCircle,
  FiUsers,
  FiGlobe,
  FiClock,
  FiMapPin,
} from "react-icons/fi";

// Components
import Layout from "../components/layout/Layout";
import ProductGrid from "../components/products/ProductGrid";

// Redux
import {
  getFeaturedProducts,
  getLatestProducts,
  getTopRatedProducts,
} from "../features/products/productSlice";

const heroSlides = [
  {
    image:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200",
    title: "Summer Collection 2024",
    subtitle: "Discover the latest trends in fashion",
    cta: "Explore Collection",
    link: "/products",
    gradient: "from-pink-500 via-purple-500 to-indigo-500",
  },
  {
    image:
      "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1200",
    title: "Tech Innovation",
    subtitle: "Cutting-edge electronics at unbeatable prices",
    cta: "Shop Tech",
    link: "/products?category=Electronics",
    gradient: "from-blue-500 via-cyan-500 to-teal-500",
  },
  {
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200",
    title: "Premium Lifestyle",
    subtitle: "Elevate your everyday with premium products",
    cta: "Discover More",
    link: "/products?sort=rating",
    gradient: "from-orange-500 via-red-500 to-pink-500",
  },
];

function ParticleBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-white rounded-full opacity-20"
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            delay: Math.random() * 5,
          }}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        />
      ))}
    </div>
  );
}

function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 300], [0, 100]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + heroSlides.length) % heroSlides.length
    );
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <ParticleBackground />

      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="absolute inset-0 w-full h-full">
          <img
            src={heroSlides[currentSlide].image}
            alt={heroSlides[currentSlide].title}
            className="w-full h-full object-cover object-center"
          />
          <div
            className={`absolute inset-0 bg-gradient-to-r ${heroSlides[currentSlide].gradient} bg-opacity-60`}
          />

          <motion.div
            style={{ y }}
            className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="max-w-4xl mx-auto">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight">
                {heroSlides[currentSlide].title}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="text-xl md:text-2xl lg:text-3xl text-white/90 mb-8 font-light">
                {heroSlides[currentSlide].subtitle}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}>
                <Link
                  to={heroSlides[currentSlide].link}
                  className="group inline-flex items-center px-8 py-4 bg-white/20 backdrop-blur-md text-white font-semibold rounded-full hover:bg-white/30 transition-all duration-300 border border-white/30 hover:border-white/50 shadow-2xl hover:shadow-white/20">
                  {heroSlides[currentSlide].cta}
                  <FiArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white p-4 rounded-full transition-all duration-300 border border-white/20 hover:border-white/40">
        <FiChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white p-4 rounded-full transition-all duration-300 border border-white/20 hover:border-white/40">
        <FiChevronRight className="w-6 h-6" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-4 h-4 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "bg-white scale-125"
                : "bg-white/50 hover:bg-white/75"
            }`}
          />
        ))}
      </div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 right-8 text-white/70">
        <div className="flex flex-col items-center">
          <span className="text-sm mb-2">Scroll</span>
          <div className="w-px h-8 bg-white/50" />
        </div>
      </motion.div>
    </div>
  );
}

function StatsSection() {
  const stats = [
    { number: "50K+", label: "Happy Customers", icon: FiUsers },
    { number: "1000+", label: "Products", icon: FiShoppingBag },
    { number: "24/7", label: "Support", icon: FiGlobe },
    { number: "99%", label: "Satisfaction", icon: FiAward },
  ];

  return (
    <section className="py-20 bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 relative overflow-hidden">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[length:20px_20px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="text-center group">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-all duration-300 hover:bg-white/20">
                <stat.icon className="w-8 h-8 text-white/80 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {stat.number}
                </div>
                <div className="text-white/70 text-sm font-medium">
                  {stat.label}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

const Home = () => {
  const dispatch = useDispatch();
  const {
    featuredProducts,
    latestProducts,
    topRatedProducts,
    isLoading,
    isError,
  } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(getFeaturedProducts());
    dispatch(getLatestProducts());
    dispatch(getTopRatedProducts());
  }, [dispatch]);

  const features = [
    {
      icon: <FiTruck className="w-8 h-8" />,
      title: "Free Shipping",
      description: "Free shipping on orders over $50",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: <FiShield className="w-8 h-8" />,
      title: "Secure Payment",
      description: "100% secure payment processing",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      icon: <FiRefreshCw className="w-8 h-8" />,
      title: "Easy Returns",
      description: "30-day hassle-free return policy",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: <FiStar className="w-8 h-8" />,
      title: "Quality Products",
      description: "Curated selection of premium products",
      gradient: "from-orange-500 to-red-500",
    },
  ];

  const categories = [
    {
      name: "Electronics",
      image:
        "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400",
      count: 150,
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      name: "Fashion",
      image:
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400",
      count: 200,
      gradient: "from-pink-500 to-purple-500",
    },
    {
      name: "Home & Garden",
      image:
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400",
      count: 100,
      gradient: "from-green-500 to-emerald-500",
    },
    {
      name: "Sports",
      image:
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
      count: 80,
      gradient: "from-orange-500 to-red-500",
    },
  ];

  const testimonials = [
    {
      name: "Sarah M.",
      text: "Amazing store! Fast shipping and great products. Highly recommend!",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      rating: 5,
    },
    {
      name: "John D.",
      text: "Customer service was super helpful. Will shop again!",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      rating: 5,
    },
    {
      name: "Emily R.",
      text: "Love the variety and quality. My go-to shop online.",
      avatar: "https://randomuser.me/api/portraits/women/68.jpg",
      rating: 5,
    },
  ];

  function FeaturesSection() {
    return (
      <section className="py-24 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Why Choose Us
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              We provide the best shopping experience with premium quality
              products and exceptional service
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="group">
                <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-gray-700 hover:border-transparent relative overflow-hidden">
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
                  />

                  <div
                    className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    {feature.icon}
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 text-center">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-center leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  function CategoriesSection() {
    return (
      <section className="py-24 bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[length:20px_20px]" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Shop by Category
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Explore our curated collections across various categories
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="group relative">
                <div className="relative overflow-hidden rounded-3xl shadow-2xl group-hover:shadow-3xl transition-all duration-500">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div
                    className={`absolute inset-0 bg-gradient-to-t ${category.gradient} bg-opacity-80`}
                  />

                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                    <h3 className="text-2xl font-bold text-white mb-2 group-hover:scale-110 transition-transform duration-300">
                      {category.name}
                    </h3>
                    <p className="text-white/90 text-lg font-medium">
                      {category.count} products
                    </p>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileHover={{ opacity: 1, y: 0 }}
                      className="mt-4">
                      <Link
                        to={`/products?category=${category.name}`}
                        className="inline-flex items-center px-6 py-3 bg-white/20 backdrop-blur-md text-white font-semibold rounded-full hover:bg-white/30 transition-all duration-300 border border-white/30">
                        Explore
                        <FiArrowRight className="ml-2 w-4 h-4" />
                      </Link>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  function ProductSection({ title, products, loading, error, link, gradient }) {
    return (
      <section
        className={`py-24 bg-gradient-to-br ${gradient} relative overflow-hidden`}>
        <div className="absolute inset-0 bg-black/20" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex justify-between items-center mb-12">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-2">
                {title}
              </h2>
              <div className="w-20 h-1 bg-white rounded-full" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}>
              <Link
                to={link}
                className="group inline-flex items-center px-6 py-3 bg-white/20 backdrop-blur-md text-white font-semibold rounded-full hover:bg-white/30 transition-all duration-300 border border-white/30">
                View All
                <FiArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}>
            <ProductGrid products={products} loading={loading} error={error} />
          </motion.div>
        </div>
      </section>
    );
  }

  function TestimonialsSection() {
    const [currentTestimonial, setCurrentTestimonial] = useState(0);

    useEffect(() => {
      const timer = setInterval(() => {
        setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
      }, 5000);

      return () => clearInterval(timer);
    }, []);

    return (
      <section className="py-24 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              What Our Customers Say
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Don't just take our word for it - hear from our satisfied
              customers
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonial}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.8 }}
                className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-12 border border-gray-100 dark:border-gray-700">
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-8">
                    <img
                      src={testimonials[currentTestimonial].avatar}
                      alt={testimonials[currentTestimonial].name}
                      className="w-24 h-24 rounded-full border-4 border-white shadow-xl"
                    />
                    <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full p-2">
                      <FiStar className="w-4 h-4 text-white" />
                    </div>
                  </div>

                  <div className="flex mb-6">
                    {[...Array(testimonials[currentTestimonial].rating)].map(
                      (_, i) => (
                        <FiStar
                          key={i}
                          className="w-6 h-6 text-yellow-400 fill-current"
                        />
                      )
                    )}
                  </div>

                  <blockquote className="text-2xl text-gray-700 dark:text-gray-200 mb-8 leading-relaxed italic">
                    "{testimonials[currentTestimonial].text}"
                  </blockquote>

                  <div className="text-center">
                    <div className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {testimonials[currentTestimonial].name}
                    </div>
                    <div className="text-gray-500 dark:text-gray-400">
                      Verified Customer
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-center mt-8 space-x-3">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-4 h-4 rounded-full transition-all duration-300 ${
                    index === currentTestimonial
                      ? "bg-gradient-to-r from-yellow-400 to-orange-500 scale-125"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  function NewsletterSection() {
    return (
      <section className="py-24 bg-gradient-to-br from-purple-600 via-pink-600 to-red-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[length:20px_20px]" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Stay Updated!
              </h2>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Subscribe to our newsletter for exclusive deals, new product
                launches, and insider updates
              </p>
            </motion.div>

            <motion.form
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 w-full max-w-md mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 px-6 py-4 rounded-full text-gray-900 focus:outline-none focus:ring-4 focus:ring-white/30 shadow-xl"
                required
              />
              <button
                type="submit"
                className="px-8 py-4 bg-white text-purple-600 font-bold rounded-full hover:bg-gray-100 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105">
                Subscribe
              </button>
            </motion.form>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-8 text-white/80 text-sm">
              <FiCheckCircle className="inline w-4 h-4 mr-2" />
              No spam, unsubscribe at any time
            </motion.div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <Layout>
      <HeroSlider />
      <StatsSection />
      <FeaturesSection />
      <CategoriesSection />

      <ProductSection
        title="Featured Products"
        products={featuredProducts}
        loading={isLoading}
        error={isError}
        link="/products"
        gradient="from-blue-600 via-purple-600 to-indigo-600"
      />

      <ProductSection
        title="New Arrivals"
        products={latestProducts}
        loading={isLoading}
        error={isError}
        link="/products?sort=newest"
        gradient="from-green-600 via-teal-600 to-cyan-600"
      />

      <ProductSection
        title="Top Rated"
        products={topRatedProducts}
        loading={isLoading}
        error={isError}
        link="/products?sort=rating"
        gradient="from-orange-600 via-red-600 to-pink-600"
      />

      <TestimonialsSection />
      <NewsletterSection />
    </Layout>
  );
};

export default Home;
