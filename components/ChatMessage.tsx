import React from 'react';
import { Message, Sender, AgentType } from '../types';
import { UserIcon, getAgentIcon, getAgentColor, getAgentName } from './Icon';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.sender === Sender.USER;
  const isSystem = message.sender === Sender.SYSTEM;

  if (isSystem) {
    return (
      <div className="flex justify-center my-4 animate-pulse">
        <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
          {message.content}
        </span>
      </div>
    );
  }

  return (
    <div className={`flex w-full mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {/* Avatar */}
      <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center shadow-md z-10 
        ${isUser ? 'order-2 ml-3 bg-indigo-600' : `order-1 mr-3 ${getAgentColor(message.agentType)}`}`}>
        {isUser ? <UserIcon /> : getAgentIcon(message.agentType)}
      </div>

      {/* Message Bubble */}
      <div className={`relative max-w-[80%] rounded-2xl px-5 py-4 shadow-sm text-sm leading-relaxed
        ${isUser 
          ? 'order-1 bg-white text-slate-800 rounded-tr-none border border-slate-100' 
          : 'order-2 bg-white text-slate-800 rounded-tl-none border border-slate-100'
        }`}>
        
        {/* Agent Label (Only for agents) */}
        {!isUser && (
          <div className={`text-xs font-bold mb-1 uppercase tracking-wide
             ${
                message.agentType === AgentType.MEDICAL_RECORDS ? 'text-red-500' :
                message.agentType === AgentType.BILLING ? 'text-green-500' :
                message.agentType === AgentType.PATIENT_INFO ? 'text-purple-500' :
                message.agentType === AgentType.SCHEDULER ? 'text-blue-500' :
                'text-slate-500'
             }
          `}>
            {getAgentName(message.agentType)}
          </div>
        )}

        {/* Content */}
        <div className="whitespace-pre-wrap">{message.content}</div>
        
        {/* Timestamp */}
        <div className={`text-[10px] mt-2 opacity-50 ${isUser ? 'text-right' : 'text-left'}`}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;