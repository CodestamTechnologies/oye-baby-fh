"use client";

import { Button } from "@/components/ui/button";
import { PackageCheck } from "lucide-react";
import { useCart } from "@/providers/cartProvider"; // adjust this if you have a different hook/provider
import { format } from "date-fns";
import Link from "next/link";

const OrdersPage = () => {
    const { orders } = useCart(); // or use your actual orders fetching logic

    return (
        <div className="flex flex-col min-h-screen  bg-[url('/bg-19.jpg')] bg-cover bg-center bg-no-repeat relative">
                  <div className="absolute inset-0 bg-black/10"></div>

            <section className="py-16 px-6 z-40">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-12">
                        <div className=" p-2 rounded-lg">
                            {/* Added white background with 80% opacity for contrast */}
                            <h2 className="text-3xl md:text-4xl font-bold text-[#1A2A44] mb-3 tracking-tight">
                                My Orders
                            </h2>
                            <p className="text-[#0e0d0d] text-lg">
                                Track your recent purchases
                            </p>
                        </div>
                        <Link href="/" className="flex items-center">
                            <Button
                                className="mt-4 md:mt-0 bg-[#1A2A44] border-[1px] border-white cursor-pointer text-[#FFFFFF] hover:bg-[#14263A] transition-colors duration-200 rounded-full px-6 py-6"
                            >
                                Back to Shopping
                            </Button>
                        </Link>
                    </div>

                    {orders.length === 0 ? (
                        <div className="text-center py-12 bg-white/80 rounded-xl shadow-lg border border-[#D3D3D3]">
                            {/* Adjusted background to 80% opacity white */}
                            <PackageCheck className="h-16 w-16 text-[#1A2A44] mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-[#1A2A44] mb-2">
                                No orders yet
                            </h3>
                            <p className="text-[#666666] mb-6">
                                Place an order to see it listed here
                            </p>
                            <Button
                                className="bg-[#1A2A44] text-[#FFFFFF] hover:bg-[#14263A] transition-colors duration-200 rounded-full px-6 py-3"
                                onClick={() => window.location.href = "/"}
                            >
                                Start Shopping
                            </Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {orders.map((order) => (
                                <div
                                    key={order.id}
                                    className="border border-[#D3D3D3] bg-white shadow-sm hover:shadow-xl transition-all duration-300 rounded-xl p-6"
                                >
                                    <div className="flex justify-between items-center mb-4">
                                        <h4 className="text-lg font-semibold text-[#1A2A44]">
                                            Order #{order.id}
                                        </h4>
                                        <span className="text-sm text-[#666666]">
                                            {format(new Date(order.createdAt), "PPP")}
                                        </span>
                                    </div>
                                    <div className="text-[#666666] mb-2">
                                        Method: <strong className="text-[#1A2A44] capitalize">{order.checkoutMethod}</strong>
                                    </div>
                                    <div className="text-[#666666] mb-4">
                                        Total: <strong className="text-[#1A2A44]">₹{order.total.toFixed(2)}</strong>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="border-[#D3D3D3] text-[#1A2A44] hover:bg-[#E6F0FA] hover:text-[#14263A] transition-colors duration-200 rounded-full"
                                        onClick={() => window.location.href = `/orders/${order.id}`}
                                    >
                                        View Details
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default OrdersPage;