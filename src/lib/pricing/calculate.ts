/**
 * Cálculo dinámico de precio del personalizador.
 * ------------------------------------------------------------
 * Documento de contexto: sección 6.6
 *
 * Fórmula:
 *   total = precio_prenda
 *         + (price_per_custom_design * N_designs)
 *         + (premium extras de cada design_asset)
 *         + (price_user_upload si hay uploads propios)
 *         + basePrice
 */

import type { DesignPlacement, PricingSetting } from '@/types';

export interface PricingInput {
  basePrice: number;
  placement: DesignPlacement;
  /** Asset IDs de la librería → lookup de extra_price */
  assetPriceLookup: Record<string, { extraPrice: number; isPremium: boolean }>;
  settings: Pick<PricingSetting, 'key' | 'value'>[];
}

export interface PricingBreakdown {
  basePrice: number;
  designsCount: number;
  customDesignsCost: number;
  premiumExtrasCost: number;
  userUploadsCost: number;
  total: number;
}

export function calculateCustomPrice(input: PricingInput): PricingBreakdown {
  const settingsRecord = Object.fromEntries(
    input.settings.map((s) => [s.key, s.value])
  );

  const pricePerDesign = settingsRecord['price_per_custom_design'] ?? 0;
  const priceUserUpload = settingsRecord['price_user_upload'] ?? 0;

  let premiumExtrasCost = 0;
  let userUploadsCount = 0;

  for (const el of input.placement.elements) {
    if (el.assetId === 'user-upload') {
      userUploadsCount += 1;
      continue;
    }
    const asset = input.assetPriceLookup[el.assetId];
    if (asset?.isPremium) {
      premiumExtrasCost += asset.extraPrice;
    }
  }

  const designsCount = input.placement.elements.length;
  const customDesignsCost = designsCount * pricePerDesign;
  const userUploadsCost = userUploadsCount * priceUserUpload;

  const total =
    input.basePrice + customDesignsCost + premiumExtrasCost + userUploadsCost;

  return {
    basePrice: input.basePrice,
    designsCount,
    customDesignsCost,
    premiumExtrasCost,
    userUploadsCost,
    total,
  };
}
