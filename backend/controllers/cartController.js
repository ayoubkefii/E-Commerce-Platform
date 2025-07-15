const Cart = require("../models/Cart");
const CartItem = require("../models/CartItem");
const Product = require("../models/Product");

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({
      where: { user_id: req.user.id },
      include: [
        {
          model: CartItem,
          as: "cartItems",
          include: [{ model: Product, as: "product" }],
        },
      ],
    });

    if (!cart) {
      // Create new cart if doesn't exist
      cart = await Cart.create({ user_id: req.user.id });
    }

    // Calculate totals using Cart model's virtuals
    const cartItems = cart.cartItems || [];
    const subtotal = cart.getSubtotal ? cart.getSubtotal() : 0;
    const discount = cart.getDiscountAmount ? cart.getDiscountAmount() : 0;
    const shippingCost = cart.shipping_cost
      ? parseFloat(cart.shipping_cost)
      : 0;
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const total = subtotal - discount + shippingCost;

    res.json({
      items: cartItems,
      cartItems: cartItems, // For compatibility
      totalItems,
      subtotal: Number(subtotal) || 0,
      discount: Number(discount) || 0,
      shippingCost: Number(shippingCost) || 0,
      total: Number(total) || 0,
      coupon: cart.coupon_code
        ? {
            code: cart.coupon_code,
            discount: cart.coupon_discount,
            type: cart.coupon_type,
          }
        : null,
      shippingAddress: cart.shipping_address
        ? JSON.parse(cart.shipping_address)
        : null,
      shippingMethod: cart.shipping_method
        ? JSON.parse(cart.shipping_method)
        : null,
    });
  } catch (error) {
    console.error("Get cart error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart/add
// @access  Private
const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1, options = {} } = req.body;

    // Validate product
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (!product.is_active) {
      return res.status(400).json({ message: "Product is not available" });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ message: "Insufficient stock" });
    }

    // Get or create cart
    let cart = await Cart.findOne({ where: { user_id: req.user.id } });
    if (!cart) {
      cart = await Cart.create({ user_id: req.user.id });
    }

    // Calculate price (considering discounts)
    const price =
      product.discount > 0 &&
      (!product.discount_end_date || product.discount_end_date > new Date())
        ? product.price - (product.price * product.discount) / 100
        : product.price;

    // Check if item already exists in cart
    let cartItem = await CartItem.findOne({
      where: { cart_id: cart.id, product_id: productId },
    });

    if (cartItem) {
      // Update existing item
      cartItem.quantity += quantity;
      cartItem.price = price;
      await cartItem.save();
    } else {
      // Create new cart item
      await CartItem.create({
        cart_id: cart.id,
        product_id: productId,
        quantity,
        price,
        selected_options: JSON.stringify(options),
      });
    }

    // Get updated cart
    const updatedCart = await Cart.findOne({
      where: { user_id: req.user.id },
      include: [
        {
          model: CartItem,
          as: "cartItems",
          include: [{ model: Product, as: "product" }],
        },
      ],
    });

    // Calculate totals
    const cartItems = updatedCart.cartItems || [];
    const subtotal = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    res.json({
      items: cartItems,
      cartItems: cartItems,
      totalItems,
      subtotal,
      discount: updatedCart.discount || 0,
      shippingCost: updatedCart.shipping_cost || 0,
      total:
        subtotal -
        (updatedCart.discount || 0) +
        (updatedCart.shipping_cost || 0),
    });
  } catch (error) {
    console.error("Add to cart error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/update
// @access  Private
const updateCartItem = async (req, res) => {
  try {
    const { productId, quantity, options = {} } = req.body;

    if (quantity < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }

    // Validate product stock
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ message: "Insufficient stock" });
    }

    const cart = await Cart.findOne({ where: { user_id: req.user.id } });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Update cart item
    const cartItem = await CartItem.findOne({
      where: { cart_id: cart.id, product_id: productId },
    });

    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    cartItem.quantity = quantity;
    cartItem.selected_options = JSON.stringify(options);
    await cartItem.save();

    // Get updated cart
    const updatedCart = await Cart.findOne({
      where: { user_id: req.user.id },
      include: [
        {
          model: CartItem,
          as: "cartItems",
          include: [{ model: Product, as: "product" }],
        },
      ],
    });

    // Calculate totals
    const cartItems = updatedCart.cartItems || [];
    const subtotal = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    res.json({
      items: cartItems,
      cartItems: cartItems,
      totalItems,
      subtotal,
      discount: updatedCart.discount || 0,
      shippingCost: updatedCart.shipping_cost || 0,
      total:
        subtotal -
        (updatedCart.discount || 0) +
        (updatedCart.shipping_cost || 0),
    });
  } catch (error) {
    console.error("Update cart item error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/remove/:productId
// @access  Private
const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ where: { user_id: req.user.id } });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Remove cart item
    await CartItem.destroy({
      where: { cart_id: cart.id, product_id: productId },
    });

    // Get updated cart
    const updatedCart = await Cart.findOne({
      where: { user_id: req.user.id },
      include: [
        {
          model: CartItem,
          as: "cartItems",
          include: [{ model: Product, as: "product" }],
        },
      ],
    });

    // Calculate totals
    const cartItems = updatedCart?.cartItems || [];
    const subtotal = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    res.json({
      items: cartItems,
      cartItems: cartItems,
      totalItems,
      subtotal,
      discount: updatedCart?.discount || 0,
      shippingCost: updatedCart?.shipping_cost || 0,
      total:
        subtotal -
        (updatedCart?.discount || 0) +
        (updatedCart?.shipping_cost || 0),
    });
  } catch (error) {
    console.error("Remove from cart error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Clear cart
// @route   DELETE /api/cart/clear
// @access  Private
const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ where: { user_id: req.user.id } });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Clear all cart items
    await CartItem.destroy({ where: { cart_id: cart.id } });

    // Reset cart totals
    cart.subtotal = 0;
    cart.discount = 0;
    cart.shipping_cost = 0;
    cart.total = 0;
    cart.coupon_code = null;
    cart.shipping_address = null;
    cart.shipping_method = null;
    await cart.save();

    res.json({ message: "Cart cleared successfully" });
  } catch (error) {
    console.error("Clear cart error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Apply coupon to cart
// @route   POST /api/cart/coupon
// @access  Private
const applyCoupon = async (req, res) => {
  try {
    const { code } = req.body;

    // Validate coupon code (this is a simplified version)
    const validCoupons = {
      SAVE10: { discount: 10, type: "percentage" },
      SAVE20: { discount: 20, type: "percentage" },
      FREESHIP: { discount: 0, type: "percentage" },
      FIXED10: { discount: 10, type: "fixed" },
    };

    const coupon = validCoupons[code];
    if (!coupon) {
      return res.status(400).json({ message: "Invalid coupon code" });
    }

    const cart = await Cart.findOne({ where: { user_id: req.user.id } });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Apply coupon
    cart.coupon_code = code;
    cart.discount = coupon.discount;
    await cart.save();

    // Get updated cart
    const updatedCart = await Cart.findOne({
      where: { user_id: req.user.id },
      include: [
        {
          model: CartItem,
          as: "cartItems",
          include: [{ model: Product, as: "product" }],
        },
      ],
    });

    // Calculate totals
    const cartItems = updatedCart.cartItems || [];
    const subtotal = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    res.json({
      items: cartItems,
      cartItems: cartItems,
      totalItems,
      subtotal,
      discount: updatedCart.discount || 0,
      shippingCost: updatedCart.shipping_cost || 0,
      total:
        subtotal -
        (updatedCart.discount || 0) +
        (updatedCart.shipping_cost || 0),
      coupon: { code: updatedCart.coupon_code, discount: updatedCart.discount },
    });
  } catch (error) {
    console.error("Apply coupon error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Remove coupon from cart
// @route   DELETE /api/cart/coupon
// @access  Private
const removeCoupon = async (req, res) => {
  try {
    const cart = await Cart.findOne({ where: { user_id: req.user.id } });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Remove coupon
    cart.coupon_code = null;
    cart.discount = 0;
    await cart.save();

    // Get updated cart
    const updatedCart = await Cart.findOne({
      where: { user_id: req.user.id },
      include: [
        {
          model: CartItem,
          as: "cartItems",
          include: [{ model: Product, as: "product" }],
        },
      ],
    });

    // Calculate totals
    const cartItems = updatedCart.cartItems || [];
    const subtotal = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    res.json({
      items: cartItems,
      cartItems: cartItems,
      totalItems,
      subtotal,
      discount: 0,
      shippingCost: updatedCart.shipping_cost || 0,
      total: subtotal + (updatedCart.shipping_cost || 0),
      coupon: null,
    });
  } catch (error) {
    console.error("Remove coupon error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Set shipping address
// @route   PUT /api/cart/shipping-address
// @access  Private
const setShippingAddress = async (req, res) => {
  try {
    const { street, city, state, zipCode, country, phone } = req.body;

    const cart = await Cart.findOne({ where: { user_id: req.user.id } });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Set shipping address
    cart.shipping_address = JSON.stringify({
      street,
      city,
      state,
      zipCode,
      country,
      phone,
    });
    await cart.save();

    res.json({ message: "Shipping address updated successfully" });
  } catch (error) {
    console.error("Set shipping address error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Set shipping method
// @route   PUT /api/cart/shipping-method
// @access  Private
const setShippingMethod = async (req, res) => {
  try {
    const { name, cost, estimatedDays } = req.body;

    const cart = await Cart.findOne({ where: { user_id: req.user.id } });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Set shipping method
    cart.shipping_method = JSON.stringify({
      name,
      cost,
      estimatedDays,
    });
    cart.shipping_cost = cost;
    await cart.save();

    res.json({ message: "Shipping method updated successfully" });
  } catch (error) {
    console.error("Set shipping method error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get cart summary
// @route   GET /api/cart/summary
// @access  Private
const getCartSummary = async (req, res) => {
  try {
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

    if (!cart) {
      return res.json({
        totalItems: 0,
        subtotal: 0,
        discount: 0,
        shippingCost: 0,
        total: 0,
      });
    }

    // Calculate totals
    const cartItems = cart.cartItems || [];
    const subtotal = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    res.json({
      totalItems,
      subtotal,
      discount: cart.discount || 0,
      shippingCost: cart.shipping_cost || 0,
      total: subtotal - (cart.discount || 0) + (cart.shipping_cost || 0),
    });
  } catch (error) {
    console.error("Get cart summary error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  applyCoupon,
  removeCoupon,
  setShippingAddress,
  setShippingMethod,
  getCartSummary,
};
