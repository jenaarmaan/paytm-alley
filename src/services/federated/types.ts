export type ModelWeights = Record<string, number[]>;

export interface ClientNode {
  clientId: string;
  merchantName: string;
  businessType: string;
  location: string;
  localSampleCount: number;
  status: 'Idle' | 'Training' | 'Gradients Clipped & Noised' | 'Transmitting' | 'Synchronized';
  lastLoss: number;
  noiseScale: number;
  uploadedBytes: number; // strictly weights/deltas, 0 raw PII
  isAdversarial?: boolean;
}

export interface GradientUpdate {
  updateId: string;
  clientId: string;
  merchantName: string;
  roundNumber: number;
  sampleSize: number;
  clippedGradients: ModelWeights;
  epsilonBudget: number;
  noiseVariance: number;
  l2Norm: number;
  rawPiiExclusionProof: string;
  timestamp: string;
}

export interface FederatedRoundState {
  roundId: string;
  roundNumber: number;
  status: 'Sampling' | 'Local Training' | 'Secure Aggregation' | 'Global Model Updated';
  participatingNodes: ClientNode[];
  globalLoss: number;
  accuracy: number;
  epsilonSpent: number;
  delta: number;
  globalWeights: ModelWeights;
  timestamp: string;
}

export interface SecurityAuditLog {
  auditId: string;
  timestamp: string;
  event: 
    | 'LOCAL_DATA_ISOLATED'
    | 'DP_NOISE_INJECTED'
    | 'GRADIENT_CLIPPED'
    | 'FEDAVG_COMPLETED'
    | 'ATTACK_NEUTRALIZED'
    | 'DPDP_COMPLIANCE_VERIFIED';
  severity: 'INFO' | 'SUCCESS' | 'WARNING';
  proofSummary: string;
  passed: boolean;
  metadata?: Record<string, string | number>;
}

export interface AttackSimulationResult {
  attackType: 'MEMBERSHIP_INFERENCE' | 'MODEL_POISONING' | 'MITM_PACKET_SNIFFING';
  attackName: string;
  description: string;
  defenseMechanism: string;
  status: 'NEUTRALIZED' | 'BLOCKED' | 'PREVENTED';
  details: string;
  evidenceProof: string;
}
