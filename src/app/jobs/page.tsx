"use client";

import { useState } from "react";
import { Loader2, Briefcase, CheckCircle, Search, ExternalLink, Download, Check } from "lucide-react";
import { auth, db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import LOCATION_DATA from "@/lib/locationData.json";

type Job = {
  id: string;
  jobTitle: string;
  department: string;
  qualificationNeeded: string;
  ageLimit: string;
  officialWebsite: string;
  navigationGuide: string[];
};

export default function JobsWorkspacePage() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    state: "",
    age: "",
    education: "",
    category: "General"
  });

  const [jobs, setJobs] = useState<Job[] | null>(null);
  const [selectedJobs, setSelectedJobs] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSave = async () => {
    if (!auth.currentUser) {
      alert("You must be logged in to save student profiles.");
      return;
    }
    if (selectedJobs.size === 0) {
      alert("Please select at least one job to save.");
      return;
    }

    setIsSaving(true);
    try {
      const selectedJobData = jobs?.filter(j => selectedJobs.has(j.id)) || [];
      
      await addDoc(collection(db, "saved_profiles"), {
        operatorId: auth.currentUser.uid,
        citizenProfile: {
          ...formData,
          profileType: 'student'
        },
        savedJobs: selectedJobData,
        status: "Pending Application",
        createdAt: serverTimestamp(),
      });
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error("Error saving student profile:", error);
      alert("Failed to save profile.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");
    setJobs(null);
    setSelectedJobs(new Set());
    setSaveSuccess(false);

    try {
      const response = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.error) {
        setErrorMsg(data.error);
      } else {
        setJobs(data.jobs);
      }
    } catch (error) {
      setErrorMsg("Failed to connect to the server. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleJobSelection = (id: string) => {
    const newSelection = new Set(selectedJobs);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedJobs(newSelection);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Government Jobs Workspace</h1>
          <p className="text-gray-600 mt-2 max-w-2xl">
            Enter the student's age, education, and category. Our AI will analyze active and upcoming official Government Jobs and return legitimate applications.
          </p>
        </div>

        <div className="flex flex-col xl:flex-row gap-8">
          {/* Left Column - Form */}
          <div className="w-full xl:w-1/3">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 sticky top-8">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-brand-600" /> Student Profile
              </h2>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Student Name</label>
                  <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-brand-500 outline-none" placeholder="Enter name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-brand-500 outline-none" placeholder="10-digit number" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                  <input type="number" name="age" required value={formData.age} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-brand-500 outline-none" placeholder="e.g. 22" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <select name="state" value={formData.state} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-brand-500 outline-none bg-white">
                    <option value="" disabled>Select State</option>
                    {Object.keys(LOCATION_DATA).map((state: string) => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Highest Education</label>
                  <select name="education" value={formData.education} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-brand-500 outline-none">
                    <option value="" disabled>Select Education</option>
                    <option value="8th Pass">8th Pass</option>
                    <option value="10th Pass">10th Pass (Matriculation)</option>
                    <option value="12th Pass">12th Pass (Intermediate)</option>
                    <option value="ITI / Diploma">ITI / Diploma</option>
                    <option value="Graduate">Graduate (Any Degree)</option>
                    <option value="Post Graduate">Post Graduate</option>
                    <option value="B.Tech / B.E.">B.Tech / B.E.</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select name="category" value={formData.category} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-brand-500 outline-none">
                    <option>General</option>
                    <option>OBC</option>
                    <option>SC</option>
                    <option>ST</option>
                    <option>EWS</option>
                  </select>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full mt-2 bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 px-4 rounded-xl flex justify-center items-center gap-2 transition-all disabled:opacity-70"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                {isLoading ? "Searching Gov Portals..." : "Find Eligible Govt Jobs"}
              </button>
            </form>
          </div>

          {/* Right Column - Results */}
          <div className="w-full xl:w-2/3 bg-white p-6 rounded-2xl shadow-sm border border-gray-200 min-h-[500px]">
            <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-4 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-brand-600" /> Government Job Recommendations
            </h2>

            {errorMsg && (
              <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 text-sm font-medium">
                {errorMsg}
              </div>
            )}

            {!jobs && !isLoading && !errorMsg && (
              <div className="h-[400px] flex flex-col items-center justify-center text-gray-400">
                <Briefcase className="w-16 h-16 mb-4 text-gray-200" />
                <p className="text-lg font-medium">Fill the form and click "Find Eligible Govt Jobs"</p>
                <p className="text-sm">Matched legitimate jobs will appear here instantly.</p>
              </div>
            )}

            {jobs && (
              <div className="space-y-4">
                <p className="text-gray-600 font-medium">We found {jobs.length} government jobs matching this student's profile.</p>
                {jobs.map((job) => (
                  <div 
                    key={job.id} 
                    className={`bg-white border-2 rounded-2xl p-5 transition-all overflow-hidden ${
                      selectedJobs.has(job.id) ? 'border-brand-500 shadow-md shadow-brand-500/10' : 'border-gray-200 hover:border-brand-300'
                    }`}
                  >
                    <div className="flex gap-4">
                      <div className="pt-1">
                        <button 
                          onClick={() => toggleJobSelection(job.id)}
                          className={`w-6 h-6 rounded flex items-center justify-center border transition-all ${
                            selectedJobs.has(job.id) ? 'bg-brand-600 border-brand-600 text-white' : 'border-gray-300 bg-white'
                          }`}
                        >
                          {selectedJobs.has(job.id) && <Check className="w-4 h-4" />}
                        </button>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 cursor-pointer" onClick={() => toggleJobSelection(job.id)}>
                          {job.jobTitle}
                        </h3>
                        <p className="text-brand-700 font-medium mt-1 text-sm">{job.department}</p>
                        
                        <div className="grid grid-cols-2 gap-4 mt-4 bg-gray-50 p-4 rounded-xl">
                          <div>
                            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Required Qualification</p>
                            <p className="font-semibold text-gray-900 mt-1">{job.qualificationNeeded}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Age Limit</p>
                            <p className="font-semibold text-gray-900 mt-1">{job.ageLimit}</p>
                          </div>
                        </div>
                        
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          {job.navigationGuide && job.navigationGuide.length > 0 && (
                            <>
                              <h4 className="text-sm font-bold text-gray-900 mb-2">How to find the form:</h4>
                              <ol className="list-decimal list-inside space-y-1 mb-4 text-sm text-gray-700 bg-blue-50/50 p-3 rounded-xl border border-blue-100">
                                {job.navigationGuide.map((step, idx) => (
                                  <li key={idx}>{step}</li>
                                ))}
                              </ol>
                            </>
                          )}
                          <div className="flex justify-end">
                            <a 
                              href={job.officialWebsite.startsWith('http') ? job.officialWebsite : `https://${job.officialWebsite}`}
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-100 transition-all"
                            >
                              Go to Official Portal <ExternalLink className="w-4 h-4" />
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {selectedJobs.size > 0 && (
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
                          : `Save ${selectedJobs.size} Selected Jobs`
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
