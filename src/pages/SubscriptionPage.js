// SubscriptionPage.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { supabase } from "../utils/supabaseClient";

function SubscriptionPage() {
  const navigate = useNavigate();
  const { user, loading } = useUser();

  const [selectedPlan, setSelectedPlan] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading) {
      if (!user) {
        setError("Trebuie să fii autentificat pentru a accesa această pagină.");
        navigate("/login");
      } else if (!user.confirmed_at) {
        setError("Contul nu este confirmat. Verifică-ți emailul.");
        navigate("/login");
      }
    }
  }, [user, loading, navigate]);

  const handleContinue = async () => {
    if (!selectedPlan) return;

    const { error } = await supabase.auth.updateUser({
      data: { plan: selectedPlan }
    });

    if (error) {
      setError("A apărut o eroare la salvarea planului. Încearcă din nou.");
    } else {
      navigate("/", { replace: true });
    }
  };

  const plans = [
    {
      id: "free",
      title: "Free with Ads",
      price: "$0",
      features: ["Ads included", "Stream on 1 device", "SD resolution"],
    },
    {
      id: "fullhd",
      title: "Full HD",
      price: "$2.99/month",
      features: ["Stream on 2 devices", "1080p Full HD", "No ads"],
    },
    {
      id: "4k",
      title: "4K Premium",
      price: "$6.99/month",
      features: ["Stream on 5 devices", "4K UHD + HDR", "No ads + downloads"],
    },
  ];

  if (loading || !user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-zinc-900 text-white px-4 py-12 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
      <p className="text-gray-400 mb-10 text-center max-w-xl">
        Unlock full access to CinemAI content. Enjoy AI-generated films, series, and more based on your subscription level.
      </p>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="flex flex-col md:flex-row gap-6 w-full max-w-5xl justify-center">
        {plans.map((plan) => (
          <div
            key={plan.id}
            onClick={() => setSelectedPlan(plan.id)}
            className={`cursor-pointer flex-1 bg-zinc-800 rounded-lg p-6 border-2 transition duration-200 hover:scale-105 hover:border-cyan-400 ${
              selectedPlan === plan.id ? "border-cyan-500 shadow-xl scale-105" : "border-transparent"
            }`}
          >
            <h2 className="text-xl font-semibold mb-2">{plan.title}</h2>
            <p className="text-2xl font-bold">{plan.price}</p>
            <ul className="mt-4 text-sm text-gray-300 list-disc pl-5">
              {plan.features.map((feat, i) => (
                <li key={i}>{feat}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <button
        onClick={handleContinue}
        disabled={!selectedPlan}
        className="mt-10 px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded disabled:opacity-50 transition"
      >
        Continue
      </button>
    </div>
  );
}

export default SubscriptionPage;
