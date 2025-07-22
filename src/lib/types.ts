// lib/types.ts
import * as z from "zod";

// Store Location
export interface StoreLocation {
    id: string;
    name: string;
    address: string;
}

// Cart Item (from cartProvider)
export interface Product {
    id: string;
    title: string;
    priceBeforeDiscount: number;
    discount: string;
    images: string[];
    category: { name: string };
}

export interface CartItem {
    product: Product;
    quantity: number;
}

// Order
export interface Order {
    checkoutMethod: "cod" | "store-pickup";
    contact: {
        fullName: string;
        email: string;
        phone: string;
    };
    shipping?: {
        fullName: string;
        email: string;
        address: string;
        city: string;
        postalCode: string;
        country: string;
    };
    storeLocation?: string;
    pickupDate?: string;
    cartItems: CartItem[];
    subtotal: number;
    tax: number;
    codFee: number;
    total: number;
    createdAt: number;
    shippingFee?: number
    email : string;
    id? : string;
}

// Form Schemas
export const contactInfoSchema = z.object({
    fullName: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    phone: z.string().min(10, "Please enter a valid phone number"),
});

export const shippingSchema = z.object({
    fullName: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    address: z.string().min(5, "Please enter a valid address"),
    city: z.string().min(2, "City is required"),
    postalCode: z.string().min(3, "Please enter a valid postal code"),
    country: z.string().min(2, "Country is required"),
});

export const storePickupSchema = z.object({
    contact: contactInfoSchema,
    storeLocation: z.string().min(1, "Please select a store location"),
    pickupDate: z.string().min(1, "Please select a pickup date"),
});

export const codSchema = z.object({
    contact: contactInfoSchema,
    shipping: shippingSchema,
});

export const checkoutSchema = z.discriminatedUnion("checkoutMethod", [
    z.object({
        checkoutMethod: z.literal("cod"),
        ...codSchema.shape,
    }),
    z.object({
        checkoutMethod: z.literal("store-pickup"),
        ...storePickupSchema.shape,
    }),
]);

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;
export type CheckoutMethod = "cod" | "store-pickup";
