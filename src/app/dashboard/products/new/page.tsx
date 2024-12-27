import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageWithBackButton } from "@/app/dashboard/_components/page-w-back-button";
import { ProductDetailsForm } from "@/app/dashboard/_forms/produc-details-form";

export default function NewProductPage() {
    return (
        <PageWithBackButton pageTitle="Create Product" backButtonHref="/dashboard/products">
            <HasPermission
            permissions={canCreatePRoduct}
            >
            </HasPermission>
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
        </PageWithBackButton>
    )
}