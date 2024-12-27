import { getProduct, getProductCountryGroups, getProductCustomization } from "@/server/db/products"
import { auth } from "@clerk/nextjs/server"
import { notFound } from "next/navigation"
import { PageWithBackButton } from "@/app/dashboard/_components/page-w-back-button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ProductDetailsForm } from "@/app/dashboard/_forms/produc-details-form"
import { CountryDiscountsForm } from "@/app/dashboard/_forms/country-discount-form"
import { ProductCustomizationForm } from "@/app/dashboard/_forms/product-customization-form"
import { canCustomizeBanner, canRemoveBranding } from "@/server/permissions"

export default async function EditProductPage({
    params,
    searchParams
}: {
    params: Promise<{ productId: string }>,
    searchParams: Promise<{ tab?: string }>
}) {
    const { productId } = await params
    const tab = ((await searchParams).tab) ?? "details"
    const { userId, redirectToSignIn } = await auth()
    if (userId == null) {
        return redirectToSignIn()
    }
    const product = await getProduct({ id: productId, userId: userId })
    if (product == null) {
        return notFound()
    }
    return (
        <PageWithBackButton backButtonHref="/dashboard/products" pageTitle="Edit Product">
            <Tabs defaultValue={tab}>
                <TabsList className="bg-background/60">
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="country">Country</TabsTrigger>
                    <TabsTrigger value="customization">Customization</TabsTrigger>
                </TabsList>
                <TabsContent value="details">
                    <DetailsTab product={product}></DetailsTab>
                </TabsContent>
                <TabsContent value="country">
                    <CountryTab productId={product.id} userId={userId}></CountryTab>
                </TabsContent>
                <TabsContent value="customization">
                    <CustomizationsTab productId={productId} userId={userId}></CustomizationsTab>
                </TabsContent>
            </Tabs>
        </PageWithBackButton>
    )
}

function DetailsTab({
    product,
}: {
    product: {
        id: string
        name: string
        description: string | null
        url: string
    }
}) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-xl">Product Details</CardTitle>
            </CardHeader>
            <CardContent>
                <ProductDetailsForm product={product} />
            </CardContent>
        </Card>
    )
}

async function CountryTab({
    productId,
    userId,
}: {
    productId: string
    userId: string
}) {
    const countryGroups = await getProductCountryGroups({
        productId,
        userId,
    })

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-xl">Country Discounts</CardTitle>
                <CardDescription>
                    Leave the discount field blank if you do not want to display deals for
                    any specific parity group.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <CountryDiscountsForm
                    productId={productId}
                    countryGroups={countryGroups}
                ></CountryDiscountsForm>
            </CardContent>
        </Card>
    )
}

async function CustomizationsTab({
    productId,
    userId,
}: {
    productId: string
    userId: string
}) {
    const customization = await getProductCustomization({ productId, userId })

    if (customization == null) return notFound()

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-xl">Banner Customization</CardTitle>
            </CardHeader>
            <CardContent>
                <ProductCustomizationForm
                    canRemoveBranding={await canRemoveBranding(userId)}
                    canCustomizeBanner={await canCustomizeBanner(userId)}
                    customization={customization}
                />
            </CardContent>
        </Card>
    )
}
