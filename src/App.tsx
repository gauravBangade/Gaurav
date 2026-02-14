import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
      <div className="text-center space-y-8 p-10">
        {/* Glowing orb decoration */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-violet-500 to-cyan-400 blur-sm opacity-80 animate-pulse"></div>
        </div>

        {/* Title */}
        <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-pink-400 to-cyan-400 tracking-tight">
          Hi Parth !!!
        </h1>

        {/* Subtitle */}
        <p className="text-lg text-slate-400 max-w-md mx-auto">
          I kept my word you better keep yours
        </p>

        {/* Counter card */}
        <div className="inline-block bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl px-8 py-6 shadow-xl">
          <p className="text-slate-300 text-sm mb-3 uppercase tracking-widest">Counter</p>
          <p className="text-4xl font-bold text-white mb-4">{count}</p>
          <button
            onClick={() => setCount((c) => c + 1)}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
          >
            Click me
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
