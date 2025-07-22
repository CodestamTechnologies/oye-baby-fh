"use client";

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { CreditCard } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { CheckoutFormValues } from "@/lib/types";

interface ContactInfoFormProps {
    form: UseFormReturn<CheckoutFormValues>;
}

export const ContactInfoForm: React.FC<ContactInfoFormProps> = ({ form }) => {
    return (
        <Card className="p-6 bg-gradient-to-br from-[#E6F0FA] to-[#FFFFFF] border-[#D3D3D3] shadow-lg rounded-xl">
            <h3 className="text-xl md:text-2xl font-serif font-semibold text-[#1A2A44] mb-4 flex items-center tracking-tight">
                <CreditCard className="h-5 w-5 mr-2 text-[#1A2A44]" /> Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="contact.fullName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-[#1A2A44]">Full Name</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="John Doe"
                                    {...field}
                                    className="border-[#D3D3D3] focus:border-[#1A2A44] focus:ring-[#1A2A44] bg-white text-[#1A2A44] placeholder-[#666666] transition-colors duration-200"
                                />
                            </FormControl>
                            <FormMessage className="text-[#EF4444]" /> {/* Red shade for error messages */}
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="contact.email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-[#1A2A44]">Email</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="john@example.com"
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
                    name="contact.phone"
                    render={({ field }) => (
                        <FormItem className="md:col-span-2">
                            <FormLabel className="text-[#1A2A44]">Phone Number</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="+1 (555) 123-4567"
                                    {...field}
                                    className="border-[#D3D3D3] focus:border-[#1A2A44] focus:ring-[#1A2A44] bg-white text-[#1A2A44] placeholder-[#666666] transition-colors duration-200"
                                />
                            </FormControl>
                            <FormMessage className="text-[#EF4444]" />
                        </FormItem>
                    )}
                />
            </div>
        </Card>
    );
};