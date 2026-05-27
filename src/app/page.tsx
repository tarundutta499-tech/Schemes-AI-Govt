"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, FileText, CheckCircle, Search, Shield, Building2, TrendingUp, Users } from "lucide-react";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 to-white pt-24 pb-32">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-100 text-brand-700 font-medium text-sm mb-8 shadow-sm">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-600"></span>
            </span>
            AI-Powered Government Benefits Copilot
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-gray-900 mb-6 leading-tight">
            Discover Government Schemes <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-blue-400">
              You Are Eligible For
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            Stop searching through hundreds of confusing government portals. Our AI Copilot helps citizens, farmers, MSMEs, and students find, understand, and apply for schemes instantly.
          </p>

          <div className="max-w-2xl mx-auto bg-white p-2 rounded-2xl shadow-xl shadow-brand-500/10 flex items-center border border-gray-100 mb-8">
            <Search className="w-6 h-6 text-gray-400 ml-4" />
            <input 
              type="text" 
              placeholder="E.g., I am a farmer in Rajasthan looking for dairy subsidy..." 
              className="flex-1 bg-transparent outline-none px-4 py-3 text-gray-700 text-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Link 
              href="/wizard"
              className="bg-brand-600 hover:bg-brand-700 text-white px-8 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all"
            >
              Open Workspace <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500 font-medium">
            <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4 text-green-500"/> Smart Eligibility</span>
            <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4 text-green-500"/> Hindi & English Support</span>
            <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4 text-green-500"/> Document OCR</span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How SchemeSathi AI Works</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Our intelligent platform simplifies the entire process from discovery to application.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "AI Scheme Finder",
                desc: "Chat with our AI in natural language to instantly find central and state schemes tailored to your exact profile.",
                icon: <Search className="w-8 h-8 text-brand-600" />
              },
              {
                title: "Smart Eligibility Checker",
                desc: "Our engine calculates your eligibility score, highlights missing requirements, and tells you approval chances.",
                icon: <Shield className="w-8 h-8 text-brand-600" />
              },
              {
                title: "Document Assistant",
                desc: "Upload your Aadhaar, PAN, or certificates. AI auto-extracts text, verifies completeness, and points out errors.",
                icon: <FileText className="w-8 h-8 text-brand-600" />
              }
            ].map((feature, idx) => (
              <div key={idx} className="bg-gray-50 rounded-3xl p-8 border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="bg-white w-16 h-16 rounded-2xl shadow-sm flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-24 bg-gray-50 border-y border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Who is this for?</h2>
              <p className="text-lg text-gray-600">Discover schemes categorized for your specific needs.</p>
            </div>
            <Link href="/schemes" className="text-brand-600 font-semibold flex items-center gap-1 hover:gap-2 transition-all mt-4 md:mt-0">
              View all categories <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: "MSME & Business", icon: <Building2 className="w-6 h-6" />, count: "150+ Schemes" },
              { name: "Farmers & Agri", icon: <TrendingUp className="w-6 h-6" />, count: "200+ Schemes" },
              { name: "Students & Youth", icon: <Users className="w-6 h-6" />, count: "120+ Schemes" },
              { name: "Women Entrepreneurs", icon: <Shield className="w-6 h-6" />, count: "85+ Schemes" },
            ].map((cat, idx) => (
              <Link href={`/schemes?category=${cat.name}`} key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 hover:border-brand-300 hover:shadow-md transition-all group cursor-pointer">
                <div className="text-brand-600 mb-4 bg-brand-50 w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  {cat.icon}
                </div>
                <h4 className="font-bold text-gray-900 mb-1">{cat.name}</h4>
                <p className="text-sm text-gray-500">{cat.count}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-brand-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Stop missing out on your benefits.</h2>
          <p className="text-brand-100 text-xl mb-10 max-w-2xl mx-auto">
            Join thousands of citizens who have successfully secured government support using SchemeSathi AI.
          </p>
          <Link href="/wizard" className="inline-flex bg-white text-brand-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg">
            Launch Operator Workspace
          </Link>
        </div>
      </section>
    </div>
  );
}
