const Order = require("../models/Order");
const OrderItem = require("../models/OrderItem");
const Product = require("../models/Product");
const Cart = require("../models/Cart");
const CartItem = require("../models/CartItem");
const { sequelize } = require("../config/database");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
  try {
    const { paymentMethod, shippingAddress, notes } = req.body;

    // Get user's cart with products
    const cart = await Cart.findOne({
      where: { user_id: req.user.id },
      include: [
        {
          model: CartItem,
          as: "cartItems",
          include: [{ model: Product, as: "product" }],
        },
      ],
    });

    if (!cart || !cart.cartItems || cart.cartItems.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Validate stock for all items
    for (const item of cart.cartItems) {
      const product = await Product.findByPk(item.product_id);
      if (!product || !product.is_active) {
        return res.status(400).json({
          message: `Product ${item.product.name} is no longer available`,
        });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for ${item.product.name}`,
        });
      }
    }

    // Calculate totals manually since cart methods might not work with included data
    const subtotal = cart.cartItems.reduce(
      (sum, item) => sum + parseFloat(item.price) * item.quantity,
      0
    );
    const tax = subtotal * 0.1; // 10% tax
    const shippingCost = subtotal > 50 ? 0 : 5.99; // Free shipping over $50
    const discount = cart.coupon_discount || 0;
    const total = subtotal + tax + shippingCost - discount;

    // Create order
    const orderPayload = {
      user_id: req.user.id,
      subtotal,
      tax,
      shipping_cost: shippingCost,
      discount,
      total,
      payment_method: paymentMethod,
      payment_status: "pending",
      order_status: "pending",
      notes: notes || "",
    };
    console.log("Order payload:", orderPayload);
    // Generate order_number
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const orderCount = await Order.count({
      where: {
        created_at: {
          [require("sequelize").Op.gte]: today,
        },
      },
    });
    const order_number = `ORD${year}${month}${day}${(orderCount + 1)
      .toString()
      .padStart(4, "0")}`;
    orderPayload.order_number = order_number;
    const order = await Order.create(orderPayload);

    // Create shipping address
    const ShippingAddress = require("../models/ShippingAddress");
    await ShippingAddress.create({
      order_id: order.id,
      name: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
      street: shippingAddress.address,
      city: shippingAddress.city,
      state: shippingAddress.state,
      zip_code: shippingAddress.zipCode,
      country: shippingAddress.country,
      phone: shippingAddress.phone,
    });

    // Create order items
    const orderItems = [];
    for (const item of cart.cartItems) {
      const orderItem = await OrderItem.create({
        order_id: order.id,
        product_id: item.product_id,
        name: item.product.name,
        quantity: item.quantity,
        price: item.price,
        image: item.product.main_image,
        selected_options: item.selected_options
          ? JSON.stringify(item.selected_options)
          : null,
      });
      orderItems.push(orderItem);
    }

    // Update product stock
    for (const item of cart.cartItems) {
      await Product.update(
        { stock: item.product.stock - item.quantity },
        { where: { id: item.product_id } }
      );
    }

    // Clear cart
    await CartItem.destroy({ where: { cart_id: cart.id } });

    // Get the complete order with items and shipping address
    const completeOrder = await Order.findByPk(order.id, {
      include: [
        {
          model: OrderItem,
          as: "orderItems",
          include: [{ model: Product, as: "product" }],
        },
        {
          model: ShippingAddress,
          as: "shippingAddress",
        },
      ],
    });

    res.status(201).json(completeOrder);
  } catch (error) {
    console.error("Create order error:", error);
    if (error.errors) {
      error.errors.forEach((e) => console.error(e.message));
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get user orders
// @route   GET /api/orders
// @access  Private
const getUserOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows: orders } = await Order.findAndCountAll({
      where: { user_id: req.user.id },
      include: [
        {
          model: OrderItem,
          as: "orderItems",
          include: [{ model: Product, as: "product" }],
        },
      ],
      order: [["created_at", "DESC"]],
      offset,
      limit,
    });

    res.json({
      orders,
      pagination: {
        page,
        limit,
        total: count,
        pages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    console.error("Get user orders error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [
        {
          model: OrderItem,
          as: "orderItems",
          include: [{ model: Product, as: "product" }],
        },
        {
          model: require("../models/ShippingAddress"),
          as: "shippingAddress",
        },
      ],
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check if user owns this order or is admin
    if (order.user_id !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.json(order);
  } catch (error) {
    console.error("Get order error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Create payment intent
// @route   POST /api/orders/:id/payment-intent
// @access  Private
const createPaymentIntent = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.user_id !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (order.payment_status === "paid") {
      return res.status(400).json({ message: "Order is already paid" });
    }

    // If Stripe key is missing or placeholder, simulate payment intent
    if (
      !process.env.STRIPE_SECRET_KEY ||
      process.env.STRIPE_SECRET_KEY.includes("sk_test_") ||
      process.env.STRIPE_SECRET_KEY.includes("here")
    ) {
      return res.json({
        clientSecret: "test_client_secret",
        paymentIntentId: "test_payment_intent_id",
        simulated: true,
      });
    }

    // Create payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.total * 100), // Convert to cents
      currency: "usd",
      metadata: {
        orderId: order.id.toString(),
        userId: req.user.id.toString(),
      },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error("Create payment intent error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Confirm payment
// @route   POST /api/orders/:id/confirm-payment
// @access  Private
const confirmPayment = async (req, res) => {
  try {
    const { paymentIntentId } = req.body;

    const order = await Order.findByPk(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.user_id !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Verify payment with Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === "succeeded") {
      // Update order payment status
      await order.update({
        payment_status: "paid",
        payment_id: paymentIntent.id,
        order_status: "processing",
        is_paid: true,
        paid_at: new Date(),
      });

      // Get updated order with items and shipping address
      const ShippingAddress = require("../models/ShippingAddress");
      const updatedOrder = await Order.findByPk(order.id, {
        include: [
          {
            model: OrderItem,
            as: "orderItems",
            include: [{ model: Product, as: "product" }],
          },
          {
            model: ShippingAddress,
            as: "shippingAddress",
          },
        ],
      });

      res.json({
        message: "Payment confirmed successfully",
        order: updatedOrder,
      });
    } else {
      res.status(400).json({ message: "Payment not completed" });
    }
  } catch (error) {
    console.error("Confirm payment error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
const cancelOrder = async (req, res) => {
  try {
    const { reason } = req.body;

    const order = await Order.findByPk(req.params.id, {
      include: [
        {
          model: OrderItem,
          as: "orderItems",
          include: [{ model: Product, as: "product" }],
        },
      ],
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check if user can cancel this order
    if (order.user_id !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Check if order can be cancelled
    if (["delivered", "cancelled", "shipped"].includes(order.order_status)) {
      return res.status(400).json({ message: "Order cannot be cancelled" });
    }

    // Update order status
    await order.update({
      order_status: "cancelled",
      cancelled_at: new Date(),
      cancelled_by: req.user.id,
      cancellation_reason: reason,
    });

    // Restore product stock
    for (const item of order.orderItems) {
      await Product.update(
        { stock: item.product.stock + item.quantity },
        { where: { id: item.product_id } }
      );
    }

    res.json({
      message: "Order cancelled successfully",
      order,
    });
  } catch (error) {
    console.error("Cancel order error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Update order status (Admin only)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
  try {
    const { status, trackingNumber, carrier } = req.body;

    const order = await Order.findByPk(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Update order status
    await order.update({
      order_status: status,
      tracking_number: trackingNumber,
      carrier: carrier,
    });

    res.json({
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    console.error("Update order status error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get all orders (Admin only)
// @route   GET /api/orders/admin/all
// @access  Private/Admin
const getAllOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const status = req.query.status;
    const offset = (page - 1) * limit;

    const whereClause = {};
    if (status) {
      whereClause.order_status = status;
    }

    const { count, rows: orders } = await Order.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: OrderItem,
          as: "orderItems",
          include: [{ model: Product, as: "product" }],
        },
        {
          model: require("../models/User"),
          as: "user",
          attributes: ["name", "email"],
        },
      ],
      order: [["created_at", "DESC"]],
      offset,
      limit,
    });

    res.json({
      orders,
      pagination: {
        page,
        limit,
        total: count,
        pages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    console.error("Get all orders error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get order statistics (Admin only)
// @route   GET /api/orders/admin/stats
// @access  Private/Admin
const getOrderStats = async (req, res) => {
  try {
    // Get total orders and revenue
    const totalOrders = await Order.count();
    const totalRevenue = await Order.sum("total");
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Get orders by status
    const statusStats = await Order.findAll({
      attributes: [
        "order_status",
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
      ],
      group: ["order_status"],
    });

    // Get recent orders
    const recentOrders = await Order.findAll({
      include: [
        {
          model: require("../models/User"),
          as: "user",
          attributes: ["name", "email"],
        },
      ],
      order: [["created_at", "DESC"]],
      limit: 5,
    });

    res.json({
      stats: {
        totalOrders,
        totalRevenue: totalRevenue || 0,
        averageOrderValue,
      },
      statusStats,
      recentOrders,
    });
  } catch (error) {
    console.error("Get order stats error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getOrderById,
  createPaymentIntent,
  confirmPayment,
  cancelOrder,
  updateOrderStatus,
  getAllOrders,
  getOrderStats,
};
