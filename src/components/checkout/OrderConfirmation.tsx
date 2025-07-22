"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  CheckCircle,
  Gift,
  RefreshCw,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { CheckoutMethod } from "@/lib/types";
import Link from "next/link";

interface OrderConfirmationProps {
  checkoutMethod: CheckoutMethod;
  orderId: string;
}

export const OrderConfirmation: React.FC<OrderConfirmationProps> = ({
  checkoutMethod,
  orderId,
}) => {
  const currentDate = new Date();
  const estimatedDeliveryDate = new Date(currentDate);
  estimatedDeliveryDate.setDate(currentDate.getDate() + (checkoutMethod === "store-pickup" ? 0 : 3)); // 3 days for delivery, 0 for pickup

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#E6F0FA] to-[#FFFFFF]">
      {/* Order Confirmed Section */}
      <section className="py-16 px-6">
        <div className="max-w-2xl mx-auto text-center bg-white p-8 rounded-xl shadow-md border border-[#D3D3D3]">
          <CheckCircle className="h-16 w-16 text-[#2E7D32] mx-auto mb-6" /> {/* Green for confirmation */}
          <h2 className="text-3xl font-serif font-semibold text-[#1A2A44] mb-3">
            Order Confirmed!
          </h2>
          <p className="text-[#666666] mb-6">
            Thank you for your purchase. We&lsquo;ve sent a confirmation to your email at 02:29 PM IST on Saturday, July 19, 2025.
          </p>

          <div className="mb-8 p-4 bg-[#E6F0FA] border border-[#D3D3D3] rounded-lg">
            <p className="text-sm text-[#1A2A44] mb-1">
              Order number:{" "}
              <span className="font-medium text-[#1A2A44]">{orderId}</span>
            </p>
            {checkoutMethod === "store-pickup" ? (
              <p className="text-sm text-[#1A2A44]">
                Ready for pickup on{" "}
                <span className="font-medium">
                  {estimatedDeliveryDate.toLocaleDateString("en-IN", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
              </p>
            ) : (
              <p className="text-sm text-[#1A2A44]">
                Estimated delivery:{" "}
                <span className="font-medium">
                  {estimatedDeliveryDate.toLocaleDateString("en-IN", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
              </p>
            )}
          </div>

          <Link href="/">
            <Button className="bg-[#1A2A44] hover:bg-[#14263A] text-[#FFFFFF] rounded-full px-6 py-3">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 mt-auto">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 text-center bg-gradient-to-br from-[#E6F0FA] to-[#FFFFFF] border border-[#D3D3D3] hover:shadow-lg transition-all duration-200">
              <Truck className="h-10 w-10 mx-auto mb-4 text-[#1A2A44]" />
              <h3 className="font-medium text-[#1A2A44] mb-2">Free Shipping</h3>
              <p className="text-sm text-[#666666]">
                On all orders over ₹1000
              </p>
            </Card>

            <Card className="p-6 text-center bg-gradient-to-br from-[#E6F0FA] to-[#FFFFFF] border border-[#D3D3D3] hover:shadow-lg transition-all duration-200">
              <RefreshCw className="h-10 w-10 mx-auto mb-4 text-[#1A2A44]" />
              <h3 className="font-medium text-[#1A2A44] mb-2">Easy Returns</h3>
              <p className="text-sm text-[#666666]">30-day return policy</p>
            </Card>

            <Card className="p-6 text-center bg-gradient-to-br from-[#E6F0FA] to-[#FFFFFF] border border-[#D3D3D3] hover:shadow-lg transition-all duration-200">
              <ShieldCheck className="h-10 w-10 mx-auto mb-4 text-[#1A2A44]" />
              <h3 className="font-medium text-[#1A2A44] mb-2">
                Secure Payment
              </h3>
              <p className="text-sm text-[#666666]">Protected by encryption</p>
            </Card>

            <Card className="p-6 text-center bg-gradient-to-br from-[#E6F0FA] to-[#FFFFFF] border border-[#D3D3D3] hover:shadow-lg transition-all duration-200">
              <Gift className="h-10 w-10 mx-auto mb-4 text-[#1A2A44]" />
              <h3 className="font-medium text-[#1A2A44] mb-2">Gift Cards</h3>
              <p className="text-sm text-[#666666]">
                Perfect for any occasion
              </p>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};