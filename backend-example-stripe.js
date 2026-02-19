// =====================================================
// BACKEND EXAMPLE - Simple Payment System
// Node.js + Express + Stripe
// =====================================================

// Quraşdırma:
// npm install express stripe cors dotenv

const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// =====================================================
// 1. TURNİR MƏLUMATLARINI GÖTÜR
// =====================================================

app.get('/api/tournaments/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const tournament = await db.query(`
      SELECT * FROM tournaments WHERE id = $1
    `, [id]);

    if (tournament.rows.length === 0) {
      return res.status(404).json({ error: 'Turnir tapılmadı' });
    }

    res.json(tournament.rows[0]);

  } catch (error) {
    console.error('Error fetching tournament:', error);
    res.status(500).json({ error: 'Server xətası' });
  }
});

// =====================================================
// 2. PAYMENT INTENT YARAT
// =====================================================

app.post('/api/payments/create-intent', async (req, res) => {
  try {
    const { tournamentId, amount } = req.body;

    // Validasiya
    if (!tournamentId || !amount) {
      return res.status(400).json({ error: 'Turnir ID və məbləğ tələb olunur' });
    }

    // Turnirin mövcud olduğunu yoxla
    const tournament = await db.query(
      'SELECT * FROM tournaments WHERE id = $1',
      [tournamentId]
    );

    if (tournament.rows.length === 0) {
      return res.status(404).json({ error: 'Turnir tapılmadı' });
    }

    // Ödəniş məbləğini database-dən götür
    const actualAmount = tournament.rows[0].registration_fee;

    // Stripe Payment Intent yarat
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(actualAmount * 100), // Manatı qəpiyə çevir
      currency: 'azn',
      metadata: {
        tournamentId: tournamentId.toString(),
        tournamentName: tournament.rows[0].name
      }
    });

    // Payment Intent-i database-ə yaz (tracking məqsədi ilə)
    await db.query(`
      INSERT INTO payment_intents (
        payment_intent_id,
        tournament_id,
        amount,
        status,
        created_at
      ) VALUES ($1, $2, $3, 'pending', NOW())
    `, [
      paymentIntent.id,
      tournamentId,
      actualAmount
    ]);

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });

  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ error: 'Ödəniş yaradıla bilmədi' });
  }
});

// =====================================================
// 3. ÖDƏNİŞİ TƏSDİQLƏ
// =====================================================

app.post('/api/payments/confirm', async (req, res) => {
  try {
    const { paymentIntentId, stripePaymentId, tournamentId } = req.body;

    // Validasiya
    if (!paymentIntentId || !stripePaymentId || !tournamentId) {
      return res.status(400).json({ error: 'Bütün məlumatlar tələb olunur' });
    }

    // Stripe-dan ödəniş statusunu yoxla
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ error: 'Ödəniş uğursuz oldu' });
    }

    // Ödənişin artıq təsdiqlənib-təsdiqlənmədiyini yoxla
    const existingPayment = await db.query(
      'SELECT * FROM tournament_payments WHERE payment_id = $1',
      [stripePaymentId]
    );

    if (existingPayment.rows.length > 0) {
      return res.status(409).json({ error: 'Bu ödəniş artıq təsdiqlənib' });
    }

    // Ödənişi database-ə yaz
    const payment = await db.query(`
      INSERT INTO tournament_payments (
        tournament_id,
        payment_id,
        amount,
        status,
        paid_at,
        created_at
      ) VALUES ($1, $2, $3, 'completed', NOW(), NOW())
      RETURNING *
    `, [
      tournamentId,
      stripePaymentId,
      paymentIntent.amount / 100
    ]);

    // Payment Intent statusunu yenilə
    await db.query(`
      UPDATE payment_intents 
      SET status = 'succeeded', updated_at = NOW()
      WHERE payment_intent_id = $1
    `, [paymentIntentId]);

    res.json({
      success: true,
      paymentId: payment.rows[0].id,
      message: 'Ödəniş uğurla tamamlandı'
    });

  } catch (error) {
    console.error('Error confirming payment:', error);
    res.status(500).json({ error: 'Ödəniş təsdiqlənə bilmədi' });
  }
});

// =====================================================
// 4. SERVER START
// =====================================================

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// =====================================================
// 5. .ENV FAYIL NÜMUNƏSİ
// =====================================================

/*
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxxx
DATABASE_URL=postgresql://user:password@localhost:5432/matcharena
PORT=3000
*/

// =====================================================
// 6. DATABASE SCHEMA
// =====================================================

/*
-- Turnir Ödənişləri
CREATE TABLE tournament_payments (
  id SERIAL PRIMARY KEY,
  tournament_id INTEGER NOT NULL REFERENCES tournaments(id),
  payment_id VARCHAR(255) NOT NULL UNIQUE,
  amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'completed',
  paid_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Payment Intents (tracking məqsədi ilə)
CREATE TABLE payment_intents (
  id SERIAL PRIMARY KEY,
  payment_intent_id VARCHAR(255) NOT NULL UNIQUE,
  tournament_id INTEGER NOT NULL REFERENCES tournaments(id),
  amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- İndekslər
CREATE INDEX idx_tournament_payments_tournament ON tournament_payments(tournament_id);
CREATE INDEX idx_payment_intents_status ON payment_intents(status);
*/
