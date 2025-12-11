import { GoogleGenAI, FunctionDeclaration, Type, Tool } from "@google/genai";
import { AgentType, ToolCallResult } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// --- 1. Tool Definitions (The Sub-Agents) ---

const medicalRecordsTool: FunctionDeclaration = {
  name: AgentType.MEDICAL_RECORDS,
  description: "Retrieves and provides access to patient medical records, test results, diagnoses, and health history.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      medical_records_request: {
        type: Type.STRING,
        description: "The specific request for medical records or health history.",
      },
    },
    required: ["medical_records_request"],
  },
};

const billingTool: FunctionDeclaration = {
  name: AgentType.BILLING,
  description: "Addresses patient billing inquiries, insurance coverage questions, and payment options.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      billing_and_insurance_query: {
        type: Type.STRING,
        description: "The inquiry regarding billing, insurance, or finance.",
      },
    },
    required: ["billing_and_insurance_query"],
  },
};

const patientInfoTool: FunctionDeclaration = {
  name: AgentType.PATIENT_INFO,
  description: "Manages patient registration, updates personal details, and retrieves general patient information.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      patient_details_request: {
        type: Type.STRING,
        description: "Request to update or retrieve patient demographics/details.",
      },
    },
    required: ["patient_details_request"],
  },
};

const schedulerTool: FunctionDeclaration = {
  name: AgentType.SCHEDULER,
  description: "Schedules, reschedules, and cancels patient appointments with doctors or departments.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      appointment_logistics_query: {
        type: Type.STRING,
        description: "Details about the appointment to be scheduled/changed.",
      },
    },
    required: ["appointment_logistics_query"],
  },
};

// --- 2. System Prompts ---

const NAVIGATOR_SYSTEM_PROMPT = `
You are a Hospital System Navigator. 
Your SOLE responsibility is to analyze the user's request and delegate it to the correct specialist agent using the provided tools.
- Medical Records Agent: For records, results, history.
- Billing And Insurance Agent: For invoices, costs, insurance.
- Patient Information Agent: For registration, personal details.
- Appointment Scheduler: For booking or changing appointments.

DO NOT answer the user directly. ALWAYS call the appropriate function.
`;

const AGENT_PROMPTS: Record<string, string> = {
  [AgentType.MEDICAL_RECORDS]: `You are the Medical Records Agent. 
  You handle requests for medical records, test results, and health history.
  Ensure confidentiality. Present data in a structured, professional medical format.
  Simulate the retrieval of data. If the user asks for a specific test result (e.g., Blood Test), invent plausible data for a demo context.`,
  
  [AgentType.BILLING]: `You are the Billing and Insurance Agent.
  You explain invoices, clarify insurance benefits, and discuss payment plans.
  Be empathetic but clear about financial obligations.`,
  
  [AgentType.PATIENT_INFO]: `You are the Patient Information Agent.
  You handle registration and updates to personal details. 
  Confirm updates clearly. If a form is needed, mention that you are generating the necessary documents.`,
  
  [AgentType.SCHEDULER]: `You are the Appointment Scheduler.
  You manage booking logistics. 
  Always confirm the final status: Scheduled, Rescheduled, or Cancelled.
  Ask for clarification if the date or doctor is missing.`
};

// --- 3. Service Functions ---

/**
 * Step 1: The Navigator (Router)
 * Analyzes input and selects a tool (Agent).
 */
export const routeUserRequest = async (userMessage: string): Promise<ToolCallResult | null> => {
  try {
    const tools: Tool[] = [{
        functionDeclarations: [medicalRecordsTool, billingTool, patientInfoTool, schedulerTool]
    }];

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: userMessage,
      config: {
        systemInstruction: NAVIGATOR_SYSTEM_PROMPT,
        tools: tools,
        temperature: 0.1, // Low temperature for precise routing
      },
    });

    // Extract function call
    const functionCalls = response.candidates?.[0]?.content?.parts?.[0]?.functionCall;
    
    if (functionCalls) {
      return {
        toolName: functionCalls.name,
        args: functionCalls.args
      };
    }

    // Fallback if no tool was called (shouldn't happen with strict prompt)
    return null;

  } catch (error) {
    console.error("Routing error:", error);
    throw error;
  }
};

/**
 * Step 2: The Specialist (Sub-Agent)
 * Executes the task with the specific persona.
 */
export const executeAgentResponse = async (agentType: string, contextString: string): Promise<string> => {
  try {
    const systemInstruction = AGENT_PROMPTS[agentType] || "You are a helpful hospital assistant.";

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", // Can upgrade to gemini-3-pro-preview for complex reasoning
      contents: `Context/Request: ${contextString}`,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7, // Slightly higher for natural conversation
      },
    });

    return response.text || "I apologize, I could not generate a response.";
  } catch (error) {
    console.error("Agent execution error:", error);
    return "System Error: The specialist agent is currently unavailable.";
  }
};