import React from 'react';
import { Separator } from '../ui/separator';
import { Button } from '../ui/button';
import { Facebook, Instagram, Twitter } from 'lucide-react';
import Image from 'next/image';

const Footer = () => {
  return (
    <footer className="bg-[url('/bg-10.jpg')] bg-cover bg-center bg-no-repeat text-white pt-16 pb-8 px-6 border-t border-pink-200 shadow-xl">
      <div className="max-w-7xl mx-auto">
        <div className="">
          {/* Branding Section */}
          <div className='flex justify-between items-center
           '>
            <div className="mb-4 flex justify-center md:justify-start">
              <Image
                src="/logo.jpg"
                alt="Florcent & Hampers"
                width={100}
                height={100}
                className="rounded-xl border-2 border-[#1A2A44] shadow-md "
              />
            </div>
            <p className="text-gray-50 text-sm mb-4 font-serif">
              Contemporary fashion for the modern individual. Elevate your style with our thoughtfully crafted collections.
            </p>
            <div className="flex space-x-4 mb-4">
              <Button variant="ghost" size="icon" className="text-[#1A2A44]  h-8 w-8">
                <Instagram className="h-8 w-8" />
              </Button>
              <Button variant="ghost" size="icon" className="text-[#1A2A44]  h-8 w-8">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-[#1A2A44]  h-8 w-8">
                <Twitter className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Shop Links */}
          
        </div>

        {/* Separator */}
        <Separator className="bg-pink-300" />

       
      </div>
    </footer>
  );
};

export default Footer;
