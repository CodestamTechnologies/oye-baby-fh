'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Mail, Phone, ShieldCheck, MapPin, User, Home,Shield } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen w-full bg-white px-4 md:px-20 py-12 text-gray-800">
      <section className="max-w-4xl mx-auto space-y-10">
        <header>
            <div className="flex gap-2 items-center justify-center">
             <Shield  className=" mt-1 text-4xl font-bold mb-1 text-center" />
          <h1 className="text-4xl font-bold mb-1 text-center">Privacy Policy</h1>
            </div>
          <p className="text-sm text-gray-500 text-center">Last updated: April 19, 2025</p>
          <Separator className="my-4" />
        </header>

        {/* Section: Information We Collect */}
        <Card>
          <CardHeader className="flex items-center gap-2">
            <User className="text-blue-600" />
            <CardTitle className="text-xl">Information We Collect</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-gray-700 space-y-3">
            <p>
              At <strong>florcent & hampers</strong>, we collect certain personal information to provide and improve our services to you.
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li><strong>Name:</strong> Your full name as provided during account creation or checkout</li>
              <li><strong>Address:</strong> Complete delivery address including street, city, and state</li>
              <li><strong>Phone Number:</strong> Primary contact number for order updates and delivery coordination</li>
              <li><strong>Email Address:</strong> (If provided) For order confirmations and promotional communications</li>
              <li><strong>PIN Code:</strong> For delivery area verification and service availability</li>
            </ul>
          </CardContent>
        </Card>

        {/* Section: How We Use It */}
        <Card>
          <CardHeader className="flex items-center gap-2">
            <MapPin className="text-green-600" />
            <CardTitle className="text-xl">How We Use Your Information</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-gray-700 space-y-2">
            <ul className="list-disc list-inside space-y-1">
              <li>To process and fulfill your orders</li>
              <li>To communicate about your orders and deliveries</li>
              <li>To improve our products and services</li>
              <li>To prevent fraud and enhance security</li>
              <li>To comply with legal obligations</li>
            </ul>
          </CardContent>
        </Card>

        {/* Section: Data Security */}
        <Card>
          <CardHeader className="flex items-center gap-2">
            <ShieldCheck className="text-purple-600" />
            <CardTitle className="text-xl">Data Security</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-gray-700 space-y-2">
            <p>
              We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
            </p>
          </CardContent>
        </Card>

        {/* Contact Section */}
        <Card>
          <CardHeader className="flex items-center gap-2">
            <Home className="text-orange-600" />
            <CardTitle className="text-xl">Contact Us</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-gray-700 space-y-3">
            <p>If you have any questions about our Privacy Policy, please contact us at our store or through customer support:</p>

            <Dialog>
              <DialogTrigger asChild>
                <Button>Reach Support</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>Customer Support</DialogHeader>
                <div className="space-y-3 text-sm text-gray-700">
                  <p className="flex items-center gap-2"><Mail className="h-4 w-4" /> support@a2zmegastore.com</p>
                  <p className="flex items-center gap-2"><Phone className="h-4 w-4" /> +91-9876543210</p>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
