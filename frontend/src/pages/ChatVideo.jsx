import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Phone, 
  PhoneOff,
  Monitor,
  Users,
  MessageSquare,
  Settings,
  Send,
  MoreVertical
} from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';

const ChatVideo = () => {
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isCallActive, setIsCallActive] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [showChat, setShowChat] = useState(true);
  const [message, setMessage] = useState('');

  const participants = [
    { id: 1, name: 'John Doe (You)', avatar: 'JD', isVideoOn: true, isAudioOn: true, isHost: true },
    { id: 2, name: 'Sarah Chen', avatar: 'SC', isVideoOn: true, isAudioOn: true, isHost: false },
    { id: 3, name: 'Mike Rodriguez', avatar: 'MR', isVideoOn: false, isAudioOn: true, isHost: false },
    { id: 4, name: 'Emma Davis', avatar: 'ED', isVideoOn: true, isAudioOn: false, isHost: false }
  ];

  const chatMessages = [
    { id: 1, user: 'Sarah Chen', message: 'Can everyone see my screen?', time: '3:15 PM', avatar: 'SC' },
    { id: 2, user: 'Mike Rodriguez', message: 'Yes, looks good!', time: '3:16 PM', avatar: 'MR' },
    { id: 3, user: 'Emma Davis', message: 'The API endpoint diagram is really helpful', time: '3:17 PM', avatar: 'ED' },
    { id: 4, user: 'You', message: 'Should we start coding the authentication flow?', time: '3:18 PM', avatar: 'JD' }
  ];

  const handleEndCall = () => {
    setIsCallActive(false);
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      // Add message logic here
      setMessage('');
    }
  };

  return (
    <div className="h-screen flex bg-slate-900 overflow-hidden">
      {/* Main Video Area */}
      <div className={`flex-1 flex flex-col min-w-0 ${showChat ? 'lg:mr-80' : ''}`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-slate-800 text-white border-b border-slate-700 flex-shrink-0">
          <div className="flex items-center space-x-4 min-w-0">
            <h1 className="text-lg font-semibold truncate">Team Video Call</h1>
            <div className="flex items-center space-x-2 text-sm text-gray-300">
              <Users className="h-4 w-4 flex-shrink-0" />
              <span>{participants.length} participants</span>
            </div>
          </div>
          <div className="flex items-center space-x-2 flex-shrink-0">
            <button className="p-2 rounded-full hover:bg-slate-700 transition-colors">
              <Settings className="h-5 w-5" />
            </button>
            <button className="p-2 rounded-full hover:bg-slate-700 transition-colors">
              <MoreVertical className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Video Grid */}
        <div className="flex-1 p-4 min-h-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 h-full">
            {participants.map((participant, index) => (
              <motion.div
                key={participant.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="relative bg-slate-800 rounded-xl overflow-hidden min-h-0"
              >
                {participant.isVideoOn ? (
                  <div className="video-placeholder h-full">
                    <div className="flex items-center justify-center h-full">
                      <div className="h-20 w-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-2xl font-bold text-white">{participant.avatar}</span>
                      </div>
                    </div>
                    {/* Simulated video overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full bg-slate-700">
                    <div>
                      <div className="h-20 w-20 bg-slate-600 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-2xl font-bold text-white">{participant.avatar}</span>
                      </div>
                      <VideoOff className="h-8 w-8 text-gray-400 mx-auto" />
                    </div>
                  </div>
                )}

                {/* Participant Info */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                  <div className="flex items-center space-x-2 min-w-0">
                    <span className="text-white text-sm font-medium bg-black/50 px-2 py-1 rounded truncate">
                      {participant.name}
                    </span>
                    {participant.isHost && (
                      <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded flex-shrink-0">
                        Host
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-1 flex-shrink-0">
                    {!participant.isAudioOn && (
                      <MicOff className="h-4 w-4 text-red-400" />
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="p-4 bg-slate-800 border-t border-slate-700 flex-shrink-0">
          <div className="flex items-center justify-center space-x-4">
            <Button
              variant={isAudioOn ? "secondary" : "danger"}
              size="lg"
              onClick={() => setIsAudioOn(!isAudioOn)}
              className="rounded-full w-12 h-12 p-0"
            >
              {isAudioOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
            </Button>

            <Button
              variant={isVideoOn ? "secondary" : "danger"}
              size="lg"
              onClick={() => setIsVideoOn(!isVideoOn)}
              className="rounded-full w-12 h-12 p-0"
            >
              {isVideoOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
            </Button>

            <Button
              variant="danger"
              size="lg"
              onClick={handleEndCall}
              className="rounded-full w-12 h-12 p-0"
            >
              <PhoneOff className="h-5 w-5" />
            </Button>

            <Button
              variant={isScreenSharing ? "primary" : "secondary"}
              size="lg"
              onClick={() => setIsScreenSharing(!isScreenSharing)}
              className="rounded-full w-12 h-12 p-0"
            >
              <Monitor className="h-5 w-5" />
            </Button>

            <Button
              variant={showChat ? "primary" : "secondary"}
              size="lg"
              onClick={() => setShowChat(!showChat)}
              className="rounded-full w-12 h-12 p-0"
            >
              <MessageSquare className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Chat Panel */}
      {showChat && (
        <motion.div
          initial={{ x: 320 }}
          animate={{ x: 0 }}
          className="w-80 bg-slate-800 flex flex-col border-l border-slate-700 flex-shrink-0"
        >
          {/* Chat Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-700 flex-shrink-0">
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5 text-blue-400" />
              <h3 className="font-medium text-white">Meeting Chat</h3>
            </div>
            <button
              onClick={() => setShowChat(false)}
              className="p-1 rounded hover:bg-slate-700 transition-colors"
            >
              <Settings className="h-4 w-4 text-gray-400" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
            {chatMessages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.user === 'You' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs ${msg.user === 'You' ? 'order-2' : 'order-1'}`}>
                  <div className={`flex items-center space-x-2 mb-1 ${msg.user === 'You' ? 'justify-end' : 'justify-start'}`}>
                    {msg.user !== 'You' && (
                      <div className="h-5 w-5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-white">{msg.avatar}</span>
                      </div>
                    )}
                    <span className="text-xs text-gray-400">{msg.user}</span>
                    <span className="text-xs text-gray-500">{msg.time}</span>
                  </div>
                  <div className={`p-3 rounded-lg ${
                    msg.user === 'You' 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' 
                      : 'bg-slate-700 text-gray-100 border border-slate-600'
                  }`}>
                    <p className="text-sm">{msg.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-slate-700 bg-slate-800 flex-shrink-0">
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
              />
              <Button size="sm" onClick={handleSendMessage}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Call Status Overlay */}
      {!isCallActive && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="p-8 text-center">
            <PhoneOff className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">Call Ended</h2>
            <p className="text-gray-400 mb-6">The video call has been ended.</p>
            <Button onClick={() => setIsCallActive(true)}>
              Rejoin Call
            </Button>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ChatVideo;