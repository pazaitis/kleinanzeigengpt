import { useRouter } from 'next/router'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '../supabase'
import Logo from './Logo'
import { 
  HomeIcon, 
  UsersIcon, 
  ChartBarIcon,
  CogIcon,
  DocumentMagnifyingGlassIcon,
  ArrowLeftOnRectangleIcon
} from '@heroicons/react/24/outline'
import AdminProtected from './AdminProtected'

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: HomeIcon },
  { name: 'Users', href: '/admin/users', icon: UsersIcon },
  { name: 'Analyses', href: '/admin/analyses', icon: DocumentMagnifyingGlassIcon },
  { name: 'Settings', href: '/admin/settings', icon: CogIcon },
]

export default function AdminLayout({ children }) {
  const router = useRouter()
  const [adminUser, setAdminUser] = useState(null)

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <AdminProtected>
      <div className="min-h-screen bg-gray-100">
        {/* Sidebar */}
        <div className="fixed inset-y-0 left-0 w-64 bg-white border-r">
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="flex items-center h-16 px-6 border-b">
              <Link 
                href="/admin"
                className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
              >
                <Logo className="h-8 w-8 text-blue-600" />
                <span className="text-xl font-bold text-gray-900">Admin</span>
              </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-4 space-y-1">
              {navigation.map((item) => {
                const isActive = router.pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg ${
                      isActive
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    {item.name}
                  </Link>
                )
              })}

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center px-4 py-2 text-sm font-medium rounded-lg text-gray-600 hover:bg-gray-50"
              >
                <ArrowLeftOnRectangleIcon className="w-5 h-5 mr-3" />
                Logout
              </button>
            </nav>

            {/* Admin User Info */}
            {adminUser && (
              <div className="p-4 border-t">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                    <span className="text-sm font-medium text-white">
                      {adminUser.email?.[0].toUpperCase()}
                    </span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">
                      {adminUser.email}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="pl-64">
          <main className="py-8">
            {children}
          </main>
        </div>
      </div>
    </AdminProtected>
  )
} 