"use client";

import { useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useParams, useRouter } from "next/navigation";
import { Loader2, ArrowLeft, ExternalLink, CheckCircle, AlertCircle, Save } from "lucide-react";
import Link from "next/link";

type DynamicForm = {
  officialWebsite: string;
  requiredDocuments: string[];
  requiredFields: string[];
};

export default function ProfileDetailPage() {
  const params = useParams();
  const router = useRouter();
  const profileId = params.profileId as string;
  
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // State for dynamic forms
  const [activeFormSchemeId, setActiveFormSchemeId] = useState<string | null>(null);
  const [dynamicForms, setDynamicForms] = useState<Record<string, DynamicForm>>({});
  const [isGeneratingForm, setIsGeneratingForm] = useState(false);
  
  // State for application data (what the operator types in)
  const [applicationData, setApplicationData] = useState<Record<string, Record<string, string>>>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!profileId) return;
      try {
        const docRef = doc(db, "saved_profiles", profileId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          setProfile({ id: docSnap.id, ...data });
          if (data.applicationData) {
            setApplicationData(data.applicationData);
          }
        } else {
          console.log("No such document!");
          router.push("/dashboard");
        }
      } catch (error) {
        console.error("Error fetching document:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [profileId, router]);

  const handleGenerateForm = async (schemeId: string, schemeName: string) => {
    setActiveFormSchemeId(schemeId);
    
    // If we already generated it, don't do it again
    if (dynamicForms[schemeId]) return;

    setIsGeneratingForm(true);
    try {
      const response = await fetch("/api/generate-form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ schemeName, state: profile?.citizenProfile?.state }),
      });
      
      const data = await response.json();
      if (data.error) throw new Error(data.error);

      setDynamicForms(prev => ({ ...prev, [schemeId]: data }));
    } catch (error) {
      console.error("Failed to generate form:", error);
      alert("Failed to analyze scheme requirements. Please try again.");
      setActiveFormSchemeId(null);
    } finally {
      setIsGeneratingForm(false);
    }
  };

  const handleFieldChange = (schemeId: string, field: string, value: string) => {
    setApplicationData(prev => ({
      ...prev,
      [schemeId]: {
        ...(prev[schemeId] || {}),
        [field]: value
      }
    }));
  };

  const handleSaveApplicationData = async (schemeId: string) => {
    setIsSaving(true);
    try {
      const docRef = doc(db, "saved_profiles", profileId);
      await updateDoc(docRef, {
        applicationData: applicationData
      });
      alert("Application data saved successfully!");
    } catch (error) {
      console.error("Error updating document:", error);
      alert("Failed to save data.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex justify-center items-center">
        <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="max-w-6xl mx-auto w-full p-4 md:p-8">
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Citizen Profile</h1>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <p className="text-sm text-gray-500 mb-1">Name</p>
            <p className="font-medium text-gray-900">{profile.citizenProfile.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Phone</p>
            <p className="font-medium text-gray-900">{profile.citizenProfile.phone}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Age</p>
            <p className="font-medium text-gray-900">{profile.citizenProfile.age}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Location</p>
            <p className="font-medium text-gray-900">{profile.citizenProfile.city}, {profile.citizenProfile.state}</p>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-bold text-gray-900 mb-4">Selected Schemes ({profile.savedSchemes.length})</h2>
      
      <div className="space-y-4">
        {profile.savedSchemes.map((scheme: any) => (
          <div key={scheme.id} className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h3 className="font-bold text-lg text-gray-900">{scheme.name}</h3>
                <p className="text-sm text-gray-500 mt-1">ID: {scheme.id}</p>
              </div>
              <button 
                onClick={() => handleGenerateForm(scheme.id, scheme.name)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  activeFormSchemeId === scheme.id 
                    ? "bg-brand-50 text-brand-700" 
                    : "bg-brand-600 text-white hover:bg-brand-700"
                }`}
              >
                {activeFormSchemeId === scheme.id ? "View Form" : "Process Application"}
              </button>
            </div>

            {/* Dynamic Form Section */}
            {activeFormSchemeId === scheme.id && (
              <div className="border-t border-gray-100 bg-gray-50 p-6">
                {isGeneratingForm && !dynamicForms[scheme.id] ? (
                  <div className="flex flex-col items-center justify-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-brand-600 mb-4" />
                    <p className="text-gray-600">AI is analyzing scheme requirements and generating the form...</p>
                  </div>
                ) : dynamicForms[scheme.id] ? (
                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Left Column: Instructions & Link */}
                    <div>
                      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6">
                        <div className="flex gap-3">
                          <AlertCircle className="w-5 h-5 text-blue-600 shrink-0" />
                          <div>
                            <h4 className="font-bold text-blue-900 text-sm">Official Application Portal</h4>
                            <p className="text-blue-700 text-sm mt-1 mb-3">You must submit the final application on the official government website.</p>
                            <a 
                              href={dynamicForms[scheme.id].officialWebsite.startsWith('http') ? dynamicForms[scheme.id].officialWebsite : `https://${dynamicForms[scheme.id].officialWebsite}`}
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                            >
                              Open Portal <ExternalLink className="w-4 h-4" />
                            </a>
                          </div>
                        </div>
                      </div>

                      <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-brand-600" />
                        Required Documents Checklist
                      </h4>
                      <ul className="space-y-2 mb-6">
                        {dynamicForms[scheme.id].requiredDocuments.map((doc, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-gray-600 bg-white p-2 rounded-lg border border-gray-200">
                            <input type="checkbox" className="mt-1 rounded text-brand-600 focus:ring-brand-500" />
                            <span>{doc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Right Column: Data Collection Form */}
                    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                      <h4 className="font-bold text-gray-900 mb-4">Application Data Collection</h4>
                      <p className="text-xs text-gray-500 mb-4">Collect this information to easily copy-paste it into the official portal.</p>
                      
                      <div className="space-y-4">
                        {dynamicForms[scheme.id].requiredFields.map((field, idx) => (
                          <div key={idx}>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{field}</label>
                            <input 
                              type="text" 
                              value={applicationData[scheme.id]?.[field] || ""}
                              onChange={(e) => handleFieldChange(scheme.id, field, e.target.value)}
                              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-brand-500 outline-none text-sm"
                              placeholder={`Enter ${field}`}
                            />
                          </div>
                        ))}
                      </div>

                      <button 
                        onClick={() => handleSaveApplicationData(scheme.id)}
                        disabled={isSaving}
                        className="w-full mt-6 bg-gray-900 hover:bg-black text-white px-4 py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-70"
                      >
                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Save Data Securely
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
