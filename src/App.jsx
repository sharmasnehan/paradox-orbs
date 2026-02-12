import React, { useState, useEffect, useRef } from 'react';
import { ShieldAlert, Zap, Award, Target, Quote, Layers } from 'lucide-react';

const SCENARIOS = [
  {
    id: 1,
    category: "Product & Tech",
    context: "A major release is due. How do you balance the technical integrity with the market deadline?",
    poles: [
      { label: "Innovation Speed", type: "core" },
      { label: "System Reliability", type: "core" }
    ],
    decoys: [
      { label: "Technical Debt", type: "decoy" },
      { label: "Feature Creep", type: "decoy" }
    ],
    synthesis: { 
      label: "Sustainable Velocity", 
      desc: "Delivering fast without breaking things. Speed and reliability aren't opposites—they're partners when you build quality into the process."
    },
    difficulty: 1,
    speed: 0.4
  },
  {
    id: 2,
    category: "People & Culture",
    context: "The team is under-performing but morale is fragile. How do you handle the review?",
    poles: [
      { label: "High Standards", type: "core" },
      { label: "Psychological Safety", type: "core" }
    ],
    decoys: [
      { label: "Performance PIP", type: "decoy" },
      { label: "Toxic Positivity", type: "decoy" }
    ],
    synthesis: { 
      label: "Compassionate Accountability", 
      desc: "Integrating interpersonal warmth with high expectations. This avoids 'Ruinous Empathy' and maintains professional rigor."
    },
    difficulty: 1,
    speed: 0.5
  },
  {
    id: 3,
    category: "Strategy & Growth",
    context: "Investors want growth; the Finance team wants efficiency. What is the path?",
    poles: [
      { label: "Hyper-Growth", type: "core" },
      { label: "Profitability", type: "core" }
    ],
    decoys: [
      { label: "Aggressive Hiring", type: "decoy" },
      { label: "Total Cost Cut", type: "decoy" },
      { label: "Market Parity", type: "decoy" }
    ],
    synthesis: { 
      label: "Efficient Scale", 
      desc: "Using unit economics to fuel expansion. Avoiding the 'Vicious Cycle' of burning cash without a retention engine."
    },
    difficulty: 2,
    speed: 0.7
  },
  {
    id: 4,
    category: "Leadership & Personal",
    context: "You are the face of a pivot. How do you project yourself to the team?",
    poles: [
      { label: "Bold Confidence", type: "core" },
      { label: "Radical Humility", type: "core" }
    ],
    decoys: [
      { label: "Static Planning", type: "decoy" },
      { label: "Top-Down Order", type: "decoy" },
      { label: "Ego Protection", type: "decoy" }
    ],
    synthesis: { 
      label: "Adaptive Leadership", 
      desc: "Accepting personal paradox. Being confident enough to lead, yet humble enough to listen and adapt to new data."
    },
    difficulty: 2,
    speed: 0.8
  },
  {
    id: 5,
    category: "Operations & Execution",
    context: "Customer demand is surging but quality complaints are rising. How do you respond?",
    poles: [
      { label: "Speed to Market", type: "core" },
      { label: "Quality Control", type: "core" }
    ],
    decoys: [
      { label: "Outsource Everything", type: "decoy" },
      { label: "Freeze Production", type: "decoy" },
      { label: "Blame the Team", type: "decoy" }
    ],
    synthesis: { 
      label: "Scalable Excellence", 
      desc: "Building quality into the process rather than inspecting it at the end. Speed and quality reinforce each other."
    },
    difficulty: 2,
    speed: 0.7
  },
  {
    id: 6,
    category: "Innovation & Risk",
    context: "The board wants predictable returns but the market demands disruption. What's your stance?",
    poles: [
      { label: "Exploit Current", type: "core" },
      { label: "Explore New", type: "core" }
    ],
    decoys: [
      { label: "All-In Pivot", type: "decoy" },
      { label: "Status Quo", type: "decoy" },
      { label: "Spin-Off Everything", type: "decoy" }
    ],
    synthesis: { 
      label: "Ambidextrous Strategy", 
      desc: "Running today's business while inventing tomorrow's. Both exploitation and exploration are essential for long-term survival."
    },
    difficulty: 2,
    speed: 0.8
  },
  {
    id: 7,
    category: "Collaboration & Competition",
    context: "Your biggest competitor proposes a strategic partnership. How do you engage?",
    poles: [
      { label: "Cooperation", type: "core" },
      { label: "Competition", type: "core" }
    ],
    decoys: [
      { label: "Full Merger", type: "decoy" },
      { label: "Total Rejection", type: "decoy" },
      { label: "Passive Observation", type: "decoy" }
    ],
    synthesis: { 
      label: "Co-opetition", 
      desc: "Competing and collaborating simultaneously for mutual benefit. Rivals can be partners in the right context."
    },
    difficulty: 2,
    speed: 0.8
  },
  {
    id: 8,
    category: "Control & Autonomy",
    context: "Remote teams want freedom; executives want visibility. How do you structure work?",
    poles: [
      { label: "Standardization", type: "core" },
      { label: "Empowerment", type: "core" }
    ],
    decoys: [
      { label: "Micromanagement", type: "decoy" },
      { label: "Total Chaos", type: "decoy" },
      { label: "Surveillance Tools", type: "decoy" }
    ],
    synthesis: { 
      label: "Guided Autonomy", 
      desc: "Clear boundaries with freedom to operate within them. Structure enables creativity rather than constraining it."
    },
    difficulty: 2,
    speed: 0.7
  },
  {
    id: 9,
    category: "Short-Term & Long-Term",
    context: "Quarterly targets are at risk but the 5-year strategy requires investment now. What do you prioritize?",
    poles: [
      { label: "Immediate Results", type: "core" },
      { label: "Future Building", type: "core" }
    ],
    decoys: [
      { label: "Cut All R&D", type: "decoy" },
      { label: "Ignore Shareholders", type: "decoy" },
      { label: "Delay Everything", type: "decoy" }
    ],
    synthesis: { 
      label: "Temporal Ambidexterity", 
      desc: "Delivering today while planting seeds for tomorrow. Short-term wins fund long-term bets."
    },
    difficulty: 2,
    speed: 0.8
  },
  {
    id: 10,
    category: "Individual & Collective",
    context: "Star performers want recognition; the team culture values equality. How do you reward?",
    poles: [
      { label: "Individual Achievement", type: "core" },
      { label: "Team Cohesion", type: "core" }
    ],
    decoys: [
      { label: "Winner Takes All", type: "decoy" },
      { label: "Flat Bonuses", type: "decoy" },
      { label: "Eliminate Reviews", type: "decoy" }
    ],
    synthesis: { 
      label: "Collaborative Meritocracy", 
      desc: "Celebrating individual excellence that elevates the whole. Stars shine brightest in strong constellations."
    },
    difficulty: 2,
    speed: 0.7
  },
  {
    id: 11,
    category: "Stability & Change",
    context: "The organization is exhausted from transformation but the market keeps shifting. What's next?",
    poles: [
      { label: "Continuity", type: "core" },
      { label: "Adaptation", type: "core" }
    ],
    decoys: [
      { label: "Constant Restructuring", type: "decoy" },
      { label: "Total Freeze", type: "decoy" },
      { label: "Mass Layoffs", type: "decoy" }
    ],
    synthesis: { 
      label: "Dynamic Stability", 
      desc: "Creating a stable foundation that enables continuous evolution. Change is sustainable when anchored in constants."
    },
    difficulty: 2,
    speed: 0.8
  },
  {
    id: 12,
    category: "Transparency & Discretion",
    context: "Employees demand openness but sensitive negotiations require confidentiality. How much do you share?",
    poles: [
      { label: "Radical Transparency", type: "core" },
      { label: "Strategic Privacy", type: "core" }
    ],
    decoys: [
      { label: "Tell Everyone Everything", type: "decoy" },
      { label: "Tell No One Anything", type: "decoy" },
      { label: "Leak Selectively", type: "decoy" }
    ],
    synthesis: { 
      label: "Calibrated Candor", 
      desc: "Being as open as possible while protecting what must be protected. Trust is built through intentional transparency."
    },
    difficulty: 2,
    speed: 0.8
  },
  {
    id: 13,
    category: "ADVANCED: Multi-Paradox Mode",
    context: "A global expansion meets local regulatory resistance and ethical concerns. Balance all three.",
    poles: [
      { label: "Centralized Speed", type: "core" },
      { label: "Local Flexibility", type: "core" },
      { label: "Brand Consistency", type: "core" }
    ],
    decoys: [
      { label: "Full Autonomy", type: "decoy" },
      { label: "Strict Parity", type: "decoy" },
      { label: "Outsourcing", type: "decoy" }
    ],
    synthesis: { 
      label: "Glocal Governance", 
      desc: "Simultaneous pursuit of global scale and local relevance. Requires high 'Cognitive Complexity' to navigate multi-pole tensions."
    },
    difficulty: 3,
    speed: 1.1
  }
];

const ORB_COLORS = [
  'from-blue-600 to-blue-800',
  'from-emerald-600 to-emerald-800',
  'from-purple-600 to-purple-800',
  'from-rose-600 to-rose-800',
  'from-amber-600 to-amber-800',
  'from-cyan-600 to-cyan-800',
  'from-orange-600 to-orange-800',
  'from-indigo-600 to-indigo-800'
];

const PASSWORD = 'LDCFINAL';

export default function App() {
  const [gameState, setGameState] = useState('password'); 
  const [level, setLevel] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null); 
  const [timeLeft, setTimeLeft] = useState(15);
  const [activeOrbs, setActiveOrbs] = useState([]);
  const [isDragging, setIsDragging] = useState(null);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [completedLevels, setCompletedLevels] = useState([]);
  
  const containerRef = useRef(null);
  const animationFrameRef = useRef(null);

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordInput.toLowerCase() === PASSWORD.toLowerCase()) {
      setGameState('menu');
      setPasswordError(false);
    } else {
      setPasswordError(true);
      setPasswordInput('');
    }
  };

  useEffect(() => {
    if (gameState !== 'playing') {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      return;
    }

    const updatePhysics = () => {
      setActiveOrbs(prev => {
        const nextOrbs = prev.map(orb => ({ ...orb }));
        const scenario = SCENARIOS[level];
        if (!scenario) return prev;

        nextOrbs.forEach((orb, i) => {
          if (isDragging === orb.id) return;

          orb.x += orb.vx;
          orb.y += orb.vy;

          nextOrbs.forEach((other, j) => {
            if (i === j) return;
            const dx = orb.x - other.x;
            const dy = orb.y - other.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const repelThreshold = 18;

            if (dist < repelThreshold && dist > 2) {
              const force = (repelThreshold - dist) * 0.012 * scenario.speed;
              orb.vx += (dx / dist) * force;
              orb.vy += (dy / dist) * force;
            }
          });

          if (orb.x <= 10) { orb.x = 10; orb.vx = Math.abs(orb.vx); }
          if (orb.x >= 90) { orb.x = 90; orb.vx = -Math.abs(orb.vx); }
          if (orb.y <= 15) { orb.y = 15; orb.vy = Math.abs(orb.vy); }
          if (orb.y >= 85) { orb.y = 85; orb.vy = -Math.abs(orb.vy); }

          orb.vx *= 0.98;
          orb.vy *= 0.98;
        });

        return nextOrbs;
      });

      animationFrameRef.current = requestAnimationFrame(updatePhysics);
    };

    animationFrameRef.current = requestAnimationFrame(updatePhysics);
    return () => cancelAnimationFrame(animationFrameRef.current);
  }, [gameState, isDragging, level]);

  useEffect(() => {
    let timer;
    if (gameState === 'playing' && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && gameState === 'playing') {
      handleTimeOut();
    }
    return () => clearInterval(timer);
  }, [gameState, timeLeft]);

  const startLevel = (lvlIndex) => {
    if (lvlIndex >= SCENARIOS.length) {
      setGameState('gameover');
      return;
    }
    
    const scenario = SCENARIOS[lvlIndex];
    const speed = scenario.speed;
    const shuffledColors = [...ORB_COLORS].sort(() => Math.random() - 0.5);
    
    const allItems = [...scenario.poles, ...scenario.decoys].map((item, idx) => ({
      ...item,
      id: `orb-${idx}-${Math.random()}`,
      color: shuffledColors[idx % shuffledColors.length],
      x: 20 + Math.random() * 60,
      y: 20 + Math.random() * 60,
      vx: (Math.random() - 0.5) * speed,
      vy: (Math.random() - 0.5) * speed
    }));

    setActiveOrbs(allItems);
    setLevel(lvlIndex);
    setTimeLeft(Math.max(10, 25 - (lvlIndex * 2))); 
    setGameState('playing');
    setFeedback(null);
  };

  const handleTimeOut = () => {
    setFeedback({
      type: 'failure',
      title: 'Structural Inertia',
      message: 'Management Paralysis.',
      detail: "Delayed response leads to the 'vicious cycle' of worsening organizational tensions."
    });
    setGameState('feedback');
  };

  const handleDragStart = (e, id) => {
    e.stopPropagation(); 
    setIsDragging(id);
  };

  const handleDragMove = (e) => {
    if (!isDragging || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const clientX = (e.touches ? e.touches[0].clientX : e.clientX);
    const clientY = (e.touches ? e.touches[0].clientY : e.clientY);

    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;

    setActiveOrbs(prev => {
        const updated = prev.map(orb => 
          orb.id === isDragging ? { ...orb, x, y, vx: 0, vy: 0 } : orb
        );
        checkCollision(x, y, updated);
        return updated;
    });
  };

  const checkCollision = (dragX, dragY, currentOrbs) => {
    const draggedOrb = currentOrbs.find(o => o.id === isDragging);
    if (!draggedOrb) return;

    const hit = currentOrbs.find(other => {
      if (other.id === isDragging) return false;
      const dx = dragX - other.x;
      const dy = dragY - other.y;
      return Math.sqrt(dx * dx + dy * dy) < 10;
    });

    if (hit) {
      if (draggedOrb.type === 'core' && hit.type === 'core') {
        const totalCoresOnBoard = currentOrbs.filter(o => o.type === 'core').length;
        if (totalCoresOnBoard === 2) {
          handleMergeSuccess();
        } else {
          setActiveOrbs(prev => prev.filter(o => o.id !== hit.id));
        }
      } else if (hit.type === 'decoy') {
        handleMergeFailure(draggedOrb, hit);
      }
    }
  };

  const handleMergeSuccess = () => {
    const scenario = SCENARIOS[level];
    setScore(prev => prev + 300 + (timeLeft * 20));
    setCompletedLevels(prev => prev.includes(level) ? prev : [...prev, level]);
    setFeedback({
      type: 'success',
      title: scenario.synthesis.label,
      message: 'Virtuous Cycle Achieved!',
      detail: scenario.synthesis.desc
    });
    setGameState('feedback');
    setIsDragging(null);
  };

  const handleMergeFailure = (o1, o2) => {
    setFeedback({
      type: 'failure',
      title: 'Defensive Splitting',
      message: `Collision: ${o1.label} + ${o2.label}`,
      detail: null
    });
    setGameState('feedback');
    setIsDragging(null);
  };

  return (
    <div 
      className="h-screen w-full bg-slate-50 text-slate-900 font-sans flex flex-col select-none overflow-hidden"
      onMouseMove={handleDragMove}
      onMouseUp={() => setIsDragging(null)}
      onTouchMove={handleDragMove}
      onTouchEnd={() => setIsDragging(null)}
    >
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center shrink-0 shadow-sm z-30">
        <button 
          onClick={() => { setGameState('menu'); setIsDragging(null); }}
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          <div className="bg-indigo-600 p-2 rounded-lg shadow-md shadow-indigo-100">
            <Target className="w-5 h-5 text-white" />
          </div>
          <div className="text-left">
            <h1 className="text-sm font-black tracking-tighter uppercase text-slate-900 leading-none">Paradox Orbs v5.6</h1>
            <p className="text-[9px] text-slate-500 font-bold tracking-widest mt-1">EDUCATIONAL SIMULATION</p>
          </div>
        </button>
        <div className="flex gap-8 items-center">
          <div className="text-right">
            <div className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Complexity</div>
            <div className="text-xl font-black leading-none">{level + 1}</div>
          </div>
          <div className="text-right border-l border-slate-200 pl-8">
            <div className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Cognition</div>
            <div className="text-xl font-black leading-none text-indigo-600 tracking-tighter">{score}</div>
          </div>
        </div>
      </header>

      <main className="flex-1 relative flex flex-col overflow-hidden">
        {gameState === 'password' && (
          <div className="flex-1 flex items-center justify-center p-6 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900">
            <div className="max-w-sm w-full">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-6 border border-white/20">
                  <Target className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-2xl font-black text-white tracking-tight mb-2">PARADOX ORBS</h1>
                <p className="text-slate-400 text-xs uppercase tracking-widest">Educational Simulation</p>
              </div>
              
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <input
                    type="password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="Enter access code"
                    className={`w-full px-6 py-4 bg-white/10 backdrop-blur-sm border-2 rounded-xl text-white placeholder-slate-400 text-center font-mono tracking-widest focus:outline-none focus:border-indigo-400 transition-all ${passwordError ? 'border-rose-500 animate-shake' : 'border-white/20'}`}
                    autoFocus
                  />
                  {passwordError && (
                    <p className="text-rose-400 text-xs text-center mt-2 font-medium">Access denied. Try again.</p>
                  )}
                </div>
                <button
                  type="submit"
                  className="w-full bg-white text-slate-900 py-4 rounded-xl font-black transition-all hover:bg-indigo-100 active:scale-95 shadow-lg"
                >
                  Authenticate
                </button>
              </form>
              
              <p className="text-slate-500 text-[10px] text-center mt-8 uppercase tracking-widest">
                Authorized personnel only
              </p>
            </div>
          </div>
        )}

        {gameState === 'menu' && (
          <div className="flex-1 flex items-center justify-center p-6 overflow-y-auto">
            <div className="max-w-lg w-full bg-white rounded-3xl shadow-2xl border border-slate-100 p-10 md:p-12">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-indigo-100">
                  <Layers className="w-10 h-10 text-indigo-600" />
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-2 tracking-tight">Paradox Orbs</h2>
                <p className="text-slate-400 text-sm uppercase tracking-widest font-bold">Educational Simulation</p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-6 mb-8 border border-slate-100">
                <h3 className="text-lg font-black text-slate-800 mb-4 uppercase tracking-wide">How to Play</h3>
                <ul className="space-y-4 text-left">
                  <li className="flex gap-3">
                    <span className="w-7 h-7 bg-indigo-600 text-white rounded-lg flex items-center justify-center text-sm font-black shrink-0">1</span>
                    <span className="text-slate-600 text-base leading-snug"><strong className="text-slate-800">Find the core tensions</strong> — identify the two (or three) orbs that represent competing but valid demands.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="w-7 h-7 bg-indigo-600 text-white rounded-lg flex items-center justify-center text-sm font-black shrink-0">2</span>
                    <span className="text-slate-600 text-base leading-snug"><strong className="text-slate-800">Drag them together</strong> — merge the core poles to achieve synthesis. Avoid the decoy options!</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="w-7 h-7 bg-indigo-600 text-white rounded-lg flex items-center justify-center text-sm font-black shrink-0">3</span>
                    <span className="text-slate-600 text-base leading-snug"><strong className="text-slate-800">Beat the clock</strong> — complete each level before time runs out to maximize your score.</span>
                  </li>
                </ul>
              </div>

              <p className="text-slate-500 text-center text-sm mb-6 leading-relaxed">
                Move beyond "Either/Or" thinking. Embrace "Both/And" leadership.
              </p>

              <button 
                onClick={() => startLevel(0)}
                className="w-full bg-slate-900 hover:bg-black text-white py-4 rounded-xl font-black text-lg transition-all shadow-lg active:scale-95"
              >
                Launch Simulation
              </button>
            </div>
          </div>
        )}

        {gameState === 'playing' && (
          <div className="h-full w-full flex flex-col relative">
            <div className="w-full bg-white/95 backdrop-blur-md border-b border-slate-100 p-6 flex flex-col items-center z-20">
              <div className="px-4 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-[10px] font-black uppercase tracking-widest mb-3 border border-indigo-100">
                {SCENARIOS[level].category}
              </div>
              <h2 className="text-base md:text-xl font-bold text-slate-800 text-center max-w-2xl px-4 leading-snug mb-1">
                {SCENARIOS[level].context}
              </h2>
              {SCENARIOS[level].poles.length > 2 && (
                <p className="text-xs text-amber-600 font-bold mt-2 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                  ⚠️ Hint: This level has {SCENARIOS[level].poles.length} poles to merge!
                </p>
              )}
              
              <div className="mt-4 w-full max-w-sm h-2 bg-slate-100 rounded-full overflow-hidden relative shadow-inner">
                <div 
                  className={`h-full transition-all duration-1000 linear ${timeLeft < 5 ? 'bg-rose-500' : 'bg-indigo-600'}`}
                  style={{ width: `${(timeLeft / (Math.max(10, 25 - (level * 2)))) * 100}%` }}
                />
              </div>
              
              <div className="mt-4 flex items-center gap-1.5">
                {SCENARIOS.map((_, idx) => (
                  <div
                    key={idx}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      idx === level 
                        ? 'bg-indigo-600 ring-4 ring-indigo-100' 
                        : completedLevels.includes(idx) 
                          ? 'bg-emerald-500' 
                          : 'bg-slate-200'
                    }`}
                    title={`Level ${idx + 1}: ${SCENARIOS[idx].category}`}
                  />
                ))}
                <span className="ml-2 text-[10px] text-slate-400 font-bold">
                  {completedLevels.length}/{SCENARIOS.length} complete
                </span>
              </div>

              <button 
                onClick={() => startLevel(level + 1)}
                className="mt-3 text-xs text-slate-400 hover:text-slate-600 font-medium transition-colors underline underline-offset-2"
              >
                Skip Level →
              </button>
            </div>

            <div ref={containerRef} className="flex-1 w-full relative overflow-hidden bg-[radial-gradient(#e2e8f0_1.5px,transparent_1.5px)] [background-size:32px_32px]">
              {activeOrbs.map((orb) => (
                <div
                  key={orb.id}
                  onMouseDown={(e) => handleDragStart(e, orb.id)}
                  onTouchStart={(e) => handleDragStart(e, orb.id)}
                  className={`absolute w-24 h-24 md:w-36 md:h-36 rounded-full flex items-center justify-center p-5 text-center shadow-xl transition-transform cursor-grab active:cursor-grabbing
                    ${isDragging === orb.id ? 'scale-110 z-40 ring-8 ring-indigo-500/10' : 'z-10 hover:brightness-105'}
                    bg-gradient-to-br ${orb.color} border-2 border-white/20`}
                  style={{
                    left: `${orb.x}%`,
                    top: `${orb.y}%`,
                    transform: 'translate(-50%, -50%)',
                    touchAction: 'none'
                  }}
                >
                  <span className="font-black text-[10px] md:text-xs text-white leading-tight uppercase tracking-tight drop-shadow-lg">
                    {orb.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {gameState === 'feedback' && feedback && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-6">
            <div className={`max-w-md w-full p-10 rounded-[2.5rem] shadow-2xl bg-white border-t-[12px] ${feedback.type === 'success' ? 'border-t-emerald-500' : 'border-t-rose-500'}`}>
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-md ${feedback.type === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                {feedback.type === 'success' ? <Zap className="w-7 h-7" /> : <ShieldAlert className="w-7 h-7" />}
              </div>
              <h3 className="text-2xl font-black mb-1 text-slate-900 leading-tight">{feedback.title}</h3>
              <p className={`text-base font-bold ${feedback.detail ? 'mb-4' : 'mb-8'} ${feedback.type === 'success' ? 'text-emerald-600' : 'text-rose-600'}`}>{feedback.message}</p>
              
              {feedback.detail && (
                <div className="bg-slate-50 p-6 rounded-2xl text-xs text-slate-600 mb-8 border border-slate-100 leading-relaxed italic relative">
                  <Quote className="absolute -top-3 -left-1 w-6 h-6 text-slate-200 fill-slate-200" />
                  "{feedback.detail}"
                </div>
              )}

              {feedback.type === 'success' ? (
                <>
                  <button 
                    onClick={() => startLevel(level + 1)} 
                    className="w-full py-4 rounded-xl font-black flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 bg-emerald-500 hover:bg-emerald-600 text-white mb-3"
                  >
                    Next Level
                  </button>
                  <button 
                    onClick={() => startLevel(level)} 
                    className="w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 bg-slate-100 hover:bg-slate-200 text-slate-600"
                  >
                    Replay Level
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => startLevel(level)} 
                  className="w-full py-4 rounded-xl font-black flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 bg-slate-900 hover:bg-black text-white"
                >
                  Try Again
                </button>
              )}
            </div>
          </div>
        )}

        {gameState === 'gameover' && (
          <div className="flex-1 flex items-center justify-center p-6 text-center overflow-y-auto">
            <div className="max-w-lg w-full bg-white p-10 md:p-12 rounded-[3rem] shadow-2xl border border-slate-100">
              <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-indigo-100">
                <Award className="w-10 h-10 text-indigo-600" />
              </div>
              <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tighter">TRAINING COMPLETE</h2>
              <div className="bg-indigo-600 p-10 rounded-[2.5rem] mb-8 shadow-2xl shadow-indigo-200">
                <div className="text-[10px] uppercase text-indigo-200 font-black tracking-widest mb-1">Final Cognition Score</div>
                <div className="text-7xl font-black text-white tracking-tighter">{score}</div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-6 mb-8 border border-slate-200 border-dashed">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <span className="text-lg font-black text-slate-400 uppercase tracking-wide">Leaderboard</span>
                  <span className="text-[9px] bg-amber-100 text-amber-700 px-2 py-1 rounded-full font-black uppercase">Under Construction</span>
                </div>
                <div className="space-y-2 opacity-50">
                  <div className="flex justify-between items-center bg-white rounded-lg px-4 py-2 border border-slate-100">
                    <span className="text-sm font-bold text-slate-400">1. — — —</span>
                    <span className="text-sm font-black text-slate-300">- - - -</span>
                  </div>
                  <div className="flex justify-between items-center bg-white rounded-lg px-4 py-2 border border-slate-100">
                    <span className="text-sm font-bold text-slate-400">2. — — —</span>
                    <span className="text-sm font-black text-slate-300">- - - -</span>
                  </div>
                  <div className="flex justify-between items-center bg-white rounded-lg px-4 py-2 border border-slate-100">
                    <span className="text-sm font-bold text-slate-400">3. — — —</span>
                    <span className="text-sm font-black text-slate-300">- - - -</span>
                  </div>
                </div>
                <p className="text-[10px] text-slate-400 mt-3">Coming soon...</p>
              </div>

              <button 
                onClick={() => startLevel(0)}
                className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-lg shadow-xl hover:bg-black transition-all"
              >
                Restart Training
              </button>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-slate-200 py-4 px-6 flex justify-between items-center shrink-0 text-[9px] font-black text-slate-400 uppercase tracking-widest">
        <div className="flex items-center gap-2.5">
          <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
          <span>Simulation Active</span>
        </div>
        <span>v5.6</span>
      </footer>
    </div>
  );
}
