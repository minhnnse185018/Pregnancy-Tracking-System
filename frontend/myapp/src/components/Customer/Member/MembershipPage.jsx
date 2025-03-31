import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import "./MembershipPage.css";

function MembershipPage() {
  const [error, setError] = useState(null);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userMemberships, setUserMemberships] = useState([]);

  useEffect(() => {
    fetchMembershipPlans();
    handleCheckMembershipPlan();
  }, []);

  const fetchMembershipPlans = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5254/api/MembershipPlan/GetAllPlans"
      );
      const formattedPlans = response.data.map((plan) => ({
        id: plan.id,
        name: plan.planName,
        price: plan.price,
        duration: `${plan.duration} months`,
        benefits: plan.description
          .split('",\r\n')
          .map((desc) => desc.replace(/["\r\n]/g, "").trim())
          .filter((desc) => desc !== ""),
      }));
      setPlans(formattedPlans);
    } catch (err) {
      setError("Failed to load membership plans");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckMembershipPlan = async () => {
    const userId = sessionStorage.getItem("userID");
    if (!userId) {
      console.log("User not logged in");
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:5254/api/Membership/user/${userId}`
      );
      setUserMemberships(response.data);
    } catch (err) {
      console.error("Failed to fetch user memberships:", err);
    }
  };

  const hasPurchasedPlan = (planId) => {
    return userMemberships.some(
      (membership) =>
        membership.planId === planId && membership.status === "Active"
    );
  };

  const getButtonText = (planId) => {
    if (hasPurchasedPlan(planId)) {
      return "Currently Subscribed";
    }
    return "Join Now";
  };

  const handleJoinPlan = async (plan) => {
    const userId = sessionStorage.getItem("userID");
    if (!userId) {
      alert("Please log in to proceed with the payment!");
      return;
    }

    try {
      // Step 1: Create a pending membership
      const currentDate = new Date().toISOString();
      const membershipResponse = await axios.post(
        "http://localhost:5254/api/Membership/purchase",
        {
          userId: parseInt(userId),
          planId: plan.id,
          startDate: currentDate,
        }
      );

      console.log("Membership created:", membershipResponse.data);

      // Step 2: Create payment after membership is created
      const membershipId =
        membershipResponse.data.id || membershipResponse.data.membershipId;

      if (!membershipId) {
        console.error(
          "Failed to get membership ID from response:",
          membershipResponse.data
        );
        alert("Error creating membership. Please try again.");
        return;
      }

      const paymentResponse = await axios.post(
        "http://localhost:5254/api/payment",
        {
          membershipId: membershipId,
          amount: plan.price,
          paymentDescription: `Payment for ${plan.name}`,
        }
      );

      console.log("Payment response:", paymentResponse.data);

      // Handle the payment URL response
      if (
        paymentResponse.data &&
        typeof paymentResponse.data === "string" &&
        paymentResponse.data.includes("vnpayment.vn")
      ) {
        // If response.data is a URL string, use it directly
        window.location.href = paymentResponse.data;
      } else if (paymentResponse.data && paymentResponse.data.vnpayUrl) {
        // If response.data is an object with vnpayUrl property
        window.location.href = paymentResponse.data.vnpayUrl;
      } else {
        alert("Failed to get payment URL!");
      }
    } catch (error) {
      console.error("Payment process error:", error);
      alert("An error occurred during the payment process. Please try again!");
    }
  };

  return (
    <div className="membership-container">
      <h1 className="membership-title">Join the Journey with Mom and Baby</h1>
      <p className="membership-description">
        Choose a suitable membership plan to access exclusive materials, expert
        advice, and connect with the mom community!
      </p>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        <div className="membership-plans">
          {plans.map((plan) => (
            <div key={plan.id} className="membership-plan">
              <h2>{plan.name}</h2>
              <p>
                <strong>Price:</strong> {plan.price.toLocaleString()}đ
              </p>
              <p>
                <strong>Duration:</strong> {plan.duration}
              </p>
              <ul>
                {plan.benefits.map((benefit, i) => (
                  <li key={i}>{benefit}</li>
                ))}
              </ul>
              <Button
                onClick={() => handleJoinPlan(plan)}
                disabled={hasPurchasedPlan(plan.id)}
                variant={hasPurchasedPlan(plan.id) ? "success" : "primary"}
              >
                {getButtonText(plan.id)}
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MembershipPage;
