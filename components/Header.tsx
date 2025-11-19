import Image from 'next/image'

export default function Header() {
  return (
    <div className="relative w-full pt-20 pb-10 md:pt-24 md:pb-12 overflow-hidden">
      {/* Ambient Background Mesh */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-600/20 blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-tl from-purple-500/20 to-pink-600/20 blur-[120px] animate-pulse delay-700"></div>
      </div>

      <div className="relative max-w-5xl mx-auto px-4 z-10">
        {/* Glass Card Container */}
        <div className="relative rounded-[2rem] overflow-hidden bg-white/5 backdrop-blur-3xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] ring-1 ring-white/5">

          {/* Glossy Shine Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none"></div>
          {/* Bottom Depth Gradient */}
          <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-[#00e0ff0f] to-transparent pointer-events-none"></div>

          <div className="relative px-6 py-10 md:px-12 md:py-14 text-center">

            {/* Floating Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/30 border border-white/10 backdrop-blur-md mb-6 shadow-inner">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              <span className="text-xs font-bold text-cyan-100 tracking-widest uppercase drop-shadow-md">AI Automation System</span>
            </div>

            {/* Main Title with Glass Text Effect */}
            <h1 className="text-4xl md:text-7xl font-black tracking-tighter text-white mb-6 drop-shadow-2xl">
              <span className="block text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/60 pb-2">
                Workflow
              </span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-500 to-purple-500 animate-gradient drop-shadow-[0_0_25px_rgba(6,182,212,0.4)] pb-4 -mt-2">
                Intelligence
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base md:text-lg text-blue-100/80 max-w-2xl mx-auto mb-8 leading-relaxed font-medium">
              Experience next-gen automation engineered for <span className="text-white font-bold">precision</span>, <span className="text-white font-bold">speed</span> and <span className="text-white font-bold">clarity</span>.
            </p>

            {/* Glossy CTA Button */}
            <div className="mb-12">
              <a
                href="#workflows"
                className="group relative inline-flex items-center justify-center px-8 py-3 text-base font-bold text-white transition-all duration-300 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full hover:scale-105 border border-[#00E0FF]/20 shadow-[0_0_40px_-10px_rgba(6,182,212,0.5)] hover:shadow-[0_0_60px_-15px_rgba(6,182,212,0.8)] overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Launch Workflows
                  <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>
                </span>
                {/* Button Shine */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
              </a>
            </div>

            {/* Glass Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {[
                { label: 'Accuracy', value: '99.9%' },
                { label: 'Workflows', value: '4+' },
                { label: 'Latency', value: '<50ms' },
                { label: 'Uptime', value: '100%' },
              ].map((stat, i) => (
                <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-[0_0_20px_#00f2ff14] hover:bg-white/10 transition-all duration-300 hover:-translate-y-1">
                  <div className="text-2xl md:text-3xl font-bold text-white tracking-tight">{stat.value}</div>
                  <div className="text-[10px] md:text-xs text-cyan-200/70 uppercase tracking-widest font-bold mt-1">{stat.label}</div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
