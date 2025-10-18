if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const Stripe = require('stripe');
const path = require('path');

const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

app.set('view engine', 'ejs');
app.use(express.json());
app.use('/public', express.static(path.join(__dirname, 'public')));

const stripePublicKey = process.env.STRIPE_PUBLIC_KEY;

app.get('/', (req, res) => {
  res.render('index');
});

// 🟢 Render the upgrade page
app.get('/upgrade', (req, res) => {
  res.render('upgrade', { stripePublicKey });
});

// 🟢 Create checkout session (called from pay.js)
app.post('/create-checkout-session', async (req, res) => {
  const { plan } = req.body;

  // Map plans to prices dynamically (instead of using Price IDs)
  const planDetails = {
    plus: { name: "OpenGPT Plus", amount: 2900 / 100, description: "Plus Plan - 400 tokens" },
    pro: { name: "OpenGPT Pro", amount: 3900 / 100, description: "Pro Plan - 1000 tokens" },
    assistent: { name: "OpenGPT Assistent", amount: 7800 / 100, description: "Assistent Plan - 100000 tokens" }
  };

  const selectedPlan = planDetails[plan];
  if (!selectedPlan) {
    return res.status(400).json({ error: "Invalid plan" });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment", // not subscription — one-time payment
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: selectedPlan.name,
              description: selectedPlan.description
            },
            unit_amount: selectedPlan.amount * 100 // Stripe uses cents
          },
          quantity: 1
        }
      ],
      success_url: "http://localhost:3000/success",
      cancel_url: "http://localhost:3000/cancel"
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});


// 🟢 Success & cancel routes
app.get('/success', (req, res) => {
  res.send('<h1>Payment successful! 🎉</h1><p>Your account will be upgraded shortly.</p>');
});

app.get('/cancel', (req, res) => {
  res.send('<h1>Payment canceled ❌</h1><p>No charges were made.</p>');
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
