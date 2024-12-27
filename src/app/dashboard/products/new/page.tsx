import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageWithBackButton } from "@/app/dashboard/_components/page-w-back-button";
import { ProductDetailsForm } from "@/app/dashboard/_forms/produc-details-form";
import { HasPermission } from "@/components/has-permission";
import { canCreateProduct } from "@/server/permissions";

export default function NewProductPage() {
    return (
        <PageWithBackButton pageTitle="Create Product" backButtonHref="/dashboard/products">
            <HasPermission
                permission={canCreateProduct}
                renderFallback
                fallbackText="You have already created the maximum number of products. Try
            upgrading your account to create more products."
            >
                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl">
                            Product Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ProductDetailsForm></ProductDetailsForm>
                    </CardContent>
                </Card>
            </HasPermission>
        </PageWithBackButton>
    )
}