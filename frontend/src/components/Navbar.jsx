'use client';

import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { removeAuthToken } from '@/lib/auth';
import useDashboardStore from '@/store/useDashboardStore';

export default function Navbar() {
  const router = useRouter();
  const { user, clearStore } = useDashboardStore();

  const handleLogout = () => {
    removeAuthToken();
    clearStore();
    router.push('/login');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900">
              Customizable Dashboard
            </h1>
          </div>
          <div className="flex items-center gap-4">
            {user && (
              <span className="text-sm text-gray-600">{user.email}</span>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-red-600 transition"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
