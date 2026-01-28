import { Globe, FileText, UserPlus, Briefcase, X, AlertCircle } from 'lucide-react'

type SidebarProps = {
  status: string
  isOpen: boolean
  onClose: () => void
  activeSection: string
  onSectionChange: (section: string) => void
}

export function Sidebar({ status, isOpen, onClose, activeSection, onSectionChange }: SidebarProps) {
  const menuItems = [
    { id: 'application', label: 'Application', icon: FileText },
    { id: 'delegates', label: 'Add Delegates', icon: UserPlus, requiresApproval: true },
    { id: 'advisors', label: 'Faculty Advisors', icon: Briefcase, requiresApproval: true },
    { id: 'assignments', label: 'Country Assignments', icon: Globe, requiresApproval: true },
  ]

  const isApproved = status === 'approved'

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={onClose} />
      )}

      {/* Sidebar */}
      <div
        className={`fixed lg:sticky top-0 left-0 h-screen bg-white border-r border-gray-200 transition-transform duration-300 z-50 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } w-64 flex flex-col`}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-900">Menu</h2>
          <button onClick={onClose} className="lg:hidden text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto p-4">
          <div className="space-y-4">
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
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-[#104179]/40 text-[#104179] font-medium'
                      : isDisabled
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm">{item.label}</span>
                </button>
              )
            })}
          </div>
        </nav>

        {/* Status Notice */}
        {!isApproved && (
          <div className="p-4 m-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-yellow-900 mb-1">
                  Application Under Review
                </p>
                <p className="text-xs text-yellow-800">
                  Additional features will unlock once your delegation is approved.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
