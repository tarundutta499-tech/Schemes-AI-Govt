"use client";

import { useState } from "react";
import { Loader2, FileText, CheckCircle, Store, Download, Search, Check, ExternalLink, AlertCircle } from "lucide-react";
import { auth, db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import LOCATION_DATA from "@/lib/locationData.json";

type Scheme = {
  id: string;
  name: string;
  description: string;
  amount: string;
  eligibility: string;
};

type DynamicForm = {
  officialWebsite: string;
  requiredDocuments: string[];
  requiredFields: string[];
};

export default function WizardPage() {
  const [formData, setFormData] = useState({
    age: "",
    gender: "Male",
    state: "Rajasthan",
    city: "Jaitsar",
    occupation: "Farmer",
    caste: "General",
    income: "",
    disability: "No",
  });

  const [schemes, setSchemes] = useState<Scheme[] | null>(null);
  const [selectedSchemes, setSelectedSchemes] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Instant Help & Forms State
  const [activeFormSchemeId, setActiveFormSchemeId] = useState<string | null>(null);
  const [dynamicForms, setDynamicForms] = useState<Record<string, DynamicForm>>({});
  const [isGeneratingForm, setIsGeneratingForm] = useState(false);

  const handleSave = async () => {
    if (!auth.currentUser) {
      alert("You must be logged in to save schemes.");
      return;
    }

    if (selectedSchemes.size === 0 || !schemes) return;

    setIsSaving(true);
    try {
      const schemesToSave = schemes.filter(s => selectedSchemes.has(s.id));
      
      await addDoc(collection(db, "saved_profiles"), {
        operatorId: auth.currentUser.uid,
        operatorEmail: auth.currentUser.email,
        citizenProfile: formData,
        savedSchemes: schemesToSave,
        createdAt: serverTimestamp(),
        status: "Pending Application"
      });

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      setSelectedSchemes(new Set()); // Reset selection
    } catch (error) {
      console.error("Error saving document: ", error);
      alert("Failed to save. Please check your database rules.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSchemes(null);
    setErrorMsg("");
    
    try {
      const response = await fetch("/api/wizard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      
      if (data.error) {
        setErrorMsg(data.error);
      } else if (data.schemes) {
        setSchemes(data.schemes);
      }
    } catch (error) {
      setErrorMsg("Something went wrong. Please check your connection and API key.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === "state") {
      // If state changes, reset district to the first district of the new state
      const districts = LOCATION_DATA[value as keyof typeof LOCATION_DATA] || [];
      const firstDistrict = districts.length > 0 ? districts[0] : "";
      setFormData({ ...formData, state: value, city: firstDistrict });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const toggleSchemeSelection = (id: string) => {
    const newSelection = new Set(selectedSchemes);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedSchemes(newSelection);
  };

  const handleGenerateForm = async (schemeId: string, schemeName: string) => {
    if (activeFormSchemeId === schemeId) {
      setActiveFormSchemeId(null); // Toggle off if clicked again
      return;
    }
    
    setActiveFormSchemeId(schemeId);
    if (dynamicForms[schemeId]) return; // Already generated

    setIsGeneratingForm(true);
    try {
      const response = await fetch("/api/generate-form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ schemeName, state: formData.state }),
      });
      
      const data = await response.json();
      if (data.error) throw new Error(data.error);

      setDynamicForms(prev => ({ ...prev, [schemeId]: data }));
    } catch (error) {
      console.error("Failed to generate form:", error);
      alert("Failed to fetch official link. Please try again.");
      setActiveFormSchemeId(null);
    } finally {
      setIsGeneratingForm(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Store className="w-8 h-8 text-brand-600" />
              Operator Workspace
            </h1>
            <p className="text-gray-600 mt-1">Quickly find eligible schemes for citizens visiting your center.</p>
          </div>
          {selectedSchemes.size > 0 && (
            <button 
              onClick={handleSave}
              disabled={isSaving || saveSuccess}
              className={`px-6 py-2.5 rounded-full font-bold flex items-center gap-2 shadow-sm transition-all ${
                saveSuccess 
                  ? "bg-green-100 text-green-700"
                  : "bg-green-600 hover:bg-green-700 text-white"
              } disabled:opacity-70`}
            >
              {isSaving ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : saveSuccess ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <Download className="w-5 h-5" />
              )}
              {isSaving 
                ? "Saving to Database..." 
                : saveSuccess 
                  ? "Saved Successfully!" 
                  : `Save ${selectedSchemes.size} Selected Schemes`
              }
            </button>
          )}
        </div>

        <div className="flex flex-col xl:flex-row gap-8">
          {/* Form Section */}
          <div className="w-full xl:w-1/3 bg-white p-6 rounded-2xl shadow-sm border border-gray-200 h-fit sticky top-24">
            <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-4">Citizen Details</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                  <input type="number" name="age" required value={formData.age} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-brand-500 outline-none" placeholder="e.g. 35" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <select name="gender" value={formData.gender} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-brand-500 outline-none">
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <select name="state" value={formData.state} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-brand-500 outline-none bg-white">
                    {Object.keys(LOCATION_DATA).map((state: string) => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
                  <select name="city" value={formData.city} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-brand-500 outline-none bg-white" disabled={!formData.state}>
                    {formData.state && LOCATION_DATA[formData.state as keyof typeof LOCATION_DATA]?.map((district: string) => (
                      <option key={district} value={district}>{district}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Occupation</label>
                <select name="occupation" value={formData.occupation} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-brand-500 outline-none">
                  <option>Farmer</option>
                  <option>Student</option>
                  <option>Business Owner / MSME</option>
                  <option>Unemployed</option>
                  <option>Salaried Employee</option>
                  <option>Daily Wage Worker</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select name="caste" value={formData.caste} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-brand-500 outline-none">
                    <option>General</option>
                    <option>OBC</option>
                    <option>SC</option>
                    <option>ST</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Disability</label>
                  <select name="disability" value={formData.disability} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-brand-500 outline-none">
                    <option>No</option>
                    <option>Yes</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Annual Family Income (₹)</label>
                <input type="number" name="income" required value={formData.income} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-brand-500 outline-none" placeholder="e.g. 150000" />
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full mt-4 bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 px-4 rounded-xl flex justify-center items-center gap-2 transition-all disabled:opacity-70"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                {isLoading ? "Analyzing Profile..." : "Find Eligible Schemes"}
              </button>
            </form>
          </div>

          {/* Results Section */}
          <div className="w-full xl:w-2/3 bg-white p-6 rounded-2xl shadow-sm border border-gray-200 min-h-[500px]">
            <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-brand-600" /> Scheme Recommendations
            </h2>

            {errorMsg && (
              <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 text-sm font-medium">
                {errorMsg}
              </div>
            )}

            {!schemes && !isLoading && !errorMsg && (
              <div className="h-[400px] flex flex-col items-center justify-center text-gray-400">
                <FileText className="w-16 h-16 mb-4 text-gray-200" />
                <p className="text-lg font-medium">Fill the form and click "Find Eligible Schemes"</p>
                <p className="text-sm">Matched schemes will appear here instantly.</p>
              </div>
            )}

            {schemes && (
              <div className="space-y-4">
                <p className="text-gray-600 font-medium">We found {schemes.length} schemes that match this profile. Select the ones you want to save.</p>
                {schemes.map((scheme) => (
                  <div 
                    key={scheme.id} 
                    className={`bg-white border-2 rounded-2xl p-5 transition-all overflow-hidden ${
                      selectedSchemes.has(scheme.id) ? 'border-brand-500 shadow-md shadow-brand-500/10' : 'border-gray-200 hover:border-brand-300'
                    }`}
                  >
                    <div className="flex gap-4">
                      <div className="pt-1">
                        <button 
                          onClick={() => toggleSchemeSelection(scheme.id)}
                          className={`w-6 h-6 rounded flex items-center justify-center border transition-all ${
                            selectedSchemes.has(scheme.id) ? 'bg-brand-600 border-brand-600 text-white' : 'border-gray-300 bg-white'
                          }`}
                        >
                          {selectedSchemes.has(scheme.id) && <Check className="w-4 h-4" />}
                        </button>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 cursor-pointer" onClick={() => toggleSchemeSelection(scheme.id)}>
                          {scheme.name}
                        </h3>
                        <p className="text-gray-600 mt-2 text-sm">{scheme.description}</p>
                        
                        <div className="grid grid-cols-2 gap-4 mt-4 bg-gray-50 p-4 rounded-xl">
                          <div>
                            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Amount / Benefit</p>
                            <p className="font-semibold text-gray-900 mt-1">{scheme.amount}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Eligibility Highlight</p>
                            <p className="font-semibold text-gray-900 mt-1">{scheme.eligibility}</p>
                          </div>
                        </div>
                        
                      <div className="mt-4 flex justify-end">
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleGenerateForm(scheme.id, scheme.name); }}
                          className={`text-sm font-bold flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                            activeFormSchemeId === scheme.id ? 'bg-blue-50 text-blue-700' : 'text-brand-600 hover:bg-brand-50'
                          }`}
                        >
                          {activeFormSchemeId === scheme.id ? 'Hide Application Details' : 'Apply Instantly'}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Instant Application Details Section */}
                  {activeFormSchemeId === scheme.id && (
                    <div className="mt-4 pt-4 border-t border-gray-100 pl-10">
                      {isGeneratingForm && !dynamicForms[scheme.id] ? (
                        <div className="flex items-center gap-3 text-brand-600 text-sm font-medium py-4">
                          <Loader2 className="w-5 h-5 animate-spin" /> Fetching official website and requirements...
                        </div>
                      ) : dynamicForms[scheme.id] ? (
                        <div className="bg-blue-50/50 rounded-xl p-5 border border-blue-100">
                          <div className="flex gap-3 mb-5">
                            <AlertCircle className="w-5 h-5 text-blue-600 shrink-0" />
                            <div>
                              <h4 className="font-bold text-blue-900 text-sm">Official Government Portal</h4>
                              <p className="text-blue-700 text-sm mt-1 mb-3">You must submit the final application on the official government website. Click the button below to open it instantly.</p>
                              <a 
                                href={dynamicForms[scheme.id].officialWebsite.startsWith('http') ? dynamicForms[scheme.id].officialWebsite : `https://${dynamicForms[scheme.id].officialWebsite}`}
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 shadow-sm transition-all"
                              >
                                Open Official Website <ExternalLink className="w-4 h-4" />
                              </a>
                            </div>
                          </div>

                          <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2 text-sm">
                            <CheckCircle className="w-4 h-4 text-brand-600" />
                            Documents the Citizen Needs to Bring:
                          </h4>
                          <ul className="space-y-1 mb-0 pl-6 list-disc">
                            {dynamicForms[scheme.id].requiredDocuments.map((doc, idx) => (
                              <li key={idx} className="text-sm text-gray-700">{doc}</li>
                            ))}
                          </ul>
                        </div>
                      ) : null}
                    </div>
                  )}
                </div>
              ))}
              
              {selectedSchemes.size > 0 && (
                <div className="mt-6 border-t pt-6 flex justify-end">
                  <button 
                    onClick={handleSave}
                    disabled={isSaving || saveSuccess}
                    className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-sm transition-all ${
                      saveSuccess 
                        ? "bg-green-100 text-green-700"
                        : "bg-green-600 hover:bg-green-700 text-white"
                    } disabled:opacity-70`}
                  >
                    {isSaving ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : saveSuccess ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <Download className="w-5 h-5" />
                    )}
                    {isSaving 
                      ? "Saving to Database..." 
                      : saveSuccess 
                        ? "Saved Successfully!" 
                        : `Save ${selectedSchemes.size} Selected Schemes`
                    }
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);
}
