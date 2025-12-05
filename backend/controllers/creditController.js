import Transaction from "../models/Transaction.js";
import Stripe from 'stripe'
import { User } from "../models/User.js";


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const plans = [
  {
    id: "starter",
    name: "Starter Plan",
    price: 0,
    credits: 150,
    popular: false,
    features: [
      "✔️ 50 text generations",
      "✔️ 10 image generations",
      "✔️ Standard support",
      "✔️ Access to core models"
    ],
    description: "An affordable entry-level plan for users who need a little more power without breaking the bank."
  },


  {
    id: "pro",
    name: "Pro",
    price: 20,
    credits: 500,
    popular: true,
    features: [
      "✔️ 166 text generations",
      "✔️ 33 image generations",
      "✔️ Priority support",
      "✔️ Access to pro models",
      "⚡ Faster response time",
    ],
    description: "Best for professionals who need more power and speed.",
  },
  {
    id: "premium",
    name: "Premium",
    price: 30,
    credits: 1000,
    popular: false,
    features: [
      "✔️ 333 text generations",
      "✔️ 66 image generations",
      "✔️ 24/7 VIP support",
      "✔️ Access to premium models",
      "👤 Dedicated account manager",
    ],
    description: "For teams and enterprises that need the best service.",
  },
];

// controller for getting plans
export const getPlans = async (req, res) => {
  try {
    res.json({ success: true, plans })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

// controller for purchasing plan
export const purchasePlan = async (req, res) => {
  try {
    const { planId } = req.body;
    const userId = req.user._id;

    // Find selected plan
    const plan = plans.find(p => p.id == planId);

    if (!plan) {
      return res.json({ success: false, message: "Invalid plan" });
    }

    // Check for 30 days cooldown for the same plan
    const lastPurchase = await Transaction.findOne({
      userId,
      planId: plan.id, // cooldown is per plan
      isPaid: true
    }).sort({ createdAt: -1 });

    if (lastPurchase) {
      const lastTime = lastPurchase.createdAt.getTime();
      const now = Date.now();
      const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;

      if (now - lastTime < THIRTY_DAYS) {
        return res.json({
          success: false,
          message: "You can only activate this plan once every 30 days."
        });
      }
    }

  // free plan purchase flow
    if (plan.price === 0) {
      // Grant credits
      await User.updateOne(
        { _id: userId },
        { $inc: { credits: plan.credits } }
      );

      // Log transaction
      await Transaction.create({
        userId,
        planId: plan.id,
        amount: 0,
        credits: plan.credits,
        isPaid: true
      });

      return res.json({
        success: true,
        message: `${plan.name} activated successfully!`
      });
    }

    // paid plan purchase flow
    const transaction = await Transaction.create({
      userId,
      planId: plan.id,
      amount: plan.price,
      credits: plan.credits,
      isPaid: false
    });

    const { origin } = req.headers;

    const session = await stripe.checkout.sessions.create({
      success_url: `${origin}/loading`,
      cancel_url: `${origin}`,
      metadata: {
        transactionId: transaction._id.toString(),
        appId: "neura"
      },
      expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: plan.price * 100,
            product_data: { name: plan.name }
          },
          quantity: 1
        }
      ],
      mode: "payment"
    });

    return res.json({ success: true, url: session.url });

  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
