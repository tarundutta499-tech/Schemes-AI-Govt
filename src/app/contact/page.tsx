import { MapPin, Phone, User, MessageCircle } from "lucide-react";
import Link from "next/link";

export default function ContactPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 py-16">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
            Get in Touch
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Need help finding government schemes or have a question? Visit our shop or contact us directly.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8 max-w-4xl mx-auto">
          {/* Contact Details Card */}
          <div className="w-full md:w-1/2 bg-white rounded-3xl p-8 border border-gray-200 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 border-b pb-4">Contact Information</h2>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-brand-50 flex items-center justify-center shrink-0">
                  <User className="w-6 h-6 text-brand-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Owner & Operator</p>
                  <p className="text-lg font-bold text-gray-900">Aakash Dutt</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-brand-50 flex items-center justify-center shrink-0">
                  <Phone className="w-6 h-6 text-brand-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Phone / WhatsApp</p>
                  <p className="text-lg font-bold text-gray-900">+91 95719 20897</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-brand-50 flex items-center justify-center shrink-0">
                  <MapPin className="w-6 h-6 text-brand-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Visit our Shop</p>
                  <p className="text-lg font-bold text-gray-900">Dutt Studio</p>
                  <p className="text-gray-600">Jaitsar, Rajasthan - 335702</p>
                </div>
              </div>
            </div>

            <div className="mt-10">
              <a 
                href="https://wa.me/919571920897" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 px-4 rounded-xl flex justify-center items-center gap-2 transition-colors shadow-sm"
              >
                <MessageCircle className="w-5 h-5" />
                Chat on WhatsApp
              </a>
            </div>
          </div>

          {/* Quick Support / Working Hours */}
          <div className="w-full md:w-1/2 flex flex-col gap-6">
            <div className="bg-brand-900 rounded-3xl p-8 text-white relative overflow-hidden flex-1">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-4">Are you a CSC Operator?</h3>
                <p className="text-brand-100 mb-6 leading-relaxed">
                  Join our network of operators using SchemeSathi AI to help citizens across Rajasthan and India. 
                </p>
                <Link 
                  href="/wizard"
                  className="inline-block bg-white text-brand-900 font-bold px-6 py-3 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  Try the Operator Workspace
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Working Hours</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex justify-between items-center border-b border-gray-100 pb-2">
                  <span>Monday - Saturday</span>
                  <span className="font-semibold text-gray-900">9:00 AM - 7:00 PM</span>
                </li>
                <li className="flex justify-between items-center pt-1">
                  <span>Sunday</span>
                  <span className="font-semibold text-red-500">Closed</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
