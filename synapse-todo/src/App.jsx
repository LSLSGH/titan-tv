import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Plus, X, Activity, Target, Zap, Trash2, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

// --- Components ---

const SpatialBackground = () => (
  <div className="spatial-field">
    <div className="energy-grid" />
    <div className="neural-core" />
  </div>
);

const TaskOrb = ({ task, onComplete, onRemove }) => {
  const [position] = useState({
    x: Math.random() * (window.innerWidth - 300) + 150,
    y: Math.random() * (window.innerHeight - 300) + 150
  });

  const handleDragEnd = (event, info) => {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const dropX = info.point.x;
    const dropY = info.point.y;
    
    // Calculate distance to core
    const dist = Math.sqrt(Math.pow(dropX - centerX, 2) + Math.pow(dropY - centerY, 2));
    
    if (dist < 150) {
      onComplete(task.id);
    }
  };

  return (
    <motion.div
      drag
      dragElastic={0.1}
      dragTransition={{ bounceStiffness: 100, bounceDamping: 10 }}
      onDragEnd={handleDragEnd}
      initial={{ scale: 0, opacity: 0, x: position.x, y: position.y }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      whileHover={{ scale: 1.1, zIndex: 10 }}
      whileTap={{ scale: 0.9, cursor: 'grabbing' }}
      className="task-orb w-40 h-40"
    >
      <div className="flex flex-col items-center gap-2">
        <Target size={20} className="text-synapse-cyan/40" />
        <p className="text-[10px] font-black uppercase tracking-widest text-white/80 line-clamp-2">{task.text}</p>
        <button 
          onClick={() => onRemove(task.id)}
          className="absolute -top-2 -right-2 w-6 h-6 bg-white/5 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <X size={10} />
        </button>
      </div>
    </motion.div>
  );
};

export default function App() {
  const [tasks, setTasks] = useState([
    { id: 1, text: "Establish Neural Uplink" },
    { id: 2, text: "Refactor Protocol v12" },
    { id: 3, text: "Sync Quantum State" }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [completedCount, setCompletedCount] = useState(0);

  const addTask = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    const newTask = {
      id: Date.now(),
      text: inputValue
    };
    setTasks([...tasks, newTask]);
    setInputValue("");
  };

  const completeTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
    setCompletedCount(prev => prev + 1);
    
    // Neural feedback
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.5 },
      colors: ['#00f2ff', '#7000ff']
    });
  };

  const removeTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  return (
    <main className="min-h-screen relative overflow-hidden">
      <SpatialBackground />
      
      {/* Header Overlay */}
      <div className="fixed top-0 w-full p-10 flex justify-between items-start pointer-events-none z-50">
        <div>
          <div className="flex items-center gap-3 mb-2 pointer-events-auto">
            <Activity className="text-synapse-cyan" size={24} />
            <h1 className="h1-synapse text-2xl">SYNAPSE<span className="text-synapse-cyan">_ID</span></h1>
          </div>
          <p className="label-mono opacity-40">Neural Productivity Protocol Active</p>
        </div>
        
        <div className="text-right pointer-events-auto">
          <div className="label-mono mb-2">Resolved Pulses</div>
          <div className="h1-synapse text-4xl text-synapse-cyan">{completedCount}</div>
        </div>
      </div>

      {/* Input Overlay */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-full max-w-xl px-6 z-50">
        <form onSubmit={addTask} className="relative">
          <input 
            type="text" 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Inject New Task Pulse..."
            className="input-glass"
          />
          <button 
            type="submit"
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-synapse-cyan rounded-full flex items-center justify-center text-black hover:scale-110 transition-transform"
          >
            <Plus size={20} />
          </button>
        </form>
      </div>

      {/* Spatial Task Field */}
      <AnimatePresence>
        {tasks.map(task => (
          <TaskOrb 
            key={task.id} 
            task={task} 
            onComplete={completeTask} 
            onRemove={removeTask}
          />
        ))}
      </AnimatePresence>

      {/* Instructions Overlay */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none text-center opacity-20">
        <p className="label-mono text-[10px]">Drag Pulse to Core to Resolve</p>
      </div>
    </main>
  );
}
