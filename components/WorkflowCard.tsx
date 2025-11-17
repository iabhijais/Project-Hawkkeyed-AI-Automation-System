interface WorkflowCardProps {
  workflow: { id: string; name: string; icon: string }
  isSelected: boolean
  onSelect: () => void
}

export default function WorkflowCard({ workflow, isSelected, onSelect }: WorkflowCardProps) {
  return (
    <button
      onClick={onSelect}
      className={`p-6 rounded-lg border-2 transition-all ${
        isSelected
          ? 'border-amber-500 bg-amber-500/10'
          : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
      }`}
    >
      <div className="text-4xl mb-3">{workflow.icon}</div>
      <h3 className="text-sm font-medium">{workflow.name}</h3>
    </button>
  )
}
