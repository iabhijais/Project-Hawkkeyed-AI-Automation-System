interface WorkflowCardProps {
  workflow: { id: string; title: string; description: string; icon: string }
  isSelected: boolean
  onSelect: () => void
}

export default function WorkflowCard({ workflow, isSelected, onSelect }: WorkflowCardProps) {
  return (
    <button
      onClick={onSelect}
      className={`group relative p-5 rounded-2xl border transition-all duration-500 transform hover:scale-[1.02] overflow-hidden text-left h-full w-full flex items-start gap-5 ${isSelected
        ? 'border-cyan-500/50 bg-gradient-to-br from-cyan-500/10 to-blue-600/10 shadow-[0_0_30px_rgba(6,182,212,0.15)]'
        : 'border-white/5 bg-white/5 hover:border-cyan-500/30 hover:bg-cyan-500/5 hover:shadow-[0_0_20px_rgba(6,182,212,0.1)] backdrop-blur-md'
        }`}
    >
      {/* Animated background gradient for selected state */}
      {isSelected && (
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-blue-500/5 to-purple-500/5 animate-gradient pointer-events-none"></div>
      )}

      {/* Check mark */}
      {isSelected && (
        <div className="absolute top-3 right-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold shadow-lg z-10 animate-fade-in-up">
          ✓
        </div>
      )}

      {/* Icon Container */}
      <div className={`relative z-10 flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center text-3xl transition-all duration-300 ${isSelected
        ? 'bg-cyan-500/20 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
        : 'bg-white/5 text-gray-400 group-hover:text-cyan-300 group-hover:bg-cyan-500/10 group-hover:shadow-[0_0_10px_rgba(6,182,212,0.2)]'
        }`}>
        {workflow.icon}
      </div>

      {/* Content Container */}
      <div className="relative z-10 flex-1 min-w-0">
        <h3 className={`text-lg font-bold mb-1 transition-colors duration-300 truncate ${isSelected ? 'text-cyan-100' : 'text-gray-200 group-hover:text-white'
          }`}>
          {workflow.title}
        </h3>
        <p className={`text-sm leading-relaxed transition-colors duration-300 ${isSelected ? 'text-cyan-200/70' : 'text-gray-500 group-hover:text-gray-300'
          }`}>
          {workflow.description}
        </p>
      </div>

      {/* Hover glow effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-cyan-500/5 to-transparent pointer-events-none"></div>
    </button>
  )
}
