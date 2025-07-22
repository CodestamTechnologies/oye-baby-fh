"use client";

import { useParams } from "next/navigation";
import { useCart } from "@/providers/cartProvider";
import { Button } from "@/components/ui/button";
import { PackageCheck, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";

const OrderDetailsPage = () => {
  const { id } = useParams();
  const { orders } = useCart();
  const order = orders.find((o) => o.id === id);

  if (!order) {
    return (
      <div className="flex flex-col min-h-screen  border-2 border-white bg-[url('/bg-21.jpg')] bg-cover bg-center bg-no-repeat">
        <section className="py-16 px-6 ">
          <div className="max-w-7xl mx-auto text-center">
            <PackageCheck className="h-16 w-16 text-[#1A2A44] mx-auto mb-4" />
            <h3 className="text-xl font-serif font-medium text-[#1A2A44] mb-2">Order not found</h3>
            <p className="text-[#666666] mb-6">We couldn&lsquo;t find the order you&lsquo;re looking for.</p>
            <div className="flex justify-center gap-4">
              <Button asChild variant="outline">
                <Link href="/orders">
                  <ArrowLeft className="mr-2 h-4 w-4 text-[#1A2A44]" /> Back to Orders
                </Link>
              </Button>
              <Button asChild className="bg-[#1A2A44] hover:bg-[#14263A] text-[#FFFFFF] rounded-full px-6 py-3">
                <Link href="/">Start Shopping</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen border-2 border-white bg-[url('/bg-21.jpg')] bg-cover bg-center bg-no-repeat">
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center mb-10">
            <div>
              <h2 className="text-3xl font-serif font-semibold text-[#1A2A44] mb-2 tracking-tight">
                Order #{order.id?.slice(0, 8)}
              </h2>
              <p className="text-[#666666]">
                Placed on {format(new Date(order.createdAt), "PPPp")}
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/orders" className="text-[#1A2A44] hover:text-[#14263A]">
                Back to Orders
              </Link>
            </Button>
          </div>

          {/* Customer and Shipping/Pickup Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            <div className="border rounded-xl p-6 bg-white shadow-sm border-[#D3D3D3]">
              <h3 className="text-lg font-medium text-[#1A2A44] mb-4 font-serif">Customer Information</h3>
              <div className="space-y-2 text-[#666666]">
                <p><strong>Name:</strong> {order.contact.fullName}</p>
                <p><strong>Email:</strong> {order.contact.email}</p>
                <p><strong>Phone:</strong> {order.contact.phone}</p>
              </div>
            </div>

            <div className="border rounded-xl p-6 bg-white shadow-sm border-[#D3D3D3]">
              <h3 className="text-lg font-medium text-[#1A2A44] mb-4 font-serif">
                {order.checkoutMethod === "store-pickup" ? "Pickup Information" : "Shipping Information"}
              </h3>
              <div className="space-y-2 text-[#666666]">
                {order.checkoutMethod === "store-pickup" ? (
                  <>
                    <p><strong>Store Location:</strong> {order.storeLocation}</p>
                    <p><strong>Pickup Date:</strong> {order.pickupDate}</p>
                  </>
                ) : (
                  <>
                    <p><strong>Address:</strong> {order.shipping?.address}</p>
                    <p><strong>City:</strong> {order.shipping?.city}</p>
                    <p><strong>Postal Code:</strong> {order.shipping?.postalCode}</p>
                    <p><strong>Country:</strong> {order.shipping?.country}</p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="border rounded-xl p-6 bg-white shadow-sm border-[#D3D3D3] mb-10">
            <h3 className="text-lg font-medium text-[#1A2A44] mb-4 font-serif">Order Summary</h3>
            <div className="divide-y divide-[#D3D3D3]">
              {order.cartItems.map((item) => (
                <div key={item.product.id} className="py-4 flex justify-between items-start">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-[#E6F0FA] rounded-md overflow-hidden">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium text-[#1A2A44]">{item.product.title}</p>
                      <p className="text-sm text-[#666666]">{item.product.category.name}</p>
                      <p className="text-sm text-[#666666]">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-[#1A2A44]">
                      ₹{(item.product.priceBeforeDiscount * item.quantity).toFixed(2)}
                    </p>
                    {item.product.discount && (
                      <p className="text-sm text-[#666666] line-through">
                        ₹{(item.product.priceBeforeDiscount * item.quantity).toFixed(2)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="border-t pt-4 mt-4 space-y-2 text-[#666666]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{order.subtotal.toFixed(2)}</span>
              </div>
              {order.shippingFee && (
                <div className="flex justify-between">
                  <span>Shipping Fee</span>
                  <span>₹{order.shippingFee.toFixed(2)}</span>
                </div>
              )}
              {order.checkoutMethod === "cod" && (
                <div className="flex justify-between">
                  <span>COD Fee</span>
                  <span>₹{order.codFee.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Tax</span>
                <span>₹{order.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-semibold text-lg pt-2 border-t border-[#D3D3D3] text-[#1A2A44]">
                <span>Total</span>
                <span>₹{order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button className="bg-[#1A2A44] hover:bg-[#14263A] text-[#FFFFFF] rounded-full px-6 py-3" asChild>
              <Link href="/">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OrderDetailsPage;