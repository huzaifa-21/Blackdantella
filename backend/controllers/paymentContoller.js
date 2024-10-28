import Stripe from "stripe"; // Proper import for stripe library

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); // Initialize stripe with secret key

const handlePayment = async (req, res) => {
  try {
    const { amount } = req.body; // Amount should be in the lowest currency unit (e.g., fils for AED)

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "aed", // Change to AED
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export { handlePayment };
