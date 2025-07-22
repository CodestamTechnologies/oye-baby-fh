"use client"

import { Button } from "@/components/ui/button";
import { Book, HelpCircle, Mail, MessageCircle } from "lucide-react";
import { useState } from "react";
// Import icons used in the component
import { Card } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard, RefreshCw, Tag, Truck } from 'lucide-react';
import Link from "next/link";

const HelpModal = () => {
    const [isOpen, setIsOpen] = useState(false);

    const helpTopics = [
        {
            title: "Orders & Shipping",
            description: "Information about order tracking, shipping methods, and delivery times.",
            icon: Truck,
            content: [
                {
                    question: "How can I track my order?",
                    answer: "You can track your order by logging into your account and visiting the 'My Orders' section. Alternatively, you can use the tracking number provided in your shipping confirmation email."
                },
                {
                    question: "What are your shipping options?",
                    answer: "We offer standard shipping (3-5 business days), express shipping (1-2 business days), and free shipping on all orders over Rs100."
                },
                {
                    question: "When will my order arrive?",
                    answer: "After your order is processed, you'll receive a shipping confirmation email with an estimated delivery date. Most orders are processed within 24-48 hours."
                }
            ]
        },
        {
            title: "Returns & Refunds",
            description: "Learn about our return policy, refund process, and exchange options.",
            icon: RefreshCw,
            content: [
                {
                    question: "What is your return policy?",
                    answer: "We offer a 30-day return policy for all items. Products must be unworn, unwashed, and in their original packaging with all tags attached."
                },
                {
                    question: "How do I initiate a return?",
                    answer: "To start a return, log into your account, go to 'My Orders', select the order you want to return, and follow the return instructions. You can also contact our customer service team for assistance."
                },
                {
                    question: "When will I receive my refund?",
                    answer: "Once your return is received and inspected, we'll process your refund within 3-5 business days. The time it takes for the refund to appear in your account depends on your payment method and financial institution."
                }
            ]
        },
        {
            title: "Account & Payment",
            description: "Guidance on account management, payment methods, and gift cards.",
            icon: CreditCard,
            content: [
                {
                    question: "How do I create an account?",
                    answer: "You can create an account by clicking on the 'Sign Up' link at the top of our website. Follow the prompts to enter your information and create your password."
                },
                {
                    question: "What payment methods do you accept?",
                    answer: "We accept all major credit cards (Visa, Mastercard, American Express, Discover), PayPal, Apple Pay, and Google Pay."
                },
                {
                    question: "How do I redeem a gift card?",
                    answer: "To redeem a gift card, enter the gift card code in the payment section during checkout. The gift card amount will be applied to your order total."
                }
            ]
        },
        {
            title: "Product Information",
            description: "Details about product care, sizing, and material information.",
            icon: Tag,
            content: [
                {
                    question: "How do I find the right size?",
                    answer: "Each product page includes a detailed size guide. You can also chat with our customer service team for personalized sizing recommendations."
                },
                {
                    question: "What materials are your products made from?",
                    answer: "We use a variety of high-quality materials for our products. You can find specific material information on each product page under the 'Details' section."
                },
                {
                    question: "How do I care for my products?",
                    answer: "Care instructions are included with each product and can also be found on the product page. Generally, we recommend gentle washing and air drying for most items."
                }
            ]
        }
    ];

    return (
        <>
            <Button
                variant="outline"
                className="w-full justify-start rounded-full border-gray-300 text-gray-700 hover:bg-blue-100 hover:text-blue-800 group"
                onClick={() => setIsOpen(true)}
            >
                <HelpCircle className="h-4 w-4 mr-2 text-blue-600 group-hover:text-blue-700" />
                Help Center
            </Button>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-serif font-medium">Help Center</DialogTitle>
                        <DialogDescription>
                            Find answers to frequently asked questions or get in touch with our support team.
                        </DialogDescription>
                    </DialogHeader>

                    <Tabs defaultValue="faq" className="w-full">
                        <TabsList className="grid grid-cols-2 mb-6 w-full">
                            <TabsTrigger value="faq" className="text-sm">
                                <Book className="h-4 w-4 mr-2" />
                                FAQ
                            </TabsTrigger>
                            <TabsTrigger value="contact" className="text-sm">
                                <MessageCircle className="h-4 w-4 mr-2" />
                                Contact Us
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="faq" className="space-y-6">
                            <div className="grid grid-cols-1 gap-6">
                                {helpTopics.map((topic, index) => (
                                    <Card key={index} className="p-6">
                                        <div className="flex items-center mb-4">
                                            {topic.icon && <topic.icon className="h-5 w-5 mr-2 text-blue-600" />}
                                            <h3 className="font-medium">{topic.title}</h3>
                                        </div>
                                        <p className="text-gray-600 text-sm mb-4">{topic.description}</p>
                                        <div className="space-y-3">
                                            {topic.content.map((item, idx) => (
                                                <details key={idx} className="text-sm">
                                                    <summary className="font-medium cursor-pointer hover:text-blue-600">
                                                        {item.question}
                                                    </summary>
                                                    <p className="mt-2 pl-4 text-gray-600">{item.answer}</p>
                                                </details>
                                            ))}
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </TabsContent>

                        <TabsContent value="contact" className="space-y-6">
                            <Card className="p-6">
                                <h3 className="font-medium mb-4">Get in Touch</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center">
                                        <Mail className="h-5 w-5 mr-3 text-blue-600" />
                                        <div>
                                            <p className="font-medium">Email Support</p>
                                            <p className="text-sm text-gray-600">floristnhampers@gmail.com</p>
                                            <p className="text-sm text-gray-600">Response time: 24-48 hours</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <MessageCircle className="h-5 w-5 mr-3 text-blue-600" />
                                        <div>
                                            <p className="font-medium">Live Chat</p>
                                            <p className="text-sm text-gray-600">Available Monday-Friday</p>
                                            <p className="text-sm text-gray-600">9am - 5pm IST</p>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </TabsContent>
                    </Tabs>

                    <DialogFooter className="flex flex-col sm:flex-row sm:justify-between items-center border-t pt-4">
                        <div className="text-sm text-gray-500 mr-4">
                            Need more help? Contact our customer support team.
                        </div>
                        <div className="mt-4 sm:mt-0">
                            <Link
                                href="/privacy-policy"
                                className="text-sm text-blue-600 hover:underline mr-4"
                            >
                                Privacy Policy
                            </Link>
                            <Button variant="outline" onClick={() => setIsOpen(false)}>
                                Close
                            </Button>
                        </div>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};


export default HelpModal;
