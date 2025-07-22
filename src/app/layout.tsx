import { AuthProvider } from "@/providers/authProvider";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner"
import { ProductsProvider } from "@/providers/productsProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo.jpg" />
      </head>
      <body
        className={` antialiased`}
      >
        <AuthProvider>
          <ProductsProvider>
     <main className=" md:pl-64 ">
            {children}
     </main>

          </ProductsProvider>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
