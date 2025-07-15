const { Op } = require("sequelize");
const { sequelize } = require("../config/database");
const Product = require("../models/Product");
const Review = require("../models/Review");
const User = require("../models/User");
const { Parser } = require("json2csv");
const PDFDocument = require("pdfkit");
const ExcelJS = require("exceljs");

// @desc    Search products with advanced filters
// @route   GET /api/search/products
// @access  Public
const searchProducts = async (req, res) => {
  try {
    const {
      q = "",
      priceMin = 0,
      priceMax = 10000,
      brands = [],
      categories = [],
      ratings = [],
      availability = "all",
      sortBy = "relevance",
      page = 1,
      limit = 12,
      condition = "all",
      warranty = "all",
      freeShipping = false,
      onSale = false,
      location = "",
      tags = [],
      features = [],
    } = req.query;

    const offset = (page - 1) * limit;

    // Build where clause
    let whereClause = {};

    // Search query
    if (q) {
      whereClause[Op.or] = [
        { name: { [Op.like]: `%${q}%` } },
        { description: { [Op.like]: `%${q}%` } },
        { brand: { [Op.like]: `%${q}%` } },
        { tags: { [Op.like]: `%${q}%` } },
      ];
    }

    // Price range
    whereClause.price = {
      [Op.between]: [parseFloat(priceMin), parseFloat(priceMax)],
    };

    // Brands filter
    if (brands.length > 0) {
      whereClause.brand = { [Op.in]: brands };
    }

    // Categories filter
    if (categories.length > 0) {
      whereClause.category = { [Op.in]: categories };
    }

    // Availability filter
    if (availability === "inStock") {
      whereClause.stock = { [Op.gt]: 0 };
    } else if (availability === "outOfStock") {
      whereClause.stock = { [Op.eq]: 0 };
    }

    // Free shipping filter
    if (freeShipping === "true") {
      whereClause.free_shipping = true;
    }

    // Tags filter
    if (tags.length > 0) {
      whereClause.tags = { [Op.like]: `%${tags.join("%")}%` };
    }

    // Build order clause
    let orderClause = [];
    switch (sortBy) {
      case "priceLow":
        orderClause.push(["price", "ASC"]);
        break;
      case "priceHigh":
        orderClause.push(["price", "DESC"]);
        break;
      case "rating":
        orderClause.push(["average_rating", "DESC"]);
        break;
      case "newest":
        orderClause.push(["createdAt", "DESC"]);
        break;
      default:
        // Relevance - default sorting
        if (q) {
          orderClause.push([
            sequelize.literal(`CASE WHEN name LIKE '%${q}%' THEN 1 ELSE 2 END`),
            "ASC",
          ]);
        }
        orderClause.push(["average_rating", "DESC"]);
        orderClause.push(["createdAt", "DESC"]);
    }

    // Execute query
    const { count, rows: products } = await Product.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Review,
          as: "reviews",
          attributes: ["id", "rating"],
        },
      ],
      order: orderClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      distinct: true,
    });

    // Calculate average ratings
    const productsWithRating = products.map((product) => {
      const avgRating =
        product.reviews.length > 0
          ? product.reviews.reduce((sum, review) => sum + review.rating, 0) /
            product.reviews.length
          : 0;

      return {
        ...product.toJSON(),
        rating: Math.round(avgRating * 10) / 10,
        reviewCount: product.reviews.length,
      };
    });

    // Filter by ratings if specified
    let filteredProducts = productsWithRating;
    if (ratings.length > 0) {
      filteredProducts = productsWithRating.filter((product) =>
        ratings.includes(Math.floor(product.rating))
      );
    }

    res.json({
      products: filteredProducts,
      total: count,
      page: parseInt(page),
      totalPages: Math.ceil(count / limit),
      hasNext: page * limit < count,
      hasPrev: page > 1,
    });
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ message: "Search failed", error: error.message });
  }
};

// @desc    Get search suggestions
// @route   GET /api/search/suggestions
// @access  Public
const getSearchSuggestions = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.length < 2) {
      return res.json({ suggestions: [] });
    }

    // Get product name suggestions
    const productSuggestions = await Product.findAll({
      where: {
        name: { [Op.like]: `%${q}%` },
      },
      attributes: ["name"],
      limit: 3,
    });

    // Get brand suggestions
    const brandSuggestions = await Product.findAll({
      where: {
        brand: { [Op.like]: `%${q}%` },
      },
      attributes: ["brand"],
      limit: 3,
    });

    // Get category suggestions
    const categorySuggestions = await Product.findAll({
      where: {
        category: { [Op.like]: `%${q}%` },
      },
      attributes: ["category"],
      limit: 3,
    });

    const suggestions = [
      ...productSuggestions.map((p) => p.name),
      ...brandSuggestions.map((p) => p.brand),
      ...categorySuggestions.map((p) => p.category),
    ];

    // Remove duplicates and limit
    const uniqueSuggestions = [...new Set(suggestions)].slice(0, 8);

    res.json({ suggestions: uniqueSuggestions });
  } catch (error) {
    console.error("Suggestions error:", error);
    res
      .status(500)
      .json({ message: "Failed to get suggestions", error: error.message });
  }
};

// @desc    Get trending searches
// @route   GET /api/search/trending
// @access  Public
const getTrendingSearches = async (req, res) => {
  try {
    // This would typically come from analytics data
    // For now, we'll return some sample trending searches
    const trendingSearches = [
      "iPhone 15",
      "wireless headphones",
      "gaming laptop",
      "smart watch",
      "wireless earbuds",
      "4K TV",
      "gaming console",
      "tablet",
    ];

    res.json({ trending: trendingSearches });
  } catch (error) {
    console.error("Trending searches error:", error);
    res.status(500).json({
      message: "Failed to get trending searches",
      error: error.message,
    });
  }
};

// @desc    Get search analytics
// @route   GET /api/search/analytics
// @access  Private
const getSearchAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;

    // This would typically come from a search analytics database
    // For now, we'll return sample analytics data
    const analytics = {
      totalSearches: 1250,
      popularSearches: [
        { query: "iPhone 15", count: 156 },
        { query: "wireless headphones", count: 89 },
        { query: "gaming laptop", count: 67 },
        { query: "smart watch", count: 45 },
        { query: "wireless earbuds", count: 34 },
      ],
      searchPerformance: {
        avgSearchTime: "2.3s",
        conversionRate: "12.5%",
        bounceRate: "23.4%",
      },
      userBehavior: {
        avgSearchTime: "2.3s",
        searchesPerSession: 3.2,
        popularCategories: ["Electronics", "Clothing", "Home & Garden"],
      },
      conversionRates: {
        overall: "12.5%",
        byCategory: {
          Electronics: "15.2%",
          Clothing: "8.7%",
          "Home & Garden": "11.3%",
        },
      },
    };

    res.json(analytics);
  } catch (error) {
    console.error("Analytics error:", error);
    res
      .status(500)
      .json({ message: "Failed to get analytics", error: error.message });
  }
};

// @desc    Get search insights
// @route   GET /api/search/insights
// @access  Public
const getSearchInsights = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.json({
        relatedSearches: [],
        popularCategories: [],
        trendingProducts: [],
        priceInsights: {},
        recommendations: [],
      });
    }

    // Get related searches based on the query
    const relatedSearches = await Product.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.like]: `%${q}%` } },
          { description: { [Op.like]: `%${q}%` } },
        ],
      },
      attributes: ["name"],
      limit: 6,
    });

    // Get popular categories for this search
    const popularCategories = await Product.findAll({
      where: {
        category: { [Op.like]: `%${q}%` },
      },
      attributes: ["category"],
      limit: 6,
    });

    // Get trending products related to the search
    const trendingProducts = await Product.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.like]: `%${q}%` } },
          { description: { [Op.like]: `%${q}%` } },
        ],
      },
      include: [
        {
          model: Review,
          as: "reviews",
          attributes: ["rating"],
        },
      ],
      order: [["average_rating", "DESC"]],
      limit: 4,
    });

    // Calculate price insights
    const priceData = await Product.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.like]: `%${q}%` } },
          { description: { [Op.like]: `%${q}%` } },
        ],
      },
      attributes: ["price"],
    });

    const prices = priceData.map((p) => p.price);
    const priceInsights = {
      lowest: prices.length > 0 ? Math.min(...prices) : 0,
      highest: prices.length > 0 ? Math.max(...prices) : 0,
      average:
        prices.length > 0
          ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length)
          : 0,
      range: prices.length > 0 ? Math.max(...prices) - Math.min(...prices) : 0,
    };

    // Generate AI recommendations
    const recommendations = [
      {
        title: "Try related categories",
        description: "Explore similar product categories for better results",
      },
      {
        title: "Adjust price range",
        description: "Consider expanding your price range for more options",
      },
      {
        title: "Check reviews",
        description: "Read customer reviews to make informed decisions",
      },
      {
        title: "Compare products",
        description: "Use our comparison tool to find the best option",
      },
    ];

    res.json({
      relatedSearches: relatedSearches.map((p) => p.name),
      popularCategories: popularCategories.map((p) => ({
        name: p.category,
        count: 1, // Since we're not counting products per category in this query
      })),
      trendingProducts: trendingProducts.map((p) => ({
        id: p.id,
        name: p.name,
        price: p.price,
        rating: p.average_rating || 0,
        image: p.main_image,
      })),
      priceInsights,
      recommendations,
    });
  } catch (error) {
    console.error("Insights error:", error);
    res
      .status(500)
      .json({ message: "Failed to get insights", error: error.message });
  }
};

// @desc    Export search results
// @route   GET /api/search/export
// @access  Private
const exportSearchResults = async (req, res) => {
  try {
    const { format = "csv", ...searchParams } = req.query;
    const userId = req.user.id;

    // Get search results using the same logic as searchProducts
    const { rows: products } = await Product.findAndCountAll({
      where: {
        [Op.or]: [
          { name: { [Op.like]: `%${searchParams.q || ""}%` } },
          { description: { [Op.like]: `%${searchParams.q || ""}%` } },
        ],
        price: {
          [Op.between]: [
            parseFloat(searchParams.priceMin || 0),
            parseFloat(searchParams.priceMax || 10000),
          ],
        },
      },
      include: [
        {
          model: Review,
          as: "reviews",
          attributes: ["rating"],
        },
      ],
      limit: 1000, // Export limit
    });

    // Process products for export
    const exportData = products.map((product) => {
      const avgRating =
        product.reviews.length > 0
          ? product.reviews.reduce((sum, review) => sum + review.rating, 0) /
            product.reviews.length
          : 0;

      return {
        "Product Name": product.name,
        Brand: product.brand,
        Category: product.category,
        Price: product.price,
        Rating: Math.round(avgRating * 10) / 10,
        Reviews: product.reviews.length,
        Stock: product.stock,
        Description: product.description,
        "Free Shipping": product.free_shipping ? "Yes" : "No",
        "Created At": product.createdAt.toISOString().split("T")[0],
      };
    });

    if (format === "csv") {
      const parser = new Parser();
      const csv = parser.parse(exportData);

      res.setHeader("Content-Type", "text/csv");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=search_results_${Date.now()}.csv`
      );
      res.send(csv);
    } else if (format === "pdf") {
      const doc = new PDFDocument();

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=search_results_${Date.now()}.pdf`
      );

      doc.pipe(res);

      // Add content to PDF
      doc.fontSize(20).text("Search Results Export", { align: "center" });
      doc.moveDown();
      doc.fontSize(12).text(`Generated on: ${new Date().toLocaleDateString()}`);
      doc.moveDown();

      exportData.forEach((item, index) => {
        doc.fontSize(14).text(`${index + 1}. ${item["Product Name"]}`);
        doc
          .fontSize(10)
          .text(
            `Price: $${item.Price} | Rating: ${item.Rating} | Stock: ${item.Stock}`
          );
        doc.moveDown(0.5);
      });

      doc.end();
    } else if (format === "excel") {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Search Results");

      // Add headers
      const headers = Object.keys(exportData[0] || {});
      worksheet.addRow(headers);

      // Add data
      exportData.forEach((row) => {
        worksheet.addRow(Object.values(row));
      });

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=search_results_${Date.now()}.xlsx`
      );

      await workbook.xlsx.write(res);
    } else {
      res.status(400).json({ message: "Unsupported export format" });
    }
  } catch (error) {
    console.error("Export error:", error);
    res.status(500).json({ message: "Export failed", error: error.message });
  }
};

module.exports = {
  searchProducts,
  getSearchSuggestions,
  getTrendingSearches,
  getSearchAnalytics,
  getSearchInsights,
  exportSearchResults,
};
