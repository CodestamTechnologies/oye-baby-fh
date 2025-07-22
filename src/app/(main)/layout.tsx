import Blogs from '@/components/main/blogs';
import Footer from '@/components/main/footer';
import Header from '@/components/main/header';
// import Sidebar from '@/components/main/Sidebar';
import { CartProvider } from '@/providers/cartProvider';
import React from 'react'
import { ProductsProvider } from '@/providers/productsProvider';

const layout = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    return (
        <CartProvider>
            <div className="min-h-screen bg-gradient-to-b from-purple-100 to-white flex">
                {/* <Sidebar /> */}
                <div className="flex-1">
                    <main className="">
                        
                        <ProductsProvider>
                        <Header />
                        </ProductsProvider>
                        
                        {children}
                        <Blogs />
                        <Footer />
                    </main>
                </div>
            </div>
        </CartProvider>
    )
}

export default layout
