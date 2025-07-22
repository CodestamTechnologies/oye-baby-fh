"use client";

import { Card } from "@/components/ui/card";
import { calculateDiscountedPrice, CartItem } from "@/providers/cartProvider";

interface OrderSummaryProps {
    cartItems: CartItem[];
    checkoutMethod: "cod" | "store-pickup";
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({ cartItems, checkoutMethod }) => {
    const subtotal = cartItems.reduce((total, item: CartItem) => {
        const price = item.product.discount
            ? calculateDiscountedPrice(item.product.priceBeforeDiscount, item.product.discount)
            : item.product.priceBeforeDiscount;
        return total + price * item.quantity;
    }, 0);

    const shipping = checkoutMethod === "store-pickup" ? 0 : subtotal > 100 ? 0 : 10;
    const tax = subtotal * 0.08;
    const codFee = checkoutMethod === "cod" ? 5 : 0;
    const total = subtotal + shipping + tax + codFee;

    return (
        <Card className="p-6 bg-gradient-to-br from-[#E6F0FA] to-[#FFFFFF] border-[#D3D3D3] shadow-lg rounded-xl">
            <h3 className="text-xl md:text-2xl font-serif font-semibold text-[#1A2A44] mb-4 tracking-tight">
                Order Summary
            </h3>
            <div className="space-y-4 max-h-80 overflow-y-auto scrollbar-hide mb-4">
                {cartItems.map((item: CartItem, index: number) => (
                    <div key={index} className="flex justify-between items-center">
                        <div className="flex items-center">
                            <div className="relative w-16 h-16 bg-[#E6F0FA] rounded-lg mr-4 overflow-hidden group">
                                <img
                                    src={item.product.images[0] || `/api/placeholder/64/64?text=${item.product.title}`}
                                    alt={item.product.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                />
                                {item.quantity > 1 && (
                                    <div className="absolute -top-1 -right-1 bg-[#1A2A44] text-[#FFFFFF] text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                        {item.quantity}
                                    </div>
                                )}
                            </div>
                            <div>
                                <p className="font-medium text-sm text-[#1A2A44]">{item.product.title}</p>
                                <p className="text-xs text-[#666666]">{item.product.category.name}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            {item.product.discount ? (
                                <>
                                    <p className="font-medium text-[#1A2A44]">
                                        ₹{calculateDiscountedPrice(item.product.priceBeforeDiscount, item.product.discount).toFixed(2)}
                                    </p>
                                    <p className="text-xs text-[#666666] line-through">
                                        ₹{item.product.priceBeforeDiscount.toFixed(2)}
                                    </p>
                                </>
                            ) : (
                                <p className="font-medium text-[#1A2A44]">₹{item.product.priceBeforeDiscount.toFixed(2)}</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            <hr className="my-4 border-[#D3D3D3]" />
            <div className="space-y-2">
                <div className="flex justify-between text-sm">
                    <p className="text-[#666666]">Subtotal</p>
                    <p className="font-medium text-[#1A2A44]">₹{subtotal.toFixed(2)}</p>
                </div>
                <div className="flex justify-between text-sm">
                    <p className="text-[#666666]">Shipping</p>
                    {shipping === 0 ? (
                        <p className="font-medium text-[#2E7D32]">Free</p> 
                    ) : (
                        <p className="font-medium text-[#1A2A44]">₹{shipping.toFixed(2)}</p>
                    )}
                </div>
                {codFee > 0 && (
                    <div className="flex justify-between text-sm">
                        <p className="text-[#666666]">Cash on Delivery Fee</p>
                        <p className="font-medium text-[#1A2A44]">₹{codFee.toFixed(2)}</p>
                    </div>
                )}
                <div className="flex justify-between text-sm">
                    <p className="text-[#666666]">Tax (8%)</p>
                    <p className="font-medium text-[#1A2A44]">₹{tax.toFixed(2)}</p>
                </div>
                <div className="flex justify-between text-lg font-semibold pt-2 border-t border-[#D3D3D3]">
                    <p className="text-[#1A2A44]">Total</p>
                    <p className="text-[#1A2A44]">₹{total.toFixed(2)}</p>
                </div>
            </div>
        </Card>
    );
};