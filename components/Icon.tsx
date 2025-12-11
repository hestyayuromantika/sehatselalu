import React from 'react';
import { AgentType } from '../types';

export const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

export const NavigatorIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
    <circle cx="12" cy="12" r="10"></circle>
    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
  </svg>
);

export const MedicalIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
    <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
  </svg>
);

export const BillingIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
    <rect width="20" height="14" x="2" y="5" rx="2"></rect>
    <line x1="2" x2="22" y1="10" y2="10"></line>
  </svg>
);

export const PatientIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <line x1="19" x2="19" y1="8" y2="14"></line>
    <line x1="22" x2="16" y1="11" y2="11"></line>
  </svg>
);

export const SchedulerIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect>
    <line x1="16" x2="16" y1="2" y2="6"></line>
    <line x1="8" x2="8" y1="2" y2="6"></line>
    <line x1="3" x2="21" y1="10" y2="10"></line>
  </svg>
);

export const getAgentIcon = (type?: AgentType) => {
  switch (type) {
    case AgentType.MEDICAL_RECORDS: return <MedicalIcon />;
    case AgentType.BILLING: return <BillingIcon />;
    case AgentType.PATIENT_INFO: return <PatientIcon />;
    case AgentType.SCHEDULER: return <SchedulerIcon />;
    default: return <NavigatorIcon />;
  }
};

export const getAgentColor = (type?: AgentType) => {
  switch (type) {
    case AgentType.MEDICAL_RECORDS: return 'bg-red-500';
    case AgentType.BILLING: return 'bg-green-500';
    case AgentType.PATIENT_INFO: return 'bg-purple-500';
    case AgentType.SCHEDULER: return 'bg-blue-500';
    default: return 'bg-slate-600';
  }
};

export const getAgentName = (type?: AgentType) => {
    switch (type) {
      case AgentType.MEDICAL_RECORDS: return 'Medical Records';
      case AgentType.BILLING: return 'Billing & Insurance';
      case AgentType.PATIENT_INFO: return 'Patient Services';
      case AgentType.SCHEDULER: return 'Scheduling';
      default: return 'Navigator';
    }
  };