import React, { useState, KeyboardEvent } from 'react';

interface InputAreaProps {
  onSendMessage: (text: string) => void;
  disabled: boolean;
}

const InputArea: React.FC<InputAreaProps> = ({ onSendMessage, disabled }) => {
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim() && !disabled) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="bg-white border-t border-slate-200 p-4 pb-6">
      <div className="max-w-4xl mx-auto flex items-center space-x-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={disabled ? "Processing request..." : "Type your request here (e.g., 'I need to schedule an MRI', 'Show my blood test')"}
          disabled={disabled}
          className="flex-1 bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-xl focus:ring-indigo-500 focus:border-indigo-500 block w-full p-4 disabled:opacity-50 transition-all shadow-sm"
        />
        <button
          onClick={handleSend}
          disabled={disabled || !input.trim()}
          className={`p-4 rounded-xl text-white shadow-md transition-all flex items-center justify-center
            ${disabled || !input.trim() 
              ? 'bg-slate-300 cursor-not-allowed' 
              : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg active:scale-95'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" x2="11" y1="2" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default InputArea;