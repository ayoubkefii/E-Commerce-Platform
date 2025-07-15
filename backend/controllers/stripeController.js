const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const createCheckoutSession = async (req, res) => {
  try {
    if (
      !process.env.STRIPE_SECRET_KEY ||
      process.env.STRIPE_SECRET_KEY === "your_stripe_secret_key_here"
    ) {
      return res.status(500).json({
        success: false,
        message: "Stripe is not properly configured.",
      });
    }

    const { email, orderId, amount, items } = req.body;

    // Validate required fields
    if (!email || !amount) {
      return res.status(400).json({
        success: false,
        message: "Email and amount are required",
      });
    }

    // Prepare line items for Stripe
    let lineItems = [];

    if (items && items.length > 0) {
      // Use cart items if provided
      lineItems = items.map((item) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
            description: item.description || `Quantity: ${item.quantity}`,
            images: item.image
              ? [item.image]
              : ["https://via.placeholder.com/150"],
          },
          unit_amount: Math.round(item.price * 100), // Convert to cents
        },
        quantity: item.quantity,
      }));
    } else {
      // Fallback to fixed $15 product if no items provided
      lineItems = [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "E-Commerce Product",
              description: "Sample product for testing Stripe integration",
              images: ["https://via.placeholder.com/150"],
            },
            unit_amount: 1500, // $15.00 in cents
          },
          quantity: 1,
        },
      ];
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${
        process.env.FRONTEND_URL || "http://localhost:3000"
      }/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${
        process.env.FRONTEND_URL || "http://localhost:3000"
      }/payment/cancel`,
      metadata: {
        customer_email: email,
        order_id: orderId || "no_order_id",
        order_type:
          items && items.length > 0 ? "cart_checkout" : "fixed_product",
      },
    });

    console.log("✅ Stripe checkout session created:", session.id);
    console.log("💰 Total amount:", session.amount_total / 100, "USD");
    console.log("👤 Customer email:", email);

    res.status(200).json({
      success: true,
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error("❌ Error creating Stripe checkout session:", error);

    if (error.type === "StripeCardError") {
      return res.status(400).json({
        success: false,
        message: "Card error: " + error.message,
      });
    } else if (error.type === "StripeInvalidRequestError") {
      return res.status(400).json({
        success: false,
        message: "Invalid request: " + error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to create checkout session",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    });
  }
};

const handleWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    if (!endpointSecret) {
      console.error("❌ STRIPE_WEBHOOK_SECRET is not configured");
      return res.status(400).json({
        success: false,
        message: "Webhook secret not configured",
      });
    }

    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    console.log("✅ Webhook signature verified");
  } catch (err) {
    console.error("❌ Webhook signature verification failed:", err.message);
    return res.status(400).json({
      success: false,
      message: `Webhook Error: ${err.message}`,
    });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object;
        console.log("✅ Payment completed for session:", session.id);
        console.log("💰 Amount paid:", session.amount_total / 100, "USD");
        console.log("👤 Customer email:", session.customer_details?.email);
        console.log("📦 Order ID:", session.metadata?.order_id);
        console.log("🛒 Order type:", session.metadata?.order_type);

        // Here you would typically:
        // 1. Update order status in your database
        // 2. Send confirmation email
        // 3. Update inventory
        // 4. Create invoice

        break;

      case "payment_intent.succeeded":
        const paymentIntent = event.data.object;
        console.log("✅ Payment intent succeeded:", paymentIntent.id);
        break;

      case "payment_intent.payment_failed":
        const failedPayment = event.data.object;
        console.log("❌ Payment failed:", failedPayment.id);
        break;

      default:
        console.log(`ℹ️ Unhandled event type: ${event.type}`);
    }

    res.status(200).json({
      success: true,
      message: "Webhook processed successfully",
    });
  } catch (error) {
    console.error("❌ Error processing webhook:", error);
    res.status(500).json({
      success: false,
      message: "Webhook processing failed",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    });
  }
};

const getSessionDetails = async (req, res) => {
  try {
    const { sessionId } = req.params;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: "Session ID is required",
      });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    res.status(200).json({
      success: true,
      session: {
        id: session.id,
        status: session.status,
        amount_total: session.amount_total,
        currency: session.currency,
        customer_email: session.customer_details?.email,
        payment_status: session.payment_status,
        created: session.created,
        metadata: session.metadata,
      },
    });
  } catch (error) {
    console.error("❌ Error retrieving session:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve session details",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    });
  }
};

const stripeHealthCheck = async (req, res) => {
  try {
    const account = await stripe.accounts.retrieve();

    res.status(200).json({
      success: true,
      message: "Stripe is properly configured",
      account: {
        id: account.id,
        business_type: account.business_type,
        charges_enabled: account.charges_enabled,
        payouts_enabled: account.payouts_enabled,
      },
      environment: process.env.NODE_ENV || "development",
    });
  } catch (error) {
    console.error("❌ Stripe health check failed:", error);
    res.status(500).json({
      success: false,
      message: "Stripe configuration error",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    });
  }
};

module.exports = {
  createCheckoutSession,
  handleWebhook,
  getSessionDetails,
  stripeHealthCheck,
};
