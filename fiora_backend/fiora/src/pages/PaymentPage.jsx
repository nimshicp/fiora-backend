import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useOrder } from '../context/OrderContext'
import Payment from '../components/Payment'

function PaymentPage() {

  const { orderId } = useParams()
  const { getOrderById } = useOrder()
  const navigate = useNavigate()

  const [order, setOrder] = useState(null)

  useEffect(() => {
  const fetchOrder = async () => {
    const data = await getOrderById(Number(orderId))
    setOrder(data)
  }

  fetchOrder()
}, [orderId, getOrderById])



useEffect(() => {
  if (order?.payment_status === "paid") {
    navigate(`/order-confirmation/${order.id}`);
  }
}, [order, navigate]);

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Order not found</h2>
          <p>Please try again from the beginning</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Payment order={order} amount={order.total} />
      </div>
    </div>
  )
}

export default PaymentPage