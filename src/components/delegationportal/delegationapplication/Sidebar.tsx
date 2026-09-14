import {
  Globe,
  FileText,
  Users,
  X,
  AlertCircle,
  SettingsIcon,
  CheckCircle2,
  LayoutDashboard,
  Home,
  UserCircle,
} from 'lucide-react'
import Link from 'next/link'

type SidebarProps = {
  status: string
  isOpen: boolean
  onClose: () => void
  activeSection: string
  onSectionChange: (section: string) => void
  isDelegateAccount?: boolean
  userName?: string
}

export function Sidebar({
  status,
  isOpen,
  onClose,
  activeSection,
  onSectionChange,
  isDelegateAccount,
  userName,
}: SidebarProps) {
  const portalLabel = isDelegateAccount ? 'Individual delegate' : 'Institution account'

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'register', label: 'Register', icon: FileText },
    { id: 'delegations', label: 'Delegations', icon: Users },
    { id: 'assignments', label: 'Assignments', icon: Globe, requiresApproval: true },
    { id: 'profile', label: 'Profile', icon: UserCircle },
    { id: 'account', label: 'Account Settings', icon: SettingsIcon },
  ]

  const isApproved = status === 'approved'

  return (
    <>
      {/* Sidebar */}
      <div
        className={`fixed lg:sticky top-0 left-0 h-screen bg-[#07131f] lg:py-8 border-r border-white/10 transition-transform duration-300 z-30 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } w-72 flex flex-col`}
      >
        <div className="flex items-center justify-between px-6 pb-5 pt-6 border-b border-white/10">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-11 w-11 bg-[#85c226] border border-[#85c226]/30 flex items-center justify-center">
              <span className="text-[#104179] font-semibold text-lg">
                {userName?.charAt(0) || 'U'}
              </span>
            </div>
            <div className="min-w-0">
              <h4 className="truncate text-sm font-semibold text-white uppercase">{userName}</h4>
              <p className="text-xs text-white/45">{portalLabel}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close navigation menu"
            title="Close navigation menu"
            className="lg:hidden w-9 h-9 rounded-xl border border-white/10 hover:bg-white/5 flex items-center justify-center transition-colors text-white/70"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 pt-5 pb-3">
          <Link
            href="/"
            className="flex items-center justify-between rounded-2xl border border-[#85c226]/20 bg-[#104179]/20 px-4 py-3 text-sm font-semibold text-white transition hover:border-[#85c226]/40 hover:bg-[#104179]/30"
            onClick={onClose}
          >
            <span className="flex items-center gap-3">
              <Home className="h-4 w-4 text-[#85c226]" />
              Go Home
            </span>
            <span className="text-[11px] uppercase tracking-[0.35em] text-white/45">Main site</span>
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 pb-4 pt-2">
          <div className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isDisabled = item.requiresApproval && !isApproved
              const isActive = activeSection === item.id

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (!isDisabled) {
                      onSectionChange(item.id)
                      onClose()
                    }
                  }}
                  disabled={isDisabled}
                  className={`group w-full rounded-2xl px-4 py-3 transition-all duration-200 ${
                    isActive
                      ? 'bg-white text-[#0d0d0d] shadow-[0_12px_30px_rgba(0,0,0,0.24)]'
                      : isDisabled
                        ? 'cursor-not-allowed text-white/30'
                        : 'text-white/75 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-colors ${
                        isActive
                          ? 'border-[#85c226]/30 bg-[#104179] text-white'
                          : 'border-white/10 bg-white/5 text-[#85c226] group-hover:border-white/20'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 text-left">
                      <span className="block text-sm font-semibold">{item.label}</span>
                      {isDisabled ? (
                        <span className="text-xs text-white/35">Requires approval</span>
                      ) : (
                        <span className="text-xs text-white/35">
                          {item.id === 'register' && 'Pick an event'}
                          {item.id === 'delegations' && 'Add students and pay'}
                          {item.id === 'assignments' && 'Countries and committees'}
                          {item.id === 'profile' && 'View your account details'}
                          {item.id === 'dashboard' && 'Overview and shortcuts'}
                          {item.id === 'account' && 'Password and security'}
                        </span>
                      )}
                    </div>
                    {isActive && <div className="h-2.5 w-2.5 rounded-full bg-[#85c226]" />}
                  </div>
                </button>
              )
            })}
          </div>
        </nav>

        <div className="px-4 pb-4">
          {!isApproved ? (
            <div className="rounded-2xl border border-[#85c226]/20 bg-[#104179]/30 p-4">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-[#85c226] shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-white mb-1">Application under review</p>
                  <p className="text-xs text-white/65 leading-relaxed">
                    Registration, delegates, and assignments unlock after approval.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-[#85c226]/20 bg-[#0f1f12] p-4">
              <div className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#85c226] shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-white mb-1">Portal ready</p>
                  <p className="text-xs text-white/65 leading-relaxed">
                    You can manage your delegation, payment, and assignments now.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="px-6 pb-6 pt-2">
          <p className="text-[11px] uppercase tracking-[0.35em] text-white/35">
            {new Date().getFullYear()} GLUNS
          </p>
        </div>
      </div>
    </>
  )
}
