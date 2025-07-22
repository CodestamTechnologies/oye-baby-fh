"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ShoppingCart, Truck, Trash2, Plus, Minus, Star } from "lucide-react";
import Link from "next/link";
import { calculateDiscountedPrice, useCart } from "@/providers/cartProvider";
import { useState } from "react";

const CartPage = () => {
    const { cartItems, removeFromCart, cartCount, clearCart, updateQuantity } = useCart();

    // Calculate total price
    const totalPrice = cartItems.reduce((total, item) => {
        const price = item.product.discount
            ? calculateDiscountedPrice(item.product.priceBeforeDiscount, item.product.discount)
            : item.product.priceBeforeDiscount;
        return total + price * item.quantity;
    }, 0);

    // State for loading (e.g., when removing items)
    const [isRemoving, setIsRemoving] = useState<string | null>(null);

    // Free shipping progress
    const freeShippingThreshold = 100;
    const progress = Math.min((totalPrice / freeShippingThreshold) * 100, 100);

    // Simulate removing item with a delay
    const handleRemoveItem = (productId: string) => {
        setIsRemoving(productId);
        setTimeout(() => {
            removeFromCart(productId);
            setIsRemoving(null);
        }, 300);
    };

    return (
        <div className="min-h-screen bg-[url('/bg-18.jpg')] bg-cover bg-center bg-no-repeat relative p-6">
                  {/* <div className="absolute inset-0 bg-black/10"></div> */}

            <div className="max-w-4xl mx-auto relative z-20">
                {/* Header */}
                <h1 className="flex items-center gap-2 text-3xl md:text-4xl font-bold text-[#1A2A44] mb-6 tracking-tight">
                    <ShoppingCart className="h-8 w-8 text-[#1A2A44]" />
                    Your Cart ({cartCount} {cartCount === 1 ? "item" : "items"})
                </h1>

                {/* Main Content */}
                {cartItems.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 z-50">
                        {/* Cart Items */}
                        <div className="lg:col-span-2 space-y-4  relative z-20">
                            {cartItems.map((item) => {
                                const discountedPrice = calculateDiscountedPrice(
                                    item.product.priceBeforeDiscount,
                                    item.product.discount
                                );
                                return (
                                    <Card
                                        key={item.product.id}
                                        className="border-[#D3D3D3] bg-white shadow-sm hover:shadow-xl transition-all duration-300 rounded-xl"
                                    >
                                        <CardContent className="p-4 flex items-start gap-4">
                                            <Link href={`/product/${item.product.id}`}>
                                                <img
                                                    src={item.product.images[0]}
                                                    alt={item.product.title}
                                                    className="w-20 h-20 object-cover rounded-lg border border-[#D3D3D3] hover:scale-105 transition-transform duration-200"
                                                />
                                            </Link>
                                            <div className="flex-1">
                                                <Link href={`/product/${item.product.id}`}>
                                                    <h3 className="font-medium text-[#1A2A44] hover:text-[#14263A] transition-colors duration-200">
                                                        {item.product.title}
                                                    </h3>
                                                </Link>
                                                <p className="text-sm text-[#666666]">{item.product.category.name}</p>
                                                <div className="flex items-center gap-1 text-sm text-[#666666]">
                                                    <Star className="h-4 w-4 fill-[#1A2A44] text-[#1A2A44]" />
                                                    <span>{item.product.ratings}</span>
                                                </div>
                                                {item.product.colors.length > 0 && (
                                                    <p className="text-sm text-[#666666]">
                                                        Color: {item.product.colors[0].name}
                                                    </p>
                                                )}
                                                <div className="flex items-center gap-2 mt-2">
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        className="h-8 w-8 rounded-full border-[#D3D3D3] text-[#1A2A44] hover:bg-[#E6F0FA] hover:text-[#14263A]"
                                                        onClick={() =>
                                                            updateQuantity(item.product.id, item.quantity - 1)
                                                        }
                                                        disabled={isRemoving === item.product.id}
                                                    >
                                                        <Minus className="h-4 w-4" />
                                                    </Button>
                                                    <span className="text-sm font-medium text-[#1A2A44] w-8 text-center">
                                                        {item.quantity}
                                                    </span>
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        className="h-8 w-8 rounded-full border-[#D3D3D3] text-[#1A2A44] hover:bg-[#E6F0FA] hover:text-[#14263A]"
                                                        onClick={() =>
                                                            updateQuantity(item.product.id, item.quantity + 1)
                                                        }
                                                        disabled={isRemoving === item.product.id}
                                                    >
                                                        <Plus className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                                <div className="mt-2 flex items-center justify-between">
                                                    <p className="text-sm font-medium text-[#1A2A44]">
                                                        ₹{discountedPrice.toFixed(2)} x {item.quantity} = ₹
                                                        {(discountedPrice * item.quantity).toFixed(2)}
                                                    </p>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="text-[#1A2A44] hover:bg-[#E6F0FA] rounded-full"
                                                        onClick={() => handleRemoveItem(item.product.id)}
                                                        disabled={isRemoving === item.product.id}
                                                    >
                                                        {isRemoving === item.product.id ? (
                                                            <div className="h-4 w-4 border-t-2 border-[#1A2A44] rounded-full animate-spin" />
                                                        ) : (
                                                            <Trash2 className="h-4 w-4" />
                                                        )}
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>

                        {/* Cart Summary */}
                        <div className="lg:col-span-1 z-50">
                            <div className="sticky top-6 bg-white p-6 rounded-xl border border-[#D3D3D3] shadow-lg">
                                <h2 className="text-lg font-semibold text-[#1A2A44] mb-4">Order Summary</h2>
                                {/* Free Shipping Progress */}
                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center gap-2 text-sm text-[#666666]">
                                        <Truck className="h-4 w-4 text-[#1A2A44]" />
                                        <span>
                                            {totalPrice >= freeShippingThreshold
                                                ? "You qualify for free shipping!"
                                                : `Add ₹${(freeShippingThreshold - totalPrice).toFixed(2)} more for free shipping`}
                                        </span>
                                    </div>
                                    <Progress value={progress} className="h-2 bg-[#D3D3D3] [&>*]:bg-[#1A2A44]" />
                                </div>
                                {/* Summary Details */}
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm text-[#666666]">
                                        <span>Subtotal</span>
                                        <span>₹{totalPrice.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-[#666666]">
                                        <span>Estimated Shipping</span>
                                        <span>{totalPrice >= freeShippingThreshold ? "Free" : "₹5.00"}</span>
                                    </div>
                                    <div className="flex justify-between items-center pt-2 border-t border-[#D3D3D3]">
                                        <span className="text-lg font-medium text-[#1A2A44]">Total</span>
                                        <span className="text-xl font-semibold text-[#1A2A44]">
                                            ₹{(totalPrice + (totalPrice >= freeShippingThreshold ? 0 : 5)).toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                                {/* Actions */}
                                <div className="space-y-3 mt-6">
                                    <Link href="/checkout">
                                        <Button className="w-full bg-[#1A2A44] hover:bg-[#14263A] text-white font-medium py-3 rounded-lg">
                                            Proceed to Checkout
                                        </Button>
                                    </Link>
                                    <div className="flex lg:flex-col gap-2 mt-6">
                                        <Link href="/" className="flex-1">
                                            <Button
                                                variant="outline"
                                                className="w-full border-[#D3D3D3] text-[#1A2A44] hover:bg-[#E6F0FA] hover:text-[#14263A]"
                                            >
                                                Continue Shopping
                                            </Button>
                                        </Link>
                                        <Button
                                            variant="outline"
                                            className="flex-1 border-[#D3D3D3] text-[#1A2A44] hover:bg-[#E6F0FA] hover:text-[#14263A]"
                                            onClick={() => {
                                                if (window.confirm("Are you sure you want to clear your cart?")) {
                                                    clearCart();
                                                }
                                            }}
                                        >
                                            Clear Cart
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-12 bg-white/80 rounded-xl shadow-lg border border-[#D3D3D3] relative z-20">
                        <ShoppingCart className="h-20 w-20 text-[#1A2A44] mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-[#1A2A44] mb-2">Your Cart is Empty</h3>
                        <p className="text-sm text-[#666666] mt-2 mb-6">
                            Looks like you haven’t added anything yet. Let’s find something amazing!
                        </p>
                        <Link href="/">
                            <Button className="bg-[#1A2A44] hover:bg-[#14263A] text-white px-6 py-2 rounded-full">
                                Start Shopping
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartPage;