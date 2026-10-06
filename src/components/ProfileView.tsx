import React, { useState } from 'react';
import { TrustedContact } from '../types';
import { 
  UserCheck, 
  Users, 
  Plus, 
  ShieldCheck, 
  Phone, 
  Mail, 
  Share2, 
  CheckCircle2, 
  Info,
  Trash2
} from 'lucide-react';

interface ProfileViewProps {
  contacts: TrustedContact[];
  setContacts: React.Dispatch<React.SetStateAction<TrustedContact[]>>;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ contacts, setContacts }) => {
  const [newContactName, setNewContactName] = useState<string>('');
  const [newContactPhone, setNewContactPhone] = useState<string>('');
  const [newContactRelation, setNewContactRelation] = useState<string>('');
  const [notifyNotice, setNotifyNotice] = useState<string | null>(null);

  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContactName.trim() || !newContactPhone.trim()) return;

    const newContact: TrustedContact = {
      id: `ct-${Date.now()}`,
      name: newContactName.trim(),
      relation: newContactRelation.trim() || 'Trusted Contact',
      phone: newContactPhone.trim(),
      email: `${newContactName.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      isNotified: false
    };

    setContacts(prev => [...prev, newContact]);
    setNewContactName('');
    setNewContactPhone('');
    setNewContactRelation('');
  };

  const handleRemove = (id: string) => {
    setContacts(prev => prev.filter(c => c.id !== id));
  };

  const handleNotifyAll = () => {
    setContacts(prev => prev.map(c => ({ ...c, isNotified: true })));
    setNotifyNotice("🟢 Safety broadcast sent to all 3 Safety Circle contacts: 'My live GPS route is active: Chennai → Pondicherry.'");
    setTimeout(() => setNotifyNotice(null), 4000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
            <UserCheck className="w-7 h-7 text-cyan-400" />
            <span>Safety Circle & Traveler Profile</span>
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Manage your emergency contacts, vehicle preferences, and safety notifications.
          </p>
        </div>

        <button
          onClick={handleNotifyAll}
          className="px-5 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-navy-950 font-extrabold text-xs rounded-xl shadow-glow-cyan transition-all flex items-center justify-center gap-2 shrink-0"
        >
          <Share2 className="w-4 h-4 stroke-[2.5]" />
          <span>Notify All Trusted Contacts</span>
        </button>
      </div>

      {notifyNotice && (
        <div className="p-4 bg-emerald-950/80 border border-emerald-500/40 rounded-2xl text-xs text-emerald-300 font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{notifyNotice}</span>
        </div>
      )}

      {/* Safety Circle List */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-extrabold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-cyan-400" />
            <span>My Safety Circle ({contacts.length} Trusted Contacts)</span>
          </h2>
          <span className="text-xs font-mono text-cyan-300 font-bold">
            Live GPS Tracking Enabled
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className="glass-card p-4 rounded-xl border border-white/5 space-y-3 relative group"
            >
              <button
                onClick={() => handleRemove(contact.id)}
                className="absolute top-3 right-3 text-slate-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity"
                title="Remove Contact"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-300 font-bold text-xs">
                  {contact.name[0]}
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white">{contact.name}</h3>
                  <span className="text-[10px] text-slate-400 block">{contact.relation}</span>
                </div>
              </div>

              <div className="text-xs font-mono text-slate-300 space-y-1 pt-1">
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>{contact.phone}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  contact.isNotified ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-500/20 text-slate-400'
                }`}>
                  {contact.isNotified ? '🟢 Tracking Active' : '⚪ Standby'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Contact Form */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider text-cyan-400 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          <span>Add New Trusted Contact</span>
        </h2>

        <form onSubmit={handleAddContact} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input
            type="text"
            required
            placeholder="Full Name (e.g. Rohan)"
            value={newContactName}
            onChange={(e) => setNewContactName(e.target.value)}
            className="px-3.5 py-2 bg-navy-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />

          <input
            type="tel"
            required
            placeholder="Phone Number (+91...)"
            value={newContactPhone}
            onChange={(e) => setNewContactPhone(e.target.value)}
            className="px-3.5 py-2 bg-navy-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Relationship (e.g. Spouse)"
              value={newContactRelation}
              onChange={(e) => setNewContactRelation(e.target.value)}
              className="flex-1 px-3.5 py-2 bg-navy-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />

            <button
              type="submit"
              className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-navy-950 font-bold text-xs rounded-xl shadow-glow-cyan transition-all shrink-0"
            >
              Add Contact
            </button>
          </div>
        </form>
      </div>

      {/* Disclaimer */}
      <div className="p-4 glass-card rounded-2xl border border-white/5 text-xs text-slate-400 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <p>
          <strong className="text-white">Safety Disclaimer:</strong> SafePath AI is a travel intelligence and preparation prototype. Simulated safety scores and contact dispatches are for demonstration purposes. In real emergencies, always contact official authorities (108/100).
        </p>
      </div>

    </div>
  );
};
