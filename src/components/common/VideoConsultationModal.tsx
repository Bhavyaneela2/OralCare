import React, { useState } from 'react';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  PhoneOff,
  MessageSquare,
  Users,
  Share2,
  ExternalLink,
  ShieldCheck,
  Send,
  X
} from 'lucide-react';
import { Appointment } from '../../types';

interface VideoConsultationModalProps {
  appointment: Appointment;
  onClose: () => void;
  currentUserRole: 'patient' | 'doctor' | 'admin';
}

export const VideoConsultationModal: React.FC<VideoConsultationModalProps> = ({
  appointment,
  onClose,
  currentUserRole
}) => {
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [activeTab, setActiveTab] = useState<'video' | 'chat' | 'participants'>('video');
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{ sender: string; text: string; time: string }>>([
    {
      sender: 'Dr. Priya Mehta',
      text: 'Good day! I have reviewed your dental history and the reported sensitivity on tooth 46.',
      time: '10:30 AM'
    },
    {
      sender: 'Neela Bhavya Sri',
      text: 'Hello doctor, yes, the pain has been noticeable especially when chewing solid food.',
      time: '10:31 AM'
    }
  ]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    setChatMessages([
      ...chatMessages,
      {
        sender: currentUserRole === 'doctor' ? appointment.doctorName : appointment.patientName,
        text: chatInput.trim(),
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setChatInput('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 md:p-6 animate-in fade-in duration-200">
      <div className="w-full max-w-5xl h-[90vh] bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl flex flex-col overflow-hidden text-white">
        {/* Header Bar */}
        <div className="px-6 py-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center">
              <Video className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs md:text-sm font-bold tracking-tight">
                OralCare Encrypted Tele-Consultation
              </h2>
              <p className="text-[10px] text-slate-400">
                {appointment.doctorName} &bull; {appointment.patientName} &bull; {appointment.time}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {appointment.meetLink && (
              <a
                href={appointment.meetLink}
                target="_blank"
                rel="noreferrer"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-400 text-xs font-semibold border border-slate-700 transition-colors"
              >
                <span>Open in Google Meet</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Video Area + Chat Sidebar */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
          {/* Main Video Screen */}
          <div className="flex-1 bg-slate-950 p-4 flex flex-col justify-between relative overflow-hidden">
            {/* Main Stage (Doctor) */}
            <div className="relative w-full h-full rounded-2xl bg-slate-900 overflow-hidden flex items-center justify-center border border-slate-800/80 shadow-inner">
              <img
                src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=1200"
                alt="Doctor stream"
                className="w-full h-full object-cover"
              />

              <div className="absolute top-4 left-4 bg-slate-900/70 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/60 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-semibold">{appointment.doctorName} (Doctor)</span>
              </div>

              {/* Patient PiP Stream */}
              <div className="absolute bottom-4 right-4 w-44 md:w-56 aspect-video bg-slate-800 rounded-xl overflow-hidden border-2 border-slate-700 shadow-xl flex items-center justify-center">
                {isVideoOn ? (
                  <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center relative">
                    <div className="w-12 h-12 rounded-full bg-teal-600 text-white flex items-center justify-center text-sm font-bold">
                      {appointment.patientName.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                    </div>
                    <span className="absolute bottom-2 left-2 text-[10px] font-semibold bg-black/60 px-2 py-0.5 rounded-md">
                      You ({currentUserRole})
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-slate-400">
                    <VideoOff className="w-6 h-6 mb-1" />
                    <span className="text-[10px]">Camera Off</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Chat & Participants Panel */}
          <div className="w-full lg:w-80 bg-slate-900 border-l border-slate-800 flex flex-col">
            <div className="flex border-b border-slate-800 p-2 gap-1 text-xs font-semibold">
              <button
                onClick={() => setActiveTab('chat')}
                className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                  activeTab === 'chat' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>In-Call Chat</span>
              </button>

              <button
                onClick={() => setActiveTab('participants')}
                className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                  activeTab === 'participants' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Participants (2)</span>
              </button>
            </div>

            {activeTab === 'chat' && (
              <div className="flex-1 flex flex-col justify-between p-4 overflow-hidden">
                <div className="space-y-3 overflow-y-auto pr-1 flex-1 text-xs">
                  {chatMessages.map((msg, idx) => (
                    <div key={idx} className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700/60">
                      <div className="flex items-center justify-between text-[10px] text-teal-400 font-semibold mb-1">
                        <span>{msg.sender}</span>
                        <span className="text-slate-400">{msg.time}</span>
                      </div>
                      <p className="text-slate-200 leading-relaxed">{msg.text}</p>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSendMessage} className="mt-3 relative">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Type in-call message..."
                    className="w-full pl-3 pr-10 py-2.5 bg-slate-800 text-white placeholder:text-slate-500 rounded-xl border border-slate-700 text-xs outline-none focus:border-teal-500"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-teal-400 hover:text-teal-300 p-1"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'participants' && (
              <div className="p-4 space-y-3 text-xs">
                <div className="flex items-center gap-3 p-3 bg-slate-800/60 rounded-xl border border-slate-700/50">
                  <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center font-bold">
                    PM
                  </div>
                  <div>
                    <h4 className="font-bold">{appointment.doctorName}</h4>
                    <p className="text-[10px] text-teal-400">Host &bull; Attending Dentist</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-slate-800/60 rounded-xl border border-slate-700/50">
                  <div className="w-8 h-8 rounded-full bg-sky-600 flex items-center justify-center font-bold">
                    {appointment.patientName.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-bold">{appointment.patientName}</h4>
                    <p className="text-[10px] text-slate-400">Patient</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Control Bar */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-teal-500" />
            <span className="hidden sm:inline">256-Bit Encrypted Healthcare Stream</span>
          </div>

          {/* Center Call Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMicOn(!isMicOn)}
              className={`p-3 rounded-2xl transition-colors ${
                isMicOn ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-rose-600 text-white'
              }`}
              title={isMicOn ? 'Mute' : 'Unmute'}
            >
              {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
            </button>

            <button
              onClick={() => setIsVideoOn(!isVideoOn)}
              className={`p-3 rounded-2xl transition-colors ${
                isVideoOn ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-rose-600 text-white'
              }`}
              title={isVideoOn ? 'Turn Video Off' : 'Turn Video On'}
            >
              {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
            </button>

            <button
              onClick={onClose}
              className="py-3 px-6 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-rose-600/30 transition-all cursor-pointer"
            >
              <PhoneOff className="w-4 h-4" />
              <span>Leave Consultation</span>
            </button>
          </div>

          <div className="w-24 text-right text-xs text-slate-400">
            00:14:32
          </div>
        </div>
      </div>
    </div>
  );
};
