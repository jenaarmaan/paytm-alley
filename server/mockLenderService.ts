import {
  Merchant,
  LoanApplication,
  ActiveLoan,
  InsuranceProduct,
  InsuranceClaim,
} from '../src/types';
import {
  SEEDED_MERCHANTS,
  SEEDED_APPLICATIONS,
  SEEDED_ACTIVE_LOAN,
  SEEDED_INSURANCE_PRODUCTS,
  SEEDED_INSURANCE_CLAIMS,
  SEEDED_MONTHLY_FINANCIALS,
  SEEDED_ADMIN_METRICS,
} from '../src/data/seedData';

class MockLenderService {
  private merchants: Map<string, Merchant> = new Map();
  private applications: Map<string, LoanApplication> = new Map();
  private activeLoans: Map<string, ActiveLoan> = new Map();
  private insuranceProducts: Map<string, InsuranceProduct> = new Map();
  private insuranceClaims: InsuranceClaim[] = [...SEEDED_INSURANCE_CLAIMS];
  private applicationCounter = 125;

  constructor() {
    // Seed initial merchants
    Object.values(SEEDED_MERCHANTS).forEach((m) => {
      this.merchants.set(m.merchantId, { ...m });
    });

    // Seed insurance products
    SEEDED_INSURANCE_PRODUCTS.forEach((p) => {
      this.insuranceProducts.set(p.id, { ...p });
    });

    // Seed initial applications
    SEEDED_APPLICATIONS.forEach((app) => {
      this.applications.set(app.applicationId, { ...app });
    });

    // Seed active loans
    this.activeLoans.set(SEEDED_ACTIVE_LOAN.merchantId, { ...SEEDED_ACTIVE_LOAN });
  }

  public registerMerchant(merchant: Merchant): Merchant {
    this.merchants.set(merchant.merchantId, { ...merchant });
    return merchant;
  }

  public getMerchant(merchantId: string): Merchant | null {
    return this.merchants.get(merchantId) || null;
  }

  public getAllMerchants(): Merchant[] {
    return Array.from(this.merchants.values());
  }

  public getMerchantCashflow(merchantId: string) {
    const merchant = this.getMerchant(merchantId);
    if (!merchant) return null;

    return {
      merchantId,
      monthlySales: merchant.monthlySales,
      monthlyCashflow: merchant.monthlyCashflow,
      existingEMI: merchant.existingEMI,
      monthlyTrends: SEEDED_MONTHLY_FINANCIALS,
      averageDailyUpiInflow: Math.round(merchant.monthlySales / 30),
      highestSalesDayOfWeek: 'Saturday',
      debtToIncomeRatio: Number(((merchant.existingEMI / merchant.monthlyCashflow) * 100).toFixed(1)),
    };
  }

  public getMerchantTransactions(merchantId: string) {
    return {
      merchantId,
      totalVolumePast30Days: 420,
      upiQrVolume: 380,
      posCardVolume: 40,
      settlementSuccessRate: '99.4%',
      frequentDistributors: [
        { name: 'Hindustan Unilever Distributor', volume: '₹42,000/mo', status: 'Timely' },
        { name: 'ITC FMCG Supply Hub', volume: '₹34,500/mo', status: 'Timely' },
        { name: 'Nandini Dairy Cooperative', volume: '₹18,200/mo', status: 'Timely' },
      ],
    };
  }

  public getAllApplications(): LoanApplication[] {
    return Array.from(this.applications.values()).sort((a, b) => {
      return b.applicationId.localeCompare(a.applicationId);
    });
  }

  public getApplication(applicationId: string): LoanApplication | null {
    return this.applications.get(applicationId) || null;
  }

  public createApplication(data: {
    merchantId: string;
    requestedAmount: number;
    approvedAmount: number;
    purpose: string;
    tenureMonths: number;
    interestRate: number;
    monthlyEMI: number;
  }): LoanApplication {
    const merchant = this.getMerchant(data.merchantId) || {
      name: 'Ramesh Kumar',
      businessName: 'Ramesh General Stores',
    };

    const newId = `VL-2026-00${this.applicationCounter++}`;
    const timestamp = 'Just now';
    const nowFormatted = new Date().toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const newApp: LoanApplication = {
      applicationId: newId,
      merchantId: data.merchantId,
      merchantName: merchant.name,
      businessName: merchant.businessName,
      requestedAmount: data.requestedAmount,
      approvedAmount: data.approvedAmount,
      purpose: data.purpose,
      tenureMonths: data.tenureMonths,
      interestRate: data.interestRate,
      monthlyEMI: data.monthlyEMI,
      status: 'Submitted',
      timestamp,
      kfsAcknowledged: true,
      consentTimestamp: nowFormatted,
      timeline: [
        {
          title: 'Voice Request Captured',
          description: 'Merchant intent converted to structured record',
          timestamp: 'Step 1 • Completed',
          completed: true,
          current: false,
        },
        {
          title: 'Financial Underwriting',
          description: `Deterministic verification passed (Headroom: ₹${data.approvedAmount.toLocaleString('en-IN')})`,
          timestamp: 'Step 2 • Completed',
          completed: true,
          current: false,
        },
        {
          title: 'Consent & Voice KFS Signed',
          description: 'Explicit merchant consent logged cryptographically',
          timestamp: 'Step 3 • Completed',
          completed: true,
          current: false,
        },
        {
          title: 'Lender Verification',
          description: 'Automated policy rule validation in progress',
          timestamp: 'Under review',
          completed: false,
          current: true,
        },
        {
          title: 'Direct Bank Disbursement',
          description: 'Instant transfer via IMPS/e-NACH',
          timestamp: 'Pending verification',
          completed: false,
          current: false,
        },
      ],
    };

    this.applications.set(newId, newApp);
    return newApp;
  }

  public updateApplicationStatus(
    applicationId: string,
    status: LoanApplication['status'],
    reviewerNote?: string
  ): LoanApplication | null {
    const app = this.applications.get(applicationId);
    if (!app) return null;

    app.status = status;

    if (status === 'Approved') {
      app.timeline[3].completed = true;
      app.timeline[3].current = false;
      app.timeline[4].current = true;
    } else if (status === 'Disbursed') {
      app.timeline[3].completed = true;
      app.timeline[4].completed = true;
      app.timeline[4].current = false;

      // Create or update ActiveLoan facility for this merchant
      const dailyDeduction = Math.round(app.monthlyEMI / 30);
      const merchant = this.getMerchant(app.merchantId);
      const dailySales = Math.max(1000, Math.round((merchant?.monthlySales || 120000) / 30));
      const qrSplit = Math.min(15, Math.max(5, Math.round((dailyDeduction / dailySales) * 100)));

      const activeLoan: ActiveLoan = {
        loanId: `LN-2026-${app.applicationId.replace('VL-2026-', '')}`,
        merchantId: app.merchantId,
        sanctionedAmount: app.approvedAmount,
        outstandingPrincipal: app.approvedAmount,
        tenureMonths: app.tenureMonths,
        monthlyEMI: app.monthlyEMI,
        annualInterestRate: app.interestRate,
        disbursalDate: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        nextDueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        paidInstallmentsCount: 0,
        totalInstallmentsCount: app.tenureMonths,
        status: 'Active',
        lenderName: 'Samriddhi Microfinance Bank Ltd',
        repaymentMode: 'Daily Auto-Split',
        dailyQrSplitPercent: qrSplit,
        dailyDeductionAmount: dailyDeduction,
        dailySettlementHistory: [
          { date: 'Today (Live)', totalQrVolume: dailySales, autoSplitDeducted: dailyDeduction, netMerchantPayout: dailySales - dailyDeduction, status: 'Settled' },
        ],
        repaymentSchedule: Array.from({ length: app.tenureMonths }, (_, i) => ({
          installmentNo: i + 1,
          dueDate: new Date(Date.now() + (i + 1) * 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
          emiAmount: app.monthlyEMI,
          status: 'Upcoming' as const,
        })),
      };

      this.activeLoans.set(app.merchantId, activeLoan);
    }

    this.applications.set(applicationId, app);
    return app;
  }

  public getActiveLoan(merchantId: string): ActiveLoan | null {
    return this.activeLoans.get(merchantId) || null;
  }

  public getInsuranceProducts(): InsuranceProduct[] {
    return Array.from(this.insuranceProducts.values());
  }

  public toggleInsuranceEnrollment(productId: string, enrolled: boolean): InsuranceProduct | null {
    const product = this.insuranceProducts.get(productId);
    if (!product) return null;
    product.enrolled = enrolled;
    this.insuranceProducts.set(productId, product);
    return product;
  }

  public getInsuranceClaims(): InsuranceClaim[] {
    return this.insuranceClaims;
  }

  public fileInsuranceClaim(data: {
    productId: string;
    productName: string;
    amount: number;
    description: string;
    incidentDate: string;
    claimCategory: InsuranceClaim['claimCategory'];
  }): InsuranceClaim {
    const newClaim: InsuranceClaim = {
      claimId: `CLM-2026-09${Math.floor(10 + Math.random() * 89)}`,
      productId: data.productId,
      productName: data.productName,
      amount: data.amount,
      status: 'Document Verification',
      dateFiled: 'Today (Live)',
      incidentDate: data.incidentDate || 'Recent',
      description: data.description,
      payoutEta: 'Instant advance ₹25,000 queued for IMPS',
      claimCategory: data.claimCategory || 'Fire/Theft',
    };
    this.insuranceClaims.unshift(newClaim);
    return newClaim;
  }

  public getAdminMetrics() {
    const allApps = this.getAllApplications();
    const approved = allApps.filter((a) => a.status === 'Approved' || a.status === 'Disbursed').length;
    const underReview = allApps.filter((a) => a.status === 'Submitted' || a.status === 'Lender Review').length;

    return {
      ...SEEDED_ADMIN_METRICS,
      totalApplications: allApps.length,
      underReview,
      approvedCount: approved,
    };
  }
}

export const mockLenderService = new MockLenderService();
