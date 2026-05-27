"use client";

import { useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { Loader2, Users, FileText, ChevronRight, Search } from "lucide-react";
import Link from "next/link";

type SavedProfile = {
  id: string;
  citizenProfile: {
    name: string;
    phone: string;
    state: string;
    city: string;
  };
  savedSchemes: Array<{
    id: string;
    name: string;
  }>;
  createdAt: any;
  status: string;
};

export default function DashboardPage() {
  const [profiles, setProfiles] = useState<SavedProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/login");
        return;
      }

      try {
        const q = query(
          collection(db, "saved_profiles"),
          where("operatorId", "==", user.uid),
          orderBy("createdAt", "desc")
        );
        
        const querySnapshot = await getDocs(q);
        const fetchedProfiles: SavedProfile[] = [];
        
        querySnapshot.forEach((doc) => {
          fetchedProfiles.push({ id: doc.id, ...doc.data() } as SavedProfile);
        });
        
        setProfiles(fetchedProfiles);
      } catch (error) {
        console.error("Error fetching profiles:", error);
      } finally {
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const filteredProfiles = profiles.filter(p => 
    p.citizenProfile?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.citizenProfile?.phone?.includes(searchQuery)
  );

  if (isLoading) {
    return (
      <div className="flex-1 flex justify-center items-center">
        <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto w-full p-4 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Operator Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage saved citizens and process scheme applications</p>
        </div>
        <Link 
          href="/wizard" 
          className="bg-brand-600 hover:bg-brand-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-sm"
        >
          + New Citizen Profile
        </Link>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center">
          <div className="relative w-full max-w-md">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search by citizen name or phone..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none text-sm"
            />
          </div>
        </div>

        {filteredProfiles.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center">
            <div className="bg-brand-50 p-4 rounded-full mb-4">
              <Users className="w-8 h-8 text-brand-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">No citizens found</h3>
            <p className="text-gray-500 max-w-sm mt-1">
              {searchQuery ? "Try adjusting your search terms." : "You haven't saved any scheme applications for citizens yet."}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredProfiles.map((profile) => (
              <Link 
                href={`/dashboard/${profile.id}`} 
                key={profile.id}
                className="p-4 md:p-6 hover:bg-gray-50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4 group"
              >
                <div className="flex items-start gap-4">
                  <div className="bg-gray-100 p-3 rounded-xl">
                    <UserAvatar name={profile.citizenProfile?.name || "Unknown"} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{profile.citizenProfile?.name || "Unnamed Citizen"}</h3>
                    <div className="text-sm text-gray-500 flex items-center gap-3 mt-1">
                      <span>{profile.citizenProfile?.phone || "No phone"}</span>
                      <span>•</span>
                      <span>{profile.citizenProfile?.city}, {profile.citizenProfile?.state}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="flex flex-col items-end">
                    <span className="text-sm font-medium text-gray-900">
                      {profile.savedSchemes?.length || 0} Schemes
                    </span>
                    <span className="text-xs text-gray-500 mt-1">
                      {profile.createdAt?.toDate ? new Date(profile.createdAt.toDate()).toLocaleDateString() : "Recently"}
                    </span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-brand-600 transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function UserAvatar({ name }: { name: string }) {
  const initial = name.charAt(0).toUpperCase();
  return <span className="font-bold text-gray-500 w-6 h-6 flex items-center justify-center">{initial}</span>;
}
