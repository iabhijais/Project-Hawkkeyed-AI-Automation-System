export default function Loader() {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="relative mb-8">
        {/* Outer ring */}
        <div className="animate-spin rounded-full h-20 w-20 border-4 border-transparent border-t-cyan-500 border-r-blue-500"></div>
        {/* Inner ring */}
        <div className="absolute inset-2 animate-spin rounded-full border-4 border-transparent border-t-purple-500 border-l-cyan-500" style={{animationDirection: 'reverse', animationDuration: '1s'}}></div>
        {/* Center dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3 h-3 bg-gradient-to-br from-cyan-400 to-blue-400 rounded-full animate-pulse"></div>
        </div>
        {/* Glow effect */}
        <div className="absolute inset-0 animate-ping rounded-full border-4 border-cyan-500 opacity-20"></div>
      </div>
      
      <div className="text-center space-y-2">
        <p className="text-gray-200 font-semibold text-lg flex items-center gap-2 justify-center">
          <span className="inline-block w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
          Processing workflow
          <span className="inline-block w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-100"></span>
        </p>
        <p className="text-gray-400 text-sm font-mono">AI is analyzing your input...</p>
      </div>
    </div>
  )
}
