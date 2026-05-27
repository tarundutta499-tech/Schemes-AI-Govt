import { Store, Shield, Users, Globe } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-white py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-3 bg-brand-50 rounded-2xl mb-6">
            <Globe className="w-10 h-10 text-brand-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
            About SchemeSathi <span className="text-brand-600">AI</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Bridging the gap between government benefits and the citizens who need them the most, powered by artificial intelligence.
          </p>
        </div>

        <div className="prose prose-lg max-w-none text-gray-600 mb-16">
          <p>
            Millions of Indian citizens, farmers, MSMEs, and students miss out on government schemes, subsidies, and grants simply because they don't know these programs exist or find the application process too confusing. 
          </p>
          <p>
            <strong>SchemeSathi AI</strong> was built to solve this problem. We are building an intelligent, unified copilot that makes discovering and applying for government schemes as easy as having a conversation.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
            <Store className="w-8 h-8 text-brand-600 mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-3">For Operators</h3>
            <p className="text-gray-600">
              Designed specifically for CSC and e-Mitra operators, our Smart Eligibility Workspace allows operators to quickly profile citizens and instantly find high-value schemes they qualify for, improving service speed and efficiency.
            </p>
          </div>
          <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
            <Shield className="w-8 h-8 text-brand-600 mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-3">For Citizens</h3>
            <p className="text-gray-600">
              We translate complex government jargon into simple, actionable steps. We tell citizens exactly what benefits they get, why they are eligible, and exactly which documents they need to prepare.
            </p>
          </div>
        </div>

        <div className="bg-brand-900 text-white p-12 rounded-3xl text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-6">Ready to help citizens claim their benefits?</h2>
            <Link 
              href="/wizard" 
              className="inline-flex bg-white text-brand-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg"
            >
              Open Operator Workspace
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
