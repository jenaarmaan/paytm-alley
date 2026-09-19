import { MCP_TOOLS_CATALOG } from '../src/data/seedData';
import { mockLenderService } from './mockLenderService';
import {
  calculateEligibility,
  generateLoanOffer,
  generateKFS,
  calculateAmortizationSchedule,
} from '../src/services/financialEngine';

export class MCPAdapter {
  public getTools() {
    return MCP_TOOLS_CATALOG;
  }

  public async executeTool(toolName: string, args: Record<string, any>) {
    // Simulated realistic latency of 350-500ms
    await new Promise((resolve) => setTimeout(resolve, 400));

    switch (toolName) {
      case 'get_merchant_profile': {
        const merchant = mockLenderService.getMerchant(args.merchant_id || 'M001');
        if (!merchant) throw new Error(`Merchant not found: ${args.merchant_id}`);
        return { merchant };
      }

      case 'get_cashflow': {
        const cashflow = mockLenderService.getMerchantCashflow(args.merchant_id || 'M001');
        return { cashflow };
      }

      case 'get_transaction_summary': {
        const txSummary = mockLenderService.getMerchantTransactions(args.merchant_id || 'M001');
        return { transactionSummary: txSummary };
      }

      case 'analyze_merchant_context': {
        const merchant = mockLenderService.getMerchant(args.merchant_id || 'M001');
        if (!merchant) throw new Error('Merchant not found');
        return {
          merchantContext: {
            merchantId: merchant.merchantId,
            businessAgeYears: Number((merchant.businessVintageMonths / 12).toFixed(1)),
            monthlySalesVolume: merchant.monthlySales,
            surplusCashflow: merchant.monthlyCashflow,
            currentDebtBurden: merchant.existingEMI,
            creditRatingTag: merchant.repaymentHistory,
            digitalHealthScore: merchant.digitalTransactionScore,
            recommendedProduct: 'Unsecured 12-Month Micro Working Capital',
          },
        };
      }

      case 'check_loan_eligibility': {
        const merchant = mockLenderService.getMerchant(args.merchant_id || 'M001');
        if (!merchant) throw new Error('Merchant not found');
        const eligibility = calculateEligibility(merchant, args.requested_amount || 200000, args.tenure_months || 12);
        return { eligibility };
      }

      case 'calculate_loan_offer': {
        const merchant = mockLenderService.getMerchant(args.merchant_id || 'M001');
        if (!merchant) throw new Error('Merchant not found');
        const offer = generateLoanOffer(merchant, args.sanctioned_amount || 150000, args.tenure_months || 12);
        return { offer };
      }

      case 'generate_kfs': {
        const merchant = mockLenderService.getMerchant('M001')!;
        const offer = generateLoanOffer(merchant, 150000, 12);
        const kfs = generateKFS(merchant, offer);
        return { kfs };
      }

      case 'get_loan_status': {
        const app = mockLenderService.getApplication(args.application_id || 'VL-2026-00124');
        if (!app) throw new Error(`Application not found: ${args.application_id}`);
        return { application: app };
      }

      case 'get_repayment_schedule': {
        const schedule = calculateAmortizationSchedule(
          args.loan_amount || 150000,
          args.annual_rate || 18,
          args.tenure_months || 12,
          13752
        );
        return { amortizationSchedule: schedule };
      }

      case 'record_consent': {
        return {
          consentRecorded: true,
          auditHash: `SHA256:4f89b12e-${Date.now()}`,
          timestamp: new Date().toISOString(),
          consentType: args.consent_type || 'digital_signature',
        };
      }

      case 'submit_loan_application': {
        const app = mockLenderService.createApplication({
          merchantId: args.merchant_id || 'M001',
          requestedAmount: args.approved_amount || 150000,
          approvedAmount: args.approved_amount || 150000,
          purpose: args.purpose || 'Working capital',
          tenureMonths: 12,
          interestRate: 18,
          monthlyEMI: 13752,
        });
        return { application: app };
      }

      case 'initiate_disbursement': {
        const app = mockLenderService.updateApplicationStatus(args.application_id || 'VL-2026-00124', 'Disbursed');
        return {
          disbursementInitiated: true,
          utrNumber: `CMS${Date.now()}IN`,
          status: 'Processed to IMPS Network',
          updatedApplication: app,
        };
      }

      default:
        throw new Error(`Unknown MCP Tool: ${toolName}`);
    }
  }
}

export const mcpAdapter = new MCPAdapter();
