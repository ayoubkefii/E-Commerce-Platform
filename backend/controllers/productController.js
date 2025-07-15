const Product = require("../models/Product");
const Review = require("../models/Review");
const Question = require("../models/Question");
const Answer = require("../models/Answer");
const { validationResult } = require("express-validator");
const { Op } = require("sequelize");

// @desc    Get all products with filtering and pagination
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const offset = (page - 1) * limit;

    // Build filter object
    const where = { is_active: true };

    if (req.query.category) {
      where.category = req.query.category;
    }

    if (req.query.brand) {
      where.brand = req.query.brand;
    }

    if (req.query.minPrice || req.query.maxPrice) {
      where.price = {};
      if (req.query.minPrice) {
        where.price[Op.gte] = parseFloat(req.query.minPrice);
      }
      if (req.query.maxPrice) {
        where.price[Op.lte] = parseFloat(req.query.maxPrice);
      }
    }

    if (req.query.search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${req.query.search}%` } },
        { description: { [Op.like]: `%${req.query.search}%` } },
      ];
    }

    // Build sort object
    let order = [["created_at", "DESC"]];
    if (req.query.sort) {
      switch (req.query.sort) {
        case "price_asc":
          order = [["price", "ASC"]];
          break;
        case "price_desc":
          order = [["price", "DESC"]];
          break;
        case "rating":
          order = [["average_rating", "DESC"]];
          break;
        case "name":
          order = [["name", "ASC"]];
          break;
        default:
          order = [["created_at", "DESC"]];
      }
    }

    // Execute query
    const { count, rows: products } = await Product.findAndCountAll({
      where,
      order,
      offset,
      limit,
      attributes: { exclude: ["reviews"] },
    });

    res.json({
      products,
      pagination: {
        page,
        limit,
        total: count,
        pages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    console.error("Get products error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (!product.is_active) {
      return res.status(404).json({ message: "Product not available" });
    }

    // Fetch reviews with user info
    const reviews = await Review.findAll({
      where: { product_id: product.id },
      include: [
        {
          model: require("../models/User"),
          as: "user",
          attributes: ["id", "name", "avatar"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    // Return product with reviews
    res.json({
      ...product.toJSON(),
      reviews,
    });
  } catch (error) {
    console.error("Get product error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const {
      name,
      description,
      price,
      compare_price,
      category,
      subcategory,
      brand,
      stock,
      sku,
      weight,
      length,
      width,
      height,
      tags,
      specifications,
      is_featured,
      discount,
      discount_end_date,
      free_shipping,
      shipping_cost,
    } = req.body;

    // Handle image uploads
    let main_image = null;

    if (req.files && req.files.main_image && req.files.main_image.length > 0) {
      main_image =
        req.files.main_image[0].url ||
        `/uploads/${req.files.main_image[0].filename}`;
    } else if (req.file) {
      main_image = req.file.url || `/uploads/${req.file.filename}`;
    }

    // Generate SKU if not provided
    const generatedSku =
      sku ||
      `${(category || "PROD").substring(0, 3).toUpperCase()}-${Date.now()}`;

    // Prepare product data with safe defaults
    const productData = {
      name: name || "",
      description: description || "",
      price: parseFloat(price) || 0,
      category: category || "Electronics",
      brand: brand || "",
      main_image: main_image || "",
      stock: parseInt(stock) || 0,
      sku: generatedSku,
      is_active: true,
      is_featured: false,
      discount: 0,
      free_shipping: false,
      shipping_cost: 0,
    };

    // Add optional fields only if they exist
    if (compare_price) productData.compare_price = parseFloat(compare_price);
    if (subcategory) productData.subcategory = subcategory;
    if (weight) productData.weight = parseFloat(weight);
    if (length) productData.length = parseFloat(length);
    if (width) productData.width = parseFloat(width);
    if (height) productData.height = parseFloat(height);
    if (discount) productData.discount = parseFloat(discount);
    if (shipping_cost) productData.shipping_cost = parseFloat(shipping_cost);
    if (is_featured) productData.is_featured = is_featured === "true";
    if (free_shipping) productData.free_shipping = free_shipping === "true";
    if (discount_end_date) productData.discount_end_date = discount_end_date;

    // Handle tags safely
    if (tags) {
      try {
        productData.tags = JSON.stringify(
          tags.split(",").map((tag) => tag.trim())
        );
      } catch (error) {
        productData.tags = "[]";
      }
    } else {
      productData.tags = "[]";
    }

    // Handle specifications safely
    if (specifications) {
      try {
        productData.specifications = JSON.stringify(JSON.parse(specifications));
      } catch (error) {
        productData.specifications = "{}";
      }
    } else {
      productData.specifications = "{}";
    }

    console.log("Creating product with data:", productData);

    const product = await Product.create(productData);

    res.status(201).json(product);
  } catch (error) {
    console.error("Create product error:", error);
    console.error("Request body:", req.body);
    console.error("Request files:", req.files);
    res.status(500).json({
      message: "Server error",
      details: error.message,
      stack: error.stack,
    });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const updateData = { ...req.body };

    // Handle image uploads
    if (req.files && req.files.main_image && req.files.main_image.length > 0) {
      updateData.main_image =
        req.files.main_image[0].url ||
        `/uploads/${req.files.main_image[0].filename}`;
    } else if (req.file) {
      updateData.main_image = req.file.url || `/uploads/${req.file.filename}`;
    }

    // Handle tags and specifications
    if (updateData.tags) {
      updateData.tags = JSON.stringify(
        updateData.tags.split(",").map((tag) => tag.trim())
      );
    }

    if (updateData.specifications) {
      updateData.specifications = JSON.stringify(
        JSON.parse(updateData.specifications)
      );
    }

    // Convert boolean strings to actual booleans
    if (updateData.is_featured !== undefined) {
      updateData.is_featured = updateData.is_featured === "true";
    }

    if (updateData.free_shipping !== undefined) {
      updateData.free_shipping = updateData.free_shipping === "true";
    }

    await product.update(updateData);

    res.json(product);
  } catch (error) {
    console.error("Update product error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await product.destroy();

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
const getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      where: { is_featured: true, is_active: true },
      limit: 8,
      order: [["created_at", "DESC"]],
    });

    res.json(products);
  } catch (error) {
    console.error("Get featured products error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get products by category
// @route   GET /api/products/category/:category
// @access  Public
const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const offset = (page - 1) * limit;

    const { count, rows: products } = await Product.findAndCountAll({
      where: { category, is_active: true },
      offset,
      limit,
      order: [["created_at", "DESC"]],
    });

    res.json({
      products,
      pagination: {
        page,
        limit,
        total: count,
        pages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    console.error("Get products by category error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Add product review
// @route   POST /api/products/:id/reviews
// @access  Private
const addProductReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const productId = req.params.id;

    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({
      where: { product_id: productId, user_id: req.user.id },
    });

    if (existingReview) {
      return res
        .status(400)
        .json({ message: "You have already reviewed this product" });
    }

    // Create review
    const review = await Review.create({
      product_id: productId,
      user_id: req.user.id,
      rating,
      comment,
    });

    // Update product average rating
    const reviews = await Review.findAll({
      where: { product_id: productId },
    });

    const averageRating =
      reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

    await product.update({
      average_rating: averageRating,
      num_reviews: reviews.length,
    });

    res.status(201).json(review);
  } catch (error) {
    console.error("Add product review error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Update product review
// @route   PUT /api/products/:id/reviews/:reviewId
// @access  Private
const updateProductReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const { id: productId, reviewId } = req.params;

    const review = await Review.findOne({
      where: { id: reviewId, product_id: productId, user_id: req.user.id },
    });

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    await review.update({ rating, comment });

    // Update product average rating
    const product = await Product.findByPk(productId);
    const reviews = await Review.findAll({
      where: { product_id: productId },
    });

    const averageRating =
      reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

    await product.update({
      average_rating: averageRating,
      num_reviews: reviews.length,
    });

    res.json(review);
  } catch (error) {
    console.error("Update product review error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Delete product review
// @route   DELETE /api/products/:id/reviews/:reviewId
// @access  Private
const deleteProductReview = async (req, res) => {
  try {
    const { id: productId, reviewId } = req.params;

    const review = await Review.findOne({
      where: { id: reviewId, product_id: productId, user_id: req.user.id },
    });

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    await review.destroy();

    // Update product average rating
    const product = await Product.findByPk(productId);
    const reviews = await Review.findAll({
      where: { product_id: productId },
    });

    const averageRating =
      reviews.length > 0
        ? reviews.reduce((sum, review) => sum + review.rating, 0) /
          reviews.length
        : 0;

    await product.update({
      average_rating: averageRating,
      num_reviews: reviews.length,
    });

    res.json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Delete product review error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get all categories
// @route   GET /api/products/categories
// @access  Public
const getCategories = async (req, res) => {
  try {
    const categories = await Product.findAll({
      attributes: [
        [
          Product.sequelize.fn("DISTINCT", Product.sequelize.col("category")),
          "category",
        ],
      ],
      where: { is_active: true },
    });

    res.json(categories.map((cat) => cat.getDataValue("category")));
  } catch (error) {
    console.error("Get categories error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get all brands
// @route   GET /api/products/brands
// @access  Public
const getBrands = async (req, res) => {
  try {
    const brands = await Product.findAll({
      attributes: [
        [
          Product.sequelize.fn("DISTINCT", Product.sequelize.col("brand")),
          "brand",
        ],
      ],
      where: { is_active: true },
    });

    res.json(brands.map((brand) => brand.getDataValue("brand")));
  } catch (error) {
    console.error("Get brands error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all questions for a product (with answers)
const getProductQuestions = async (req, res) => {
  try {
    const questions = await Question.findAll({
      where: { product_id: req.params.id },
      include: [
        {
          model: require("../models/User"),
          as: "user",
          attributes: ["id", "name", "avatar"],
        },
        {
          model: Answer,
          as: "answers",
          include: [
            {
              model: require("../models/User"),
              as: "user",
              attributes: ["id", "name", "avatar"],
            },
          ],
          order: [["createdAt", "ASC"]],
        },
      ],
      order: [["createdAt", "DESC"]],
    });
    res.json(questions);
  } catch (error) {
    console.error("Get product questions error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Ask a question
const askProductQuestion = async (req, res) => {
  try {
    const { question } = req.body;
    if (!question || question.length < 3) {
      return res.status(400).json({ message: "Question is too short" });
    }
    const q = await Question.create({
      product_id: req.params.id,
      user_id: req.user.id,
      question,
    });
    const withUser = await Question.findByPk(q.id, {
      include: [
        {
          model: require("../models/User"),
          as: "user",
          attributes: ["id", "name", "avatar"],
        },
      ],
    });
    res.status(201).json(withUser);
  } catch (error) {
    console.error("Ask product question error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Admin answers a question
const answerProductQuestion = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Only admin can answer questions" });
    }
    const { answer } = req.body;
    const question = await Question.findOne({
      where: { id: req.params.questionId, product_id: req.params.id },
    });
    if (!question)
      return res.status(404).json({ message: "Question not found" });
    question.answer = answer;
    await question.save();
    const withUser = await Question.findByPk(question.id, {
      include: [
        {
          model: require("../models/User"),
          as: "user",
          attributes: ["id", "name", "avatar"],
        },
      ],
    });
    res.json(withUser);
  } catch (error) {
    console.error("Answer product question error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Add answer to a question (any user)
const addAnswerToQuestion = async (req, res) => {
  try {
    const { answer } = req.body;
    if (!answer || answer.length < 1) {
      return res.status(400).json({ message: "Answer is too short" });
    }
    const question = await Question.findOne({
      where: { id: req.params.questionId, product_id: req.params.id },
    });
    if (!question)
      return res.status(404).json({ message: "Question not found" });
    const a = await Answer.create({
      question_id: question.id,
      user_id: req.user.id,
      answer,
    });
    const withUser = await Answer.findByPk(a.id, {
      include: [
        {
          model: require("../models/User"),
          as: "user",
          attributes: ["id", "name", "avatar"],
        },
      ],
    });
    // (In-app notification logic would go here)
    res.status(201).json(withUser);
  } catch (error) {
    console.error("Add answer error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a question (admin or owner)
const deleteProductQuestion = async (req, res) => {
  try {
    const question = await Question.findOne({
      where: { id: req.params.questionId, product_id: req.params.id },
    });
    if (!question)
      return res.status(404).json({ message: "Question not found" });
    if (req.user.role !== "admin" && req.user.id !== question.user_id) {
      return res.status(403).json({ message: "Not authorized" });
    }
    await Answer.destroy({ where: { question_id: question.id } });
    await question.destroy();
    res.json({ message: "Question deleted" });
  } catch (error) {
    console.error("Delete question error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete an answer (admin or answer owner)
const deleteAnswer = async (req, res) => {
  try {
    const answer = await Answer.findOne({
      where: { id: req.params.answerId, question_id: req.params.questionId },
    });
    if (!answer) return res.status(404).json({ message: "Answer not found" });
    if (req.user.role !== "admin" && req.user.id !== answer.user_id) {
      return res.status(403).json({ message: "Not authorized" });
    }
    await answer.destroy();
    res.json({ message: "Answer deleted" });
  } catch (error) {
    console.error("Delete answer error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get latest products
// @route   GET /api/products/latest
// @access  Public
const getLatestProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      where: { is_active: true },
      limit: 8,
      order: [["created_at", "DESC"]],
    });
    res.json(products);
  } catch (error) {
    console.error("Get latest products error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get top rated products
// @route   GET /api/products/top-rated
// @access  Public
const getTopRatedProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      where: { is_active: true },
      limit: 8,
      order: [["average_rating", "DESC"]],
    });
    res.json(products);
  } catch (error) {
    console.error("Get top rated products error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
  getProductsByCategory,
  addProductReview,
  updateProductReview,
  deleteProductReview,
  getCategories,
  getBrands,
  getProductQuestions,
  askProductQuestion,
  answerProductQuestion,
  addAnswerToQuestion,
  deleteProductQuestion,
  deleteAnswer,
  getLatestProducts,
  getTopRatedProducts,
};
