"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Home, ShieldCheck } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { CheckoutFormValues } from "@/lib/types";

interface ShippingInfoFormProps {
  form: UseFormReturn<CheckoutFormValues>;
  codFee: number;
}

export const ShippingInfoForm: React.FC<ShippingInfoFormProps> = ({
  form,
  codFee,
}) => {
  return (
    <Card className="p-6 bg-gradient-to-br from-[#E6F0FA] to-[#FFFFFF] border-[#D3D3D3] shadow-lg rounded-xl">
      <h3 className="text-xl md:text-2xl font-serif font-semibold text-[#1A2A44] mb-4 flex items-center tracking-tight">
        <Home className="h-5 w-5 mr-2 text-[#1A2A44]" /> Delivery Address
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="shipping.address"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel className="text-[#1A2A44]">Address</FormLabel>
              <FormControl>
                <Input
                  placeholder="123 Main St"
                  {...field}
                  className="border-[#D3D3D3] focus:border-[#1A2A44] focus:ring-[#1A2A44] bg-white text-[#1A2A44] placeholder-[#666666] transition-colors duration-200"
                />
              </FormControl>
              <FormMessage className="text-[#EF4444]" /> {/* Softer red for errors */}
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="shipping.city"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#1A2A44]">City</FormLabel>
              <FormControl>
                <Input
                  placeholder="New York"
                  {...field}
                  className="border-[#D3D3D3] focus:border-[#1A2A44] focus:ring-[#1A2A44] bg-white text-[#1A2A44] placeholder-[#666666] transition-colors duration-200"
                />
              </FormControl>
              <FormMessage className="text-[#EF4444]" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="shipping.postalCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#1A2A44]">Postal Code</FormLabel>
              <FormControl>
                <Input
                  placeholder="10001"
                  {...field}
                  className="border-[#D3D3D3] focus:border-[#1A2A44] focus:ring-[#1A2A44] bg-white text-[#1A2A44] placeholder-[#666666] transition-colors duration-200"
                />
              </FormControl>
              <FormMessage className="text-[#EF4444]" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="shipping.country"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel className="text-[#1A2A44]">Country</FormLabel>
              <FormControl>
                <Input
                  placeholder="United States"
                  {...field}
                  className="border-[#D3D3D3] focus:border-[#1A2A44] focus:ring-[#1A2A44] bg-white text-[#1A2A44] placeholder-[#666666] transition-colors duration-200"
                />
              </FormControl>
              <FormMessage className="text-[#EF4444]" />
            </FormItem>
          )}
        />
      </div>
      <div className="mt-6 p-4 bg-[#E6F0FA] border border-[#D3D3D3] rounded-lg">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <ShieldCheck className="h-5 w-5 text-[#1A2A44] mt-1" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-[#1A2A44] font-medium">
              A cash on delivery fee of ₹{codFee.toFixed(2)} will be added to your total.
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};