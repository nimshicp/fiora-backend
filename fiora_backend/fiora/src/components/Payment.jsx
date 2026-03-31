import React, { useState } from "react";
import { useOrder } from "../context/OrderContext";
import { useNavigate } from "react-router-dom";
import { Lock, Smartphone, Truck } from "lucide-react";
import toast from "react-hot-toast";

function Payment({ order, amount }) {
  const { processUPIPayment, cashOnDelivery, handleRazorpayPayment } =
    useOrder();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [upiId, setUpiId] = useState("");

  const handlePayment = async () => {
    if (!paymentMethod) {
      toast.error("please select a payment method");
      return;
    }

    setLoading(true);

    try {
      let result;

      if (paymentMethod === "upi") {
        if (!upiId.includes("@")) {
          toast.error("please enter a valid upiId");
          setLoading(false);
          return;
        }

        result = await processUPIPayment(order.id, upiId);
      } else if (paymentMethod === "cod") {
        result = await cashOnDelivery(order.id);
      } else if (paymentMethod === "razorpay") {
        // 🔥 Razorpay flow
        await handleRazorpayPayment(order.id);

        setLoading(false);
        return; // IMPORTANT: stop here
      }

      if (result?.success || result) {
        navigate(`/order-confirmation/${order.id}`);
      }
    } catch (err) {
      toast.error("payment failed please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Payment</h2>
      <p className="text-gray-600 mb-2">Order #{order.id}</p>

      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="flex justify-between items-center">
          <span className="font-semibold">Total</span>
          <span className="text-2xl font-bold text-gray-900">
            ${Number(amount).toFixed(2)}
          </span>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        <h3 className="font-semibold text-gray-900">Choose Payment</h3>

        <div
          className={`p-3 border rounded-lg cursor-pointer ${
            paymentMethod === "upi"
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300"
          }`}
          onClick={() => setPaymentMethod("upi")}
        >
          <div className="flex items-center">
            <Smartphone className="w-5 h-5 text-blue-600 mr-3" />
            <span className="font-medium">UPI</span>
          </div>

          {paymentMethod === "upi" && (
            <div className="mt-2">
              <input
                type="text"
                placeholder="name@upi"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded text-sm"
              />
            </div>
          )}
        </div>

        <div
          className={`p-3 border rounded-lg cursor-pointer ${
            paymentMethod === "cod"
              ? "border-green-500 bg-green-50"
              : "border-gray-300"
          }`}
          onClick={() => setPaymentMethod("cod")}
        >
          <div className="flex items-center">
            <Truck className="w-5 h-5 text-green-600 mr-3" />
            <span className="font-medium">Cash on Delivery</span>
          </div>
        </div>

        <div
          className={`p-3 border rounded-lg cursor-pointer ${
            paymentMethod === "razorpay"
              ? "border-purple-500 bg-purple-50"
              : "border-gray-300"
          }`}
          onClick={() => setPaymentMethod("razorpay")}
        >
          <div className="flex items-center">
            <Lock className="w-5 h-5 text-purple-600 mr-3" />
            <span className="font-medium">
              Razorpay (Card / UPI / Netbanking)
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={handlePayment}
        disabled={
          loading || !paymentMethod || (paymentMethod === "upi" && !upiId)
        }
        className="w-full bg-gray-900 text-white py-3 rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50 flex items-center justify-center"
      >
        {loading ? (
          "Processing..."
        ) : (
          <>
            <Lock className="w-5 h-5 mr-2" />
            {paymentMethod === "cod"
              ? "Confirm COD Order"
              : paymentMethod === "razorpay"
                ? "Proceed to Payment"
                : `Pay $${Number(amount).toFixed(2)}`}
          </>
        )}
      </button>
    </div>
  );
}

export default Payment;
