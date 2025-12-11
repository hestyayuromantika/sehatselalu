import React, { useState, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import ChatMessage from './components/ChatMessage';
import InputArea from './components/InputArea';
import { Message, Sender, AgentType, ToolCallResult } from './types';
import { routeUserRequest, executeAgentResponse } from './services/geminiService';
import { NavigatorIcon, MedicalIcon, BillingIcon, PatientIcon, SchedulerIcon } from './components/Icon';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: Sender.AGENT,
      agentType: AgentType.NAVIGATOR,
      content: "Hello. I am the Hospital System Navigator. How can I assist you today? I can direct you to Medical Records, Billing, Patient Services, or Scheduling.",
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addMessage = (message: Message) => {
    setMessages(prev => [...prev, message]);
  };

  const handleUserMessage = async (text: string) => {
    // 1. Add User Message
    const userMsg: Message = {
      id: uuidv4(),
      sender: Sender.USER,
      content: text,
      timestamp: new Date()
    };
    addMessage(userMsg);
    setIsLoading(true);

    try {
      // 2. Add System "Thinking" Message
      addMessage({
        id: uuidv4(),
        sender: Sender.SYSTEM,
        content: "Navigator is analyzing request...",
        timestamp: new Date()
      });

      // 3. Call Router (Navigator)
      const routingResult: ToolCallResult | null = await routeUserRequest(text);

      if (!routingResult) {
        // Fallback if no agent found
        addMessage({
          id: uuidv4(),
          sender: Sender.AGENT,
          agentType: AgentType.NAVIGATOR,
          content: "I apologize, but I couldn't determine the best department for your inquiry. Could you please clarify if this is regarding Records, Billing, Registration, or Scheduling?",
          timestamp: new Date()
        });
        setIsLoading(false);
        return;
      }

      const targetAgent = routingResult.toolName as AgentType;
      const contextArgs = Object.values(routingResult.args).join(' ');

      // 4. Update System Status
      addMessage({
        id: uuidv4(),
        sender: Sender.SYSTEM,
        content: `Delegating to ${targetAgent.replace(/([A-Z])/g, ' $1').trim()}...`,
        timestamp: new Date()
      });

      // 5. Simulate Agent Execution (Call Gemini again with agent persona)
      const agentResponseText = await executeAgentResponse(targetAgent, contextArgs);

      // 6. Add Agent Response
      addMessage({
        id: uuidv4(),
        sender: Sender.AGENT,
        agentType: targetAgent,
        content: agentResponseText,
        timestamp: new Date()
      });

    } catch (error) {
      console.error("Error flow:", error);
      addMessage({
        id: uuidv4(),
        sender: Sender.AGENT,
        agentType: AgentType.NAVIGATOR,
        content: "I'm having trouble connecting to the hospital systems right now. Please try again later.",
        timestamp: new Date()
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      
      {/* Sidebar - Visual Context */}
      <div className="hidden md:flex w-64 flex-col bg-slate-900 text-white p-6 shadow-xl z-20">
        <div className="flex items-center space-x-3 mb-10">
          <div className="p-2 bg-indigo-500 rounded-lg">
             <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
          </div>
          <span className="font-bold text-lg tracking-tight">MediNav AI</span>
        </div>

        <div className="space-y-6">
          <div className="text-xs uppercase text-slate-500 font-semibold tracking-wider">Active Agents</div>
          
          <div className="flex items-center space-x-3 text-slate-300 opacity-50 hover:opacity-100 transition-opacity">
            <div className="p-1.5 bg-red-500 rounded"><MedicalIcon /></div>
            <span className="text-sm">Medical Records</span>
          </div>
          <div className="flex items-center space-x-3 text-slate-300 opacity-50 hover:opacity-100 transition-opacity">
            <div className="p-1.5 bg-green-500 rounded"><BillingIcon /></div>
            <span className="text-sm">Billing</span>
          </div>
          <div className="flex items-center space-x-3 text-slate-300 opacity-50 hover:opacity-100 transition-opacity">
            <div className="p-1.5 bg-purple-500 rounded"><PatientIcon /></div>
            <span className="text-sm">Patient Info</span>
          </div>
          <div className="flex items-center space-x-3 text-slate-300 opacity-50 hover:opacity-100 transition-opacity">
            <div className="p-1.5 bg-blue-500 rounded"><SchedulerIcon /></div>
            <span className="text-sm">Scheduling</span>
          </div>
        </div>

        <div className="mt-auto">
          <div className="p-4 bg-slate-800 rounded-xl border border-slate-700">
            <p className="text-xs text-slate-400 mb-2">System Status</p>
            <div className="flex items-center space-x-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <span className="text-sm text-emerald-400 font-medium">Operational</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col w-full bg-[#f3f4f6]">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center p-4 bg-white shadow-sm border-b border-slate-200">
           <NavigatorIcon />
           <span className="ml-3 font-bold text-slate-800">Hospital Navigator</span>
        </div>

        {/* Chat Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 scrollbar-hide">
          <div className="max-w-4xl mx-auto space-y-2">
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <InputArea onSendMessage={handleUserMessage} disabled={isLoading} />
      </div>
    </div>
  );
};

export default App;