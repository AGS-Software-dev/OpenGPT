document.addEventListener("DOMContentLoaded", () => {
  // Make sure stripePublicKey exists from your EJS template
  if (!window.stripePublicKey) {
    console.error("Stripe public key not found!");
    return;
  }

  const stripe = Stripe(window.stripePublicKey);
  const planButtons = document.querySelectorAll(".selectPlanButton");

  planButtons.forEach(button => {
    button.addEventListener("click", async () => {
      const plan = button.dataset.plan;
      //if (!plan) return;

      /*if (plan === "Assistent") {
        alert("Please contact sales at contact@opengpt.ai");
        return;
      }*/

      try {
        const res = await fetch("/create-checkout-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ plan })
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Server error: ${text}`);
        }

        const data = await res.json();
        if (!data.id) throw new Error("No session ID returned");

        await stripe.redirectToCheckout({ sessionId: data.id });
      } catch (err) {
        console.error(err);
        alert("Payment failed: " + err.message);
      }
    });
  });
});
