import { getUserSubscriptionTier } from "@/server/db/subscriptions"
import { getProductCount } from "@/server/db/products"

export async function canRemoveBranding(userId: string) {
    if (userId == null) return false
    const tier = await getUserSubscriptionTier(userId)
    return tier.canCustomizeBanner
}

export async function canCustomizeBanner(userId: string | null) {
    if (userId == null) return false
    const tier = await getUserSubscriptionTier(userId)
    return tier.canCustomizeBanner
}

export async function canAccessAnalytics(userId: string | null) {
    if (userId == null) return false
    const tier = await getUserSubscriptionTier(userId)
    return tier.canAccessAnalytics
}

export async function canCreateProduct(userId: string | null) {
    if (userId == null) return false
    const tier = await getUserSubscriptionTier(userId)
    const productCount = await getProductCount(userId)
    return productCount < tier.maxNumberOfProducts
}
