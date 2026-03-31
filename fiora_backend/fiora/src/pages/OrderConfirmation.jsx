import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useOrder } from '../context/OrderContext';
import { CheckCircle, ShoppingBag, ArrowLeft } from 'lucide-react';

function OrderConfirmation() {

  const { orderId } = useParams();
  const { getOrderById } = useOrder();

  const [order, setOrder] = useState(null);

  useEffect(() => {

    const fetchOrder = async () => {
      const data = await getOrderById(Number(orderId));
      setOrder(data);
    };

    fetchOrder();

  }, [orderId, getOrderById]);


  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Order not found</h2>
          <Link to="/" className="text-blue-500 hover:underline">Go Home</Link>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
          
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Order Confirmed!
          </h1>

          <p className="text-gray-600 mb-4">
            Thank you for your purchase
          </p>

          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">

            <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
              <ShoppingBag className="w-5 h-5 mr-2" />
              Order Summary
            </h3>

            <div className="space-y-2">

              {order.items.map((item) => (

                <div key={item.id} className="flex justify-between text-sm">

                  <span>
                    {(item.product_name || item.name)} x {item.quantity}
                  </span>

                  <span>
                    ₹{Number(item.price * item.quantity).toFixed(2)}
                  </span>

                </div>

              ))}

            </div>

            <div className="border-t mt-3 pt-3">

              <div className="flex justify-between font-semibold">

                <span>Total</span>

                <span>
                  ₹{Number(order.total).toFixed(2)}
                </span>

              </div>

            </div>

          </div>


          <div className="flex gap-3 justify-center">

            <Link
              to="/orders"
              className="bg-gray-900 text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              View Orders
            </Link>

            <Link
              to="/products"
              className="border border-gray-300 text-gray-800 px-6 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Continue Shopping
            </Link>

          </div>

        </div>
      </div>
    </div>
  );
}

export default OrderConfirmation;