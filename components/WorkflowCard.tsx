interface WorkflowCardProps {
  workflow: { id: string; name: string; icon: string }
  isSelected: boolean
  onSelect: () => void
}

export default function WorkflowCard({ workflow, isSelected, onSelect }: WorkflowCardProps) {
  return (
    <button
      onClick={onSelect}
      className={`group relative p-6 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 overflow-hidden ${
        isSelected
          ? 'border-cyan-500 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 shadow-lg shadow-cyan-500/30'
          : 'border-white/10 bg-white/5 hover:border-cyan-400/50 hover:bg-white/10 hover:shadow-lg backdrop-blur-sm'
      }`}
    >
      {/* Animated background gradient */}
      {isSelected && (
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-purple-500/10 animate-gradient"></div>
      )}
      
      {/* Check mark */}
      {isSelected && (
        <div className="absolute -top-2 -right-2 bg-gradient-to-br from-cyan-500 to-blue-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-xs font-bold shadow-lg z-10">
          ✓
        </div>
      )}
      
      {/* Content */}
      <div className="relative z-10">
        <div className={`text-4xl mb-3 transition-all duration-300 ${isSelected ? 'scale-110 drop-shadow-lg' : 'group-hover:scale-110'}`}>
          {workflow.icon}
        </div>
        <h3 className={`text-sm font-semibold transition-colors ${isSelected ? 'text-cyan-300' : 'text-gray-300 group-hover:text-white'}`}>
          {workflow.name}
        </h3>
      </div>

      {/* Hover glow effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 pointer-events-none"></div>
    </button>
  )
}
