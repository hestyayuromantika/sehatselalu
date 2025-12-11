export enum AgentType {
  NAVIGATOR = 'NAVIGATOR',
  MEDICAL_RECORDS = 'MedicalRecordsAgent',
  BILLING = 'BillingAndInsuranceAgent',
  PATIENT_INFO = 'PatientInformationAgent',
  SCHEDULER = 'AppointmentScheduler'
}

export enum Sender {
  USER = 'USER',
  SYSTEM = 'SYSTEM', // For status updates
  AGENT = 'AGENT'
}

export interface Message {
  id: string;
  sender: Sender;
  agentType?: AgentType; // If sender is AGENT
  content: string;
  timestamp: Date;
  isThinking?: boolean;
}

export interface ToolCallResult {
  toolName: string;
  args: any;
}