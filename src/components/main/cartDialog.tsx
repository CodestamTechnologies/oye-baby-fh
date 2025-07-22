import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ShoppingCart, Truck, Trash2, Plus, Minus, Star } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { calculateDiscountedPrice, useCart } from "@/providers/cartProvider";

interface Props {
    isCartModalOpen: boolean;
    setIsCartModalOpen: (value: boolean) => void;
}

export const CartModal = ({ isCartModalOpen, setIsCartModalOpen }: Props) => {
    const { cartItems, removeFromCart, cartCount, closeCartModal, clearCart, updateQuantity } = useCart();

    const totalPrice = cartItems.reduce((total, item) => {
        const price = item.product.discount
            ? calculateDiscountedPrice(item.product.priceBeforeDiscount, item.product.discount)
            : item.product.priceBeforeDiscount;
        return total + price * item.quantity;
    }, 0);

    const [isRemoving, setIsRemoving] = useState<string | null>(null);
    const freeShippingThreshold = 100;
    const progress = Math.min((totalPrice / freeShippingThreshold) * 100, 100);

    const handleRemoveItem = (productId: string) => {
        setIsRemoving(productId);
        setTimeout(() => {
            removeFromCart(productId);
            setIsRemoving(null);
        }, 300);
    };

    return (
        <Dialog open={isCartModalOpen} onOpenChange={setIsCartModalOpen}>
            <DialogContent className="sm:max-w-[500px] max-h-[90vh] p-0 flex flex-col rounded-2xl border-[#D3D3D3] bg-gradient-to-br from-[#E6F0FA] to-[#FFFFFF] shadow-xl">
                <DialogHeader className="p-6 pb-0">
                    <DialogTitle className="flex items-center gap-2 text-2xl font-serif font-semibold text-[#1A2A44]">
                        <ShoppingCart className="h-6 w-6 text-[#1A2A44]" />
                        Your Cart ({cartCount} {cartCount === 1 ? "item" : "items"})
                    </DialogTitle>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto px-6 py-4">
                    {cartItems.length > 0 ? (
                        <div className="space-y-4">
                            {cartItems.map((item) => {
                                const discountedPrice = calculateDiscountedPrice(
                                    item.product.priceBeforeDiscount,
                                    item.product.discount
                                );
                                return (
                                    <Card
                                        key={item.product.id}
                                        className="bg-white border border-[#D3D3D3] shadow-sm hover:shadow-md rounded-xl"
                                    >
                                        <CardContent className="p-4 flex items-start gap-4">
                                            <Link href={`/product/${item.product.id}`}>
                                                <img
                                                    src={item.product.images[0]}
                                                    alt={item.product.title}
                                                    className="w-20 h-20 object-cover rounded-lg border border-[#D3D3D3]"
                                                />
                                            </Link>
                                            <div className="flex-1">
                                                <Link href={`/product/${item.product.id}`}>
                                                    <h3 className="font-medium text-[#1A2A44] hover:text-[#14263A] transition-colors font-serif">
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
                                                    <Button variant="outline" size="icon" className="h-8 w-8 rounded-full border-[#D3D3D3] text-[#1A2A44] hover:bg-[#E6F0FA]"
                                                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                                        disabled={isRemoving === item.product.id}>
                                                        <Minus className="h-4 w-4" />
                                                    </Button>
                                                    <span className="text-sm font-medium w-8 text-center text-[#1A2A44]">{item.quantity}</span>
                                                    <Button variant="outline" size="icon" className="h-8 w-8 rounded-full border-[#D3D3D3] text-[#1A2A44] hover:bg-[#E6F0FA]"
                                                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                                        disabled={isRemoving === item.product.id}>
                                                        <Plus className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                                <div className="mt-2 flex items-center justify-between">
                                                    <p className="text-sm font-medium text-[#1A2A44] font-serif">
                                                        ₹{discountedPrice.toFixed(2)} x {item.quantity} = ₹{(discountedPrice * item.quantity).toFixed(2)}
                                                    </p>
                                                    <Button variant="ghost" size="icon"
                                                        className="text-[#1A2A44] hover:bg-[#E6F0FA] rounded-full"
                                                        onClick={() => handleRemoveItem(item.product.id)}
                                                        disabled={isRemoving === item.product.id}>
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
                    ) : (
                        <div className="text-center py-12">
                            <ShoppingCart className="h-20 w-20 text-[#1A2A44] mx-auto mb-4" />
                            <h3 className="text-xl font-medium text-[#1A2A44] font-serif">Your Cart is Empty</h3>
                            <p className="text-sm text-[#666666] mt-2 mb-6">Let’s find something beautiful!</p>
                            <Button className="bg-[#1A2A44] hover:bg-[#14263A] text-white px-6 py-2" onClick={closeCartModal}>
                                Start Shopping
                            </Button>
                        </div>
                    )}
                </div>

                {cartItems.length > 0 && (
                    <DialogFooter className="p-6 border-t border-[#D3D3D3] bg-gradient-to-tr from-[#E6F0FA] to-[#FFFFFF]">
                        <div className="w-full space-y-4">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm text-[#1A2A44]">
                                    <Truck className="h-4 w-4 text-[#1A2A44]" />
                                    <span>
                                        {totalPrice >= freeShippingThreshold
                                            ? "You qualify for free shipping!"
                                            : `Add ₹${(freeShippingThreshold - totalPrice).toFixed(2)} more for free shipping`}
                                    </span>
                                </div>
                                <Progress value={progress} className="h-2 bg-[#D3D3D3]" />
                            </div>

                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between text-[#1A2A44]">
                                    <span>Subtotal</span>
                                    <span>₹{totalPrice.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-[#1A2A44]">
                                    <span>Estimated Shipping</span>
                                    <span>{totalPrice >= freeShippingThreshold ? "Free" : "₹10.00"}</span>
                                </div>
                                <div className="flex justify-between pt-2 border-t border-[#D3D3D3] font-serif font-medium text-lg text-[#1A2A44]">
                                    <span>Total</span>
                                    <span>₹{(totalPrice + (totalPrice >= freeShippingThreshold ? 0 : 10)).toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Link href="/cart">
                                    <Button className="w-full bg-[#1A2A44] hover:bg-[#14263A] text-white font-medium py-3 rounded-lg"
                                        onClick={closeCartModal}>
                                        Proceed to Checkout
                                    </Button>
                                </Link>
                                <div className="flex gap-3 mt-3">
                                    <Button variant="outline" className="flex-1 border-[#D3D3D3] text-[#1A2A44] hover:bg-[#E6F0FA]"
                                        onClick={closeCartModal}>
                                        Continue Shopping
                                    </Button>
                                    <Button variant="outline" className="flex-1 border-[#D3D3D3] text-[#1A2A44] hover:bg-[#E6F0FA]"
                                        onClick={() => {
                                            if (window.confirm("Are you sure you want to clear your cart?")) {
                                                clearCart();
                                            }
                                        }}>
                                        Clear Cart
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </DialogFooter>
                )}
            </DialogContent>
        </Dialog>
    );
};