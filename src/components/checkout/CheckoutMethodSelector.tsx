"use client";

import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Home, Store } from "lucide-react";
import { CheckoutMethod } from "@/lib/types";

interface CheckoutMethodSelectorProps {
    checkoutMethod: CheckoutMethod;
    onChange: (value: CheckoutMethod) => void;
}

export const CheckoutMethodSelector: React.FC<CheckoutMethodSelectorProps> = ({ checkoutMethod, onChange }) => {
    return (
        <Card className="p-6 bg-gradient-to-br from-[#E6F0FA] to-[#FFFFFF] border-[#D3D3D3] shadow-lg rounded-xl">
            <h3 className="text-xl md:text-2xl font-serif font-semibold text-[#1A2A44] mb-4 tracking-tight">
                Checkout Method
            </h3>
            <RadioGroup
                value={checkoutMethod}
                onValueChange={(value) => onChange(value as CheckoutMethod)}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
                <div
                    className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                        checkoutMethod === "cod"
                            ? "border-[#1A2A44] bg-[#E6F0FA] shadow-md"
                            : "border-[#D3D3D3] hover:bg-[#E6F0FA]"
                    }`}
                >
                    <RadioGroupItem value="cod" id="cod" className="sr-only" />
                    <label
                        htmlFor="cod"
                        className="flex flex-col items-center cursor-pointer"
                    >
                        <Home className="h-8 w-8 mb-2 text-[#1A2A44]" />
                        <span className="font-medium text-[#1A2A44]">Cash on Delivery</span>
                        <span className="text-xs text-[#666666] text-center mt-1">
                            Pay when you receive
                        </span>
                    </label>
                </div>
                <div
                    className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                        checkoutMethod === "store-pickup"
                            ? "border-[#1A2A44] bg-[#E6F0FA] shadow-md"
                            : "border-[#D3D3D3] hover:bg-[#E6F0FA]"
                    }`}
                >
                    <RadioGroupItem value="store-pickup" id="store-pickup" className="sr-only" />
                    <label
                        htmlFor="store-pickup"
                        className="flex flex-col items-center cursor-pointer"
                    >
                        <Store className="h-8 w-8 mb-2 text-[#1A2A44]" />
                        <span className="font-medium text-[#1A2A44]">Store Pickup</span>
                        <span className="text-xs text-[#666666] text-center mt-1">
                            Collect from our store
                        </span>
                    </label>
                </div>
            </RadioGroup>
        </Card>
    );
};