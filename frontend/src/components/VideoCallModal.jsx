import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Video, Copy, Check, ExternalLink, X, Users, Clock, Phone, Mail } from 'lucide-react';
import Button from './Button';
import { useToast } from '../contexts/ToastContext';

const VideoCallModal = ({ isOpen, onClose, teamName = "Your Team" }) => {
  const [copied, setCopied] = useState(false);
  const { success } = useToast();

  // Generate a Google Meet link (in real app, this would come from Google Meet API)
  const generateMeetLink = () => {
    const meetId = Math.random().toString(36).substring(2, 15);
    return `https://meet.google.com/${meetId}`;
  };

  const [meetLink] = useState(generateMeetLink());

  const copyMeetLink = async () => {
    try {
      await navigator.clipboard.writeText(meetLink);
      setCopied(true);
      success('Meeting link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = meetLink;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      success('Meeting link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const openGoogleMeet = () => {
    window.open(meetLink, '_blank', 'noopener,noreferrer');
  };

  const shareViaEmail = () => {
    const subject = encodeURIComponent(`Join ${teamName} Video Call`);
    const body = encodeURIComponent(`Hi there!\n\nYou're invited to join our team video call.\n\nMeeting Link: ${meetLink}\n\nSee you there!\n\nBest regards,\n${teamName}`);
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  const copyInviteCode = () => {
    const inviteCode = meetLink.split('/').pop();
    navigator.clipboard.writeText(inviteCode).then(() => {
      success('Invite code copied to clipboard!');
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50"
              onClick={onClose}
            />
            
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <Video className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Start Video Call</h3>
                    <p className="text-sm text-blue-100">{teamName}</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-1 rounded-md hover:bg-white/20 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Meeting Link */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Google Meet Link
                  </label>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm font-mono text-gray-700 truncate">
                      {meetLink}
                    </div>
                    <button
                      onClick={copyMeetLink}
                      className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      title="Copy link"
                    >
                      {copied ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4 text-gray-500" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Invite Code */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meeting Code
                  </label>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm font-mono text-gray-700 text-center">
                      {meetLink.split('/').pop()}
                    </div>
                    <button
                      onClick={copyInviteCode}
                      className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      title="Copy code"
                    >
                      <Copy className="h-4 w-4 text-gray-500" />
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Share this code for others to join directly in Google Meet
                  </p>
                </div>

                {/* Meeting Info */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <Users className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-blue-900 mb-1">
                        Team Meeting
                      </h4>
                      <p className="text-sm text-blue-700">
                        Share this link with your team members to join the video call
                      </p>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="space-y-3">
                  <Button
                    onClick={openGoogleMeet}
                    className="w-full justify-center bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                    size="lg"
                  >
                    <ExternalLink className="mr-2 h-5 w-5" />
                    Join Google Meet
                  </Button>

                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant="outline"
                      onClick={copyMeetLink}
                      className="justify-center"
                    >
                      {copied ? (
                        <>
                          <Check className="mr-2 h-4 w-4" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="mr-2 h-4 w-4" />
                          Copy Link
                        </>
                      )}
                    </Button>

                    <Button
                      variant="outline"
                      onClick={shareViaEmail}
                      className="justify-center"
                    >
                      <Mail className="mr-2 h-4 w-4" />
                      Email Invite
                    </Button>
                  </div>
                </div>

                {/* Instructions */}
                <div className="text-xs text-gray-500 space-y-1 bg-gray-50 p-3 rounded-lg">
                  <p className="font-medium text-gray-700 mb-2">How to join:</p>
                  <p>• Click "Join Google Meet" to start the video call</p>
                  <p>• Copy the link to share with team members</p>
                  <p>• Use "Email Invite" to send invitations</p>
                  <p>• Share the meeting code for direct access</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default VideoCallModal;