import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, TripDetails, NavView, Hospital } from '../types';
import { FamousPlace } from '../data/famousPlaces';
import { AITravelAssistantEngine, AIMapAction } from '../utils/aiTravelAssistant';
import { 
  Bot, 
  Send, 
  Sparkles, 
  X, 
  User, 
  ShieldCheck, 
  MapPin, 
  Compass, 
  Hospital as HospIcon, 
  AlertTriangle,
  Hotel,
  Utensils,
  Luggage,
  CloudSun,
  Eye
} from 'lucide-react';

interface AICopilotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  tripDetails: TripDetails;
  setTripDetails: React.Dispatch<React.SetStateAction<TripDetails>>;
  onNavigate: (view: NavView) => void;
  onTriggerSOS: () => void;
}

export const AICopilotDrawer: React.FC<AICopilotDrawerProps> = ({
  isOpen,
  onClose,
  tripDetails,
  setTripDetails,
  onNavigate,
  onTriggerSOS,
}) => {
  const engineRef = useRef<AITravelAssistantEngine>(
    new AITravelAssistantEngine({
      destination: tripDetails.destination,
      startingLocation: tripDetails.startingPoint,
      travelType: tripDetails.travelType,
    })
  );

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init',
      sender: 'ai',
      text: `👋 Hello! I am your **SafePath AI Travel & Safety Assistant**.\n\nI am currently tracking your trip for **${tripDetails.destination}**.\n\nAsk me anything! For example:\n• *"What are the best places to visit in ${tripDetails.destination}?"*\n• *"Is it safe for solo female travelers?"*\n• *"Show me nearby hospitals or fuel stations on the map"*\n• *"Plan a 3-day itinerary for my family"*\n• *"Compare Ooty and Kodaikanal"*`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [inputQuery, setInputQuery] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [quickReplies, setQuickReplies] = useState<string[]>([
    `Places in ${tripDetails.destination}`,
    `Safe Route to ${tripDetails.destination}`,
    `Plan 2-Day ${tripDetails.destination} Trip`,
    'Show on Map',
    'Nearby Hospitals'
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Keep engine context synced with tripDetails.destination
  useEffect(() => {
    engineRef.current.setDestination(tripDetails.destination);
  }, [tripDetails.destination]);

  if (!isOpen) return null;

  const handleActionExecution = (action?: AIMapAction) => {
    if (!action) return;

    if (action.destinationName && action.destinationName !== tripDetails.destination) {
      setTripDetails(prev => ({ ...prev, destination: action.destinationName! }));
    }

    if (action.navView) {
      onNavigate(action.navView);
    } else if (action.type === 'SHOW_HOSPITALS_ON_MAP') {
      onNavigate('livemap');
    } else if (action.type === 'SHOW_PLACES_ON_MAP') {
      onNavigate('famousplaces');
    } else if (action.type === 'FLY_TO_LOCATION') {
      onNavigate('livemap');
    }
  };

  const handleSend = (queryToSend?: string) => {
    const text = queryToSend || inputQuery;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-user-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!queryToSend) setInputQuery('');
    setIsTyping(true);

    setTimeout(() => {
      const result = engineRef.current.processQuery(text);

      const aiReply: ChatMessage = {
        id: `msg-ai-${Date.now()}`,
        sender: 'ai',
        text: result.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiReply]);
      setIsTyping(false);

      if (result.quickReplies) {
        setQuickReplies(result.quickReplies);
      }

      handleActionExecution(result.action);
    }, 600);
  };

  const quickActionChips = [
    { label: '🗺️ Plan My Trip', query: `Plan a trip to ${tripDetails.destination}` },
    { label: '✨ Places to Visit', query: `What are the famous tourist places in ${tripDetails.destination}?` },
    { label: '🛡️ Safe Route', query: `What is the safest route to ${tripDetails.destination}?` },
    { label: '🏥 Nearby Hospitals', query: `Show me hospitals near ${tripDetails.destination}` },
    { label: '🚨 Emergency Help', query: `What should I do in an emergency near ${tripDetails.destination}?` },
    { label: '🏨 Hotels & Stay', query: `Where can I stay in ${tripDetails.destination}?` },
    { label: '🍛 Food Specialties', query: `What food should I try in ${tripDetails.destination}?` },
    { label: '🎒 Things to Carry', query: `What should I pack for ${tripDetails.destination}?` },
    { label: '🌤️ Weather & Risks', query: `What is the weather and road risk for ${tripDetails.destination}?` },
    { label: '📍 Show on Map', query: `Show ${tripDetails.destination} on the map` },
  ];

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[450px] glass-nav bg-navy-950/95 border-l border-emerald-500/30 shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300 font-sans">
      
      {/* Drawer Header */}
      <div className="p-3.5 border-b border-white/10 flex items-center justify-between bg-navy-900/80">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-bold shadow-glow-cyan">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xs font-extrabold text-white flex items-center gap-1.5 font-sans">
              <span>SafePath AI Travel Assistant</span>
              <span className="px-1.5 py-0.5 rounded text-[8px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
                SMART AI ACTIVE
              </span>
            </h2>
            <p className="text-[10px] text-slate-400 font-mono">
              Target: <strong className="text-emerald-300">{tripDetails.destination}</strong>
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-xl bg-navy-800 text-slate-400 hover:text-white border border-white/10"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* QUICK ACTION TOOLBAR */}
      <div className="px-3 py-2 border-b border-white/10 bg-navy-900/40 flex items-center gap-1.5 overflow-x-auto scrollbar-none text-[10px]">
        {quickActionChips.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(chip.query)}
            className="px-2.5 py-1 rounded-lg bg-navy-850 hover:bg-navy-800 text-emerald-300 border border-emerald-500/30 whitespace-nowrap font-semibold shrink-0 transition-all shadow-sm"
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Messages Feed */}
      <div className="flex-1 p-3.5 overflow-y-auto space-y-3.5">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {m.sender === 'ai' && (
              <div className="w-7 h-7 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5 shadow-sm">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div className={`max-w-[85%] p-3 rounded-2xl text-xs space-y-1 ${
              m.sender === 'user'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold font-sans shadow-glow-cyan'
                : 'glass-card border border-white/10 text-slate-200 leading-relaxed font-sans bg-navy-900/80 whitespace-pre-wrap'
            }`}>
              <div>{m.text}</div>
              <span className={`block text-[8px] font-mono ${m.sender === 'user' ? 'text-slate-950/70 text-right' : 'text-slate-400'}`}>
                {m.timestamp}
              </span>
            </div>

            {m.sender === 'user' && (
              <div className="w-7 h-7 rounded-xl bg-navy-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0 mt-0.5">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono p-2 glass-card rounded-xl border border-emerald-500/30 w-fit">
            <Bot className="w-4 h-4 animate-spin text-emerald-400" />
            <span>Analyzing trip intelligence & map data...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Dynamic Contextual Quick Replies */}
      {quickReplies.length > 0 && (
        <div className="px-3.5 py-2 border-t border-white/5 bg-navy-900/60 space-y-1">
          <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider">Suggested Follow-ups:</span>
          <div className="flex flex-wrap gap-1.5">
            {quickReplies.map((r, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(r)}
                className="text-[10px] font-bold bg-navy-850 hover:bg-navy-800 text-amber-300 border border-amber-500/30 px-2.5 py-1 rounded-lg transition-colors text-left truncate max-w-full"
              >
                💡 {r}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input box */}
      <div className="p-3 border-t border-white/10 bg-navy-900/90">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder={`Ask anything about ${tripDetails.destination} or any place...`}
            className="flex-1 px-3.5 py-2.5 bg-navy-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-400"
          />
          <button
            type="submit"
            className="p-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold rounded-xl transition-all shadow-glow-cyan shrink-0"
            title="Send Message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

    </div>
  );
};
