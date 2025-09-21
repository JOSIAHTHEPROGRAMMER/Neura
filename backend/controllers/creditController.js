import Transaction from "../models/Transaction.js";
import Stripe from 'stripe'


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const plans = [
  {
    id: "Free",
    name: "Free",
    price: 10,
    credits: 100,
    popular: false,
    features: [
      "✔️ 100 text generations",
      "✔️ 50 image generations",
      "✔️ Standard support",
      "✔️ Access to basic models",
    ],
    description: "Perfect for individuals just getting started.",
  },
  {
    id: "pro",
    name: "Pro",
    price: 20,
    credits: 500,
    popular: true,
    features: [
      "✔️ 500 text generations",
      "✔️ 200 image generations",
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
      "✔️ 1000 text generations",
      "✔️ 500 image generations",
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


// controller for buying a plan
export const purchasePlan = async (req, res) => {
  try {
    const { planId } = req.body
    const userId = req.user._id
    const plan = plans.find(plan => plan.id == planId)

    if (!plan) {
      return res.json({ success: false, message: "Invalid plan" })
    }

    const transaction = await Transaction.create({
      userId: userId,
      planId: plan.id,
      amount: plan.price,
      credits: plan.credits,
      isPaid: false
    })

    const { origin } = req.headers;

    const session = await stripe.checkout.sessions.create({
      success_url: `${origin}/loading`,
      cancel_url: `${origin}`,
      metadata: { transactionId: transaction._id.toString(), appId: 'neura' },
      expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: plan.price * 100,
            product_data: {
              name: plan.name
            }
          },
          quantity: 1,
        },
      ],
      mode: 'payment'
    })

    res.json({ success: true, url: session.url })



  } catch (error) {
    res.json({ success: false, message: error.message })

  }
}

