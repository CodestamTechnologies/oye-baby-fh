"use client";

import { useEffect, useState } from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { MapPin, ShieldCheck, Store } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { db } from "@/lib/firebase";
import { StoreLocation, CheckoutFormValues } from "@/lib/types";
import { collection, getDocs } from "firebase/firestore";

// Dummy store locations for fallback or testing
const DUMMY_STORES: StoreLocation[] = [
  {
    id: "store-1",
    name: "F&H",
    address: "Astor Green, Kanke Road, Gandhi Nagar, Shop No 13",
  },
];

interface StorePickupFormProps {
  form: UseFormReturn<CheckoutFormValues>;
}

export const StorePickupForm: React.FC<StorePickupFormProps> = ({ form }) => {
  const [storeLocations, setStoreLocations] = useState<StoreLocation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStoreLocations = async () => {
      try {
        setIsLoading(true);
        const querySnapshot = await getDocs(collection(db, "storeLocations"));
        const locations = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as StoreLocation[];

        setStoreLocations(locations.length > 0 ? locations : DUMMY_STORES);
      } catch (error) {
        console.error("Error fetching store locations:", error);
        setStoreLocations(DUMMY_STORES);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStoreLocations();
  }, []);

  const currentDate = new Date().toISOString().split("T")[0]; // 2025-07-21

  return (
    <Card className="p-6 bg-gradient-to-br from-[#E6F0FA] to-[#FFFFFF] border-[#D3D3D3] shadow-lg rounded-xl">
      <h3 className="text-xl md:text-2xl font-serif font-semibold text-[#1A2A44] mb-4 flex items-center tracking-tight">
        <Store className="h-5 w-5 mr-2 text-[#1A2A44]" /> Store Pickup Details
      </h3>

      <div className="space-y-6">
        <FormField
          control={form.control}
          name="storeLocation"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#1A2A44]">Select Store Location</FormLabel>
              <div className="grid grid-cols-1 gap-3 mt-2">
                {isLoading ? (
                  <p className="text-sm text-[#666666]">Loading store locations...</p>
                ) : storeLocations.length === 0 ? (
                  <p className="text-sm text-[#EF4444]">No store locations available.</p>
                ) : (
                  storeLocations.map((store) => (
                    <div
                      key={store.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                        field.value === store.id
                          ? "border-[#1A2A44] bg-[#E6F0FA]"
                          : "border-[#D3D3D3] hover:border-[#1A2A44]"
                      }`}
                      onClick={() => form.setValue("storeLocation", store.id)}
                    >
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mt-1">
                          <MapPin className="h-5 w-5 text-[#1A2A44]" />
                        </div>
                        <div className="ml-3">
                          <h4 className="font-medium text-[#1A2A44]">{store.name}</h4>
                          <p className="text-sm text-[#666666]">{store.address}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <FormMessage className="text-[#EF4444]" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="pickupDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#1A2A44]">Select Pickup Date</FormLabel>
              <FormControl>
                <Input
                  type="date"
                  min={currentDate}
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
              Your order will be available for pickup on your selected date.
              Please bring a valid ID.
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};