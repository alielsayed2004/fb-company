'use client';

import { createContext, useContext, useState } from 'react';
import projectsData from '@/data/projects.json';
import brandsData from '@/data/brands.json';
import companyData from '@/data/company.json';

// Single source of truth: the JSON files in /data, bundled at build time.
// Public pages never read browser storage and never call admin APIs, so every visitor
// sees exactly what is published. The admin dashboard edits these values in memory and
// publishes them through /api/admin/sync (GitHub commit → Vercel rebuild).
const DataContext = createContext();

export const defaultCounters = companyData.counters;
export const defaultContactInfo = companyData.contactInfo;

export function DataProvider({ children }) {
  const [projects, setProjects] = useState(projectsData);
  const [brands, setBrands] = useState(brandsData);
  const [counters, setCounters] = useState(companyData.counters);
  const [contactInfo, setContactInfo] = useState(companyData.contactInfo);

  // Admin-only helpers: update the in-memory copy shown in the dashboard.
  const saveProjects = async (newProjects) => setProjects(newProjects);
  const saveBrands = async (newBrands) => setBrands(newBrands);
  const saveCounters = async (newCounters) => setCounters(newCounters);
  const saveContactInfo = async (newContact) => setContactInfo(newContact);

  // Admin-only: reload the latest committed data (requires the admin session cookie).
  const refreshFromServer = async () => {
    try {
      const res = await fetch('/api/admin/sync');
      if (!res.ok) return { success: false, message: `Server returned ${res.status}` };
      const data = await res.json();
      if (!data.success) return { success: false, message: data.error || 'Server returned error' };
      if (Array.isArray(data.projects)) setProjects(data.projects);
      if (Array.isArray(data.brands)) setBrands(data.brands);
      if (data.counters) setCounters(data.counters);
      if (data.contactInfo) setContactInfo(data.contactInfo);
      return { success: true, data };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  return (
    <DataContext.Provider
      value={{
        projects,
        brands,
        counters,
        contactInfo,
        saveProjects,
        saveBrands,
        saveCounters,
        saveContactInfo,
        refreshFromServer,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
