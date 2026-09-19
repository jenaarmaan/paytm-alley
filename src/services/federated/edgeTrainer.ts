import { ModelWeights, GradientUpdate, ClientNode } from './types';
import { applyDifferentialPrivacyToWeights, verifyZeroPII } from './privacyEngine';

/**
 * Initializes standard baseline global credit underwriting weights.
 */
export function getInitialGlobalWeights(): ModelWeights {
  return {
    'layer_cashflow_dense': [0.42, -0.18, 0.65, 0.31, -0.09, 0.54],
    'layer_vintage_bias': [0.12, 0.28, -0.05],
    'layer_qr_velocity_weights': [0.71, 0.44, -0.22, 0.63],
    'layer_repayment_risk_head': [0.88, -0.62, 0.15],
  };
}

/**
 * Simulates local on-device training on edge client devices (e.g. Kirana store POS / mobile).
 * Raw financial data stays on-device (0 Bytes transmitted). Only noise-injected gradients leave.
 */
export function trainEdgeClient(
  node: ClientNode,
  globalWeights: ModelWeights,
  roundNumber: number,
  epochs: number = 3,
  learningRate: number = 0.05
): {
  updatedNode: ClientNode;
  gradientUpdate: GradientUpdate;
} {
  // 1. Simulate on-device local gradient descent
  // Delta weights computed from local feature variance
  const localGradients: ModelWeights = {};
  let simulatedLoss = 0.45;

  for (const [layerName, tensor] of Object.entries(globalWeights)) {
    localGradients[layerName] = tensor.map((w, idx) => {
      // Local gradient step with node-specific behavioral bias (e.g. high QR frequency or seasonal swings)
      const localGradient = (Math.sin(idx + node.localSampleCount) * 0.04) + (Math.random() * 0.02 - 0.01);
      // Simulate adversarial node if marked
      if (node.isAdversarial) {
        return Number((localGradient * 8.5).toFixed(6)); // Extreme outlier poisoning attempt
      }
      return Number((localGradient).toFixed(6));
    });
  }

  // 2. Compute local loss reduction
  simulatedLoss = Math.max(0.08, Number((0.45 - (epochs * 0.04) + (Math.random() * 0.02)).toFixed(4)));

  // 3. Apply Differential Privacy (L2 clipping + Gaussian noise)
  const epsilon = 0.8;
  const delta = 1e-5;
  const maxNorm = 1.0;
  const { sanitizedWeights, averageNorm, noiseStdDev } = applyDifferentialPrivacyToWeights(
    localGradients,
    maxNorm,
    epsilon,
    delta
  );

  // 4. Verify Zero PII leakage
  const zkpCheck = verifyZeroPII({
    clientId: node.clientId,
    roundNumber,
    weights: sanitizedWeights,
  });

  const gradientUpdate: GradientUpdate = {
    updateId: `GRD-${node.clientId}-R${roundNumber}`,
    clientId: node.clientId,
    merchantName: node.merchantName,
    roundNumber,
    sampleSize: node.localSampleCount,
    clippedGradients: sanitizedWeights,
    epsilonBudget: epsilon,
    noiseVariance: Number((noiseStdDev * noiseStdDev).toFixed(4)),
    l2Norm: Number(averageNorm.toFixed(4)),
    rawPiiExclusionProof: zkpCheck.proofHash,
    timestamp: new Date().toLocaleTimeString('en-IN'),
  };

  const updatedNode: ClientNode = {
    ...node,
    status: 'Gradients Clipped & Noised',
    lastLoss: simulatedLoss,
    noiseScale: Number(noiseStdDev.toFixed(3)),
    uploadedBytes: JSON.stringify(sanitizedWeights).length, // Only serialized weight tensor bytes (~240 bytes)
  };

  return { updatedNode, gradientUpdate };
}
