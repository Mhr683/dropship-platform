import { ProfitGuardConfig } from '../types';

export interface FinancialEvaluationParams {
  sellingPricePKR: number;
  supplierCostPKR: number;
  shippingCostPKR?: number;
  processingFeePKR?: number;
  platformFeePct?: number;
  gatewayFeePKR?: number;
  resellerCommissionPKR?: number;
  isInternational?: boolean;
}

export interface FinancialEvaluationResult {
  approved: boolean;
  reason: string;
  financials: {
    sellingPricePKR: number;
    supplierCostPKR: number;
    processingFeePKR: number;
    shippingCostPKR: number;
    platformFeePKR: number;
    gatewayFeePKR: number;
    resellerNetProfitPKR: number;
    totalDeductionsPKR: number;
    profitMarginPct: number;
  };
}

export function evaluateOrderFinancials(
  params: FinancialEvaluationParams,
  config: ProfitGuardConfig
): FinancialEvaluationResult {
  const sellingPricePKR = Math.max(0, Number(params.sellingPricePKR) || 0);
  const supplierCostPKR = Math.max(0, Number(params.supplierCostPKR) || 0);
  const processingFeePKR =
    params.processingFeePKR !== undefined ? params.processingFeePKR : (config.processingFeePKR ?? 30);
  const shippingCostPKR =
    params.shippingCostPKR !== undefined ? params.shippingCostPKR : config.defaultShippingCostPKR;
  const platformFeePct =
    params.platformFeePct !== undefined ? params.platformFeePct : (config.platformFeePct ?? 2.0);
  const platformFeePKR = Math.round(sellingPricePKR * (platformFeePct / 100));
  const gatewayFeePKR =
    params.gatewayFeePKR !== undefined ? params.gatewayFeePKR : (config.defaultGatewayFeePKR ?? 0);

  // Exact Formula requested by user:
  // Selling Price - (Real Supplier Cost + 30 Rs Processing + Delivery Fee + 2% Platform Fee)
  const totalDeductionsPKR =
    supplierCostPKR + processingFeePKR + shippingCostPKR + platformFeePKR + gatewayFeePKR;
  const resellerNetProfitPKR = sellingPricePKR - totalDeductionsPKR;
  const profitMarginPct = sellingPricePKR > 0 ? (resellerNetProfitPKR / sellingPricePKR) * 100 : 0;

  // PROFIT GUARD SAFETY CHECK
  if (resellerNetProfitPKR < 0) {
    return {
      approved: false,
      reason: `BLOCKED BY PROFIT GUARD: Reseller profit is in loss (PKR ${resellerNetProfitPKR.toLocaleString()}). Selling price (PKR ${sellingPricePKR.toLocaleString()}) does not cover Supplier Base (PKR ${supplierCostPKR.toLocaleString()}) + Rs. ${processingFeePKR} Processing + Delivery (PKR ${shippingCostPKR.toLocaleString()}) + 2% Platform Fee (PKR ${platformFeePKR.toLocaleString()}).`,
      financials: {
        sellingPricePKR,
        supplierCostPKR,
        processingFeePKR,
        shippingCostPKR,
        platformFeePKR,
        gatewayFeePKR,
        resellerNetProfitPKR,
        totalDeductionsPKR,
        profitMarginPct,
      },
    };
  }

  if (resellerNetProfitPKR < config.minProfitAmountPKR && config.enforceLock) {
    return {
      approved: false,
      reason: `WARNING / RESTRICTED: Net profit (PKR ${resellerNetProfitPKR.toLocaleString()}) is below minimum platform safety threshold of PKR ${config.minProfitAmountPKR.toLocaleString()}.`,
      financials: {
        sellingPricePKR,
        supplierCostPKR,
        processingFeePKR,
        shippingCostPKR,
        platformFeePKR,
        gatewayFeePKR,
        resellerNetProfitPKR,
        totalDeductionsPKR,
        profitMarginPct,
      },
    };
  }

  return {
    approved: true,
    reason: `APPROVED: Order profit margins are healthy (PKR ${resellerNetProfitPKR.toLocaleString()} net profit / ${profitMarginPct.toFixed(1)}% margin).`,
    financials: {
      sellingPricePKR,
      supplierCostPKR,
      processingFeePKR,
      shippingCostPKR,
      platformFeePKR,
      gatewayFeePKR,
      resellerNetProfitPKR,
      totalDeductionsPKR,
      profitMarginPct,
    },
  };
}

