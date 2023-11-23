/* eslint-disable no-case-declarations */
/* eslint-disable indent */
/* eslint-disable no-console */
/* eslint-disable no-unused-vars */

import { stripe } from "../../utils/stripe.js";

export const handleStripeWebHooks = async (req, res) => {
    const sig = req.headers["stripe-signature"];
    console.log("event received");
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_SECRET_KEY);
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
        case "checkout.session.async_payment_failed":
            const checkoutSessionAsyncPaymentFailed = event.data.object;
            // Then define and call a function to handle the event checkout.session.async_payment_failed
            break;
        case "checkout.session.async_payment_succeeded":
            const checkoutSessionAsyncPaymentSucceeded = event.data.object;
            // Then define and call a function to handle the event checkout.session.async_payment_succeeded
            break;
        case "checkout.session.completed":
            const checkoutSessionCompleted = event.data.object;
            // Then define and call a function to handle the event checkout.session.completed
            break;
        case "checkout.session.expired":
            const checkoutSessionExpired = event.data.object;
            // Then define and call a function to handle the event checkout.session.expired
            break;
        // ... handle other event types
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
};


