import { Merchant, SupportedLanguage } from '../types';
import { SEEDED_MERCHANTS } from '../data/seedData';
import { apiClient } from './apiClient';

const STORAGE_KEYS = {
  SESSION: 'voicelend_active_session',
  MERCHANTS: 'voicelend_merchants_database',
  APPLICATIONS: 'voicelend_merchant_applications',
};

export interface AuthSession {
  isAuthenticated: boolean;
  merchantId: string;
  loginTimestamp: string;
  authMethod: 'quick_demo' | 'mobile_otp' | 'registration';
  mobileNumber?: string;
}

class AuthService {
  /**
   * Initializes merchants database from localStorage or seeds defaults
   */
  public getMerchants(): Record<string, Merchant> {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.MERCHANTS);
      const merged: Record<string, Merchant> = { ...SEEDED_MERCHANTS };
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === 'object') {
          for (const [key, val] of Object.entries(parsed)) {
            if (val && typeof val === 'object') {
              const defaultM = SEEDED_MERCHANTS[key] || SEEDED_MERCHANTS['M001'];
              const castVal = val as Partial<Merchant>;
              merged[key] = {
                ...defaultM,
                ...castVal,
                merchantId: key,
                name: castVal.name || defaultM.name || 'Merchant User',
                businessName: castVal.businessName || defaultM.businessName || 'Enterprise',
                businessType: castVal.businessType || defaultM.businessType || 'Retail & Kirana',
                monthlySales: Number(castVal.monthlySales ?? defaultM.monthlySales ?? 150000),
                monthlyCashflow: Number(castVal.monthlyCashflow ?? defaultM.monthlyCashflow ?? 70000),
                existingEMI: Number(castVal.existingEMI ?? defaultM.existingEMI ?? 0),
                businessVintageMonths: Number(castVal.businessVintageMonths ?? defaultM.businessVintageMonths ?? 36),
                digitalTransactionScore: Number(castVal.digitalTransactionScore ?? defaultM.digitalTransactionScore ?? 85),
                location: castVal.location || defaultM.location || 'India',
                preferredLanguage: castVal.preferredLanguage || defaultM.preferredLanguage || 'Hinglish',
                tradeSector: castVal.tradeSector || defaultM.tradeSector || 'Retail & Kirana',
                role: castVal.role || (key.startsWith('L') ? 'lender' : 'merchant'),
              };
            }
          }
        }
      }
      return merged;
    } catch (e) {
      console.warn('Error reading merchants from localStorage:', e);
    }
    // Default seed initialization
    this.saveMerchants(SEEDED_MERCHANTS);
    return SEEDED_MERCHANTS;
  }

  /**
   * Persists updated merchants database to localStorage
   */
  public saveMerchants(merchants: Record<string, Merchant>): void {
    try {
      localStorage.setItem(STORAGE_KEYS.MERCHANTS, JSON.stringify(merchants));
    } catch (e) {
      console.error('Error saving merchants to localStorage:', e);
    }
  }

  /**
   * Retrieves currently active session from localStorage
   */
  public getActiveSession(): AuthSession | null {
    try {
      const sessionStr = localStorage.getItem(STORAGE_KEYS.SESSION);
      if (sessionStr) {
        return JSON.parse(sessionStr);
      }
    } catch (e) {
      console.warn('Error reading session from localStorage:', e);
    }
    return null;
  }

  /**
   * Saves active authenticated session
   */
  public saveSession(session: AuthSession): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
    } catch (e) {
      console.error('Error saving session:', e);
    }
  }

  /**
   * Logs in a merchant by Merchant ID
   */
  public login(merchantId: string, authMethod: AuthSession['authMethod'] = 'quick_demo'): Merchant {
    const merchants = this.getMerchants();
    const merchant = merchants[merchantId] || SEEDED_MERCHANTS['M001'];

    const session: AuthSession = {
      isAuthenticated: true,
      merchantId: merchant.merchantId,
      loginTimestamp: new Date().toISOString(),
      authMethod,
    };
    this.saveSession(session);
    return merchant;
  }

  /**
   * Mobile + OTP Login simulation for Indian micro-merchants
   */
  public loginWithMobile(mobileNumber: string, otp: string): Merchant {
    const merchants = this.getMerchants();
    const cleanNumber = mobileNumber.replace(/\D/g, '');

    // Check if an existing merchant matches mobile or map deterministically
    const merchantList = Object.values(merchants);
    const existing = merchantList.find((m) => m.merchantId.endsWith(cleanNumber.slice(-3)));

    if (existing) {
      this.login(existing.merchantId, 'mobile_otp');
      return existing;
    }

    // Default to first merchant or create mobile-bound session
    const target = merchantList[0] || SEEDED_MERCHANTS['M001'];
    const session: AuthSession = {
      isAuthenticated: true,
      merchantId: target.merchantId,
      loginTimestamp: new Date().toISOString(),
      authMethod: 'mobile_otp',
      mobileNumber: cleanNumber,
    };
    this.saveSession(session);
    return target;
  }

  /**
   * Registers / Onboards a new merchant and immediately activates session
   */
  public registerMerchant(data: Partial<Merchant>): Merchant {
    const merchants = this.getMerchants();
    const newId = `M${String(Object.keys(merchants).length + 1).padStart(3, '0')}`;
    const monthlyTurnover = data.monthlySales || 150000;
    const vintage = data.businessVintageMonths || 36;
    const existingDebt = data.existingEMI || 0;

    // Deterministic Account Aggregator Digital Score (60 - 98)
    const baseScore = 70;
    const vintageBonus = Math.min(15, Math.round(vintage / 4));
    const debtRatio = existingDebt / monthlyTurnover;
    const debtPenalty = debtRatio > 0.25 ? 12 : debtRatio > 0.15 ? 5 : 0;
    const digitalScore = Math.min(98, Math.max(60, baseScore + vintageBonus - debtPenalty));

    const newMerchant: Merchant = {
      merchantId: newId,
      name: data.name || 'New Merchant',
      businessName: data.businessName || `${data.name || 'Merchant'} Enterprise`,
      businessType: data.businessType || data.tradeSector || 'Retail & Kirana',
      businessVintageMonths: vintage,
      monthlySales: monthlyTurnover,
      monthlyCashflow: Math.round(monthlyTurnover * 0.45),
      existingEMI: existingDebt,
      repaymentHistory: data.repaymentHistory || 'good',
      digitalTransactionScore: digitalScore,
      businessHealth: digitalScore >= 80 ? 'healthy' : digitalScore >= 70 ? 'moderate' : 'caution',
      location: data.location || 'India',
      preferredLanguage: data.preferredLanguage || 'Hinglish',
      upiQrTransactionsPerMonth: Math.round(monthlyTurnover / 450),
      activeCreditLines: existingDebt > 0 ? 1 : 0,
      upiHandle: `${(data.name || 'merchant').toLowerCase().replace(/\s+/g, '')}@paytm`,
      tradeSector: data.tradeSector || data.businessType || 'Retail Merchant',
    };

    merchants[newId] = newMerchant;
    this.saveMerchants(merchants);

    // Sync to backend server
    apiClient.registerMerchant(newMerchant).catch(() => {});

    // Immediately log in new merchant
    this.login(newId, 'registration');
    return newMerchant;
  }

  /**
   * Logs out the merchant and clears session
   */
  public logout(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.SESSION);
    } catch (e) {
      console.warn('Error clearing session:', e);
    }
  }

  /**
   * Check if user is currently authenticated
   */
  public isAuthenticated(): boolean {
    const session = this.getActiveSession();
    return Boolean(session && session.isAuthenticated);
  }
}

export const authService = new AuthService();
