import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatCompactNumber } from "@/lib/formatters";
import { getProductCount } from "@/server/db/products";
import { getProductViewCount } from "@/server/db/productViews";
import { getUserSubscriptionTier } from "@/server/db/subscriptions";
import { auth } from "@clerk/nextjs/server";
import { startOfMonth } from "date-fns"

export default async function SubscriptionPage() {

    const { userId, redirectToSignIn } = await auth()

    if (userId === null) {
        redirectToSignIn()
    }

    const tier = await getUserSubscriptionTier(userId!)
    const productCount = await getProductCount(userId!)
    const pricingViewCount = await getProductViewCount({ userId: userId!, startDate: startOfMonth(new Date()) })

    return (
        <>
            <h1 className="mb-6 text-3xl font-semibold">Your Subscription</h1>
            <div className="flex flex-col gap-8 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Monthly Usage</CardTitle>
                            <CardDescription>
                                {formatCompactNumber(pricingViewCount)} /{""} {formatCompactNumber(tier.maxNumberOfVisits)} pricing page visit this month
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Progress value={(pricingViewCount / tier.maxNumberOfVisits) * 100}></Progress>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
