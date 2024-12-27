import { getProducts } from "@/server/db/products";
import { auth } from "@clerk/nextjs/server";
import { NoProducts } from "@/app/dashboard/_components/no-products";
import Link from "next/link";
import { ArrowRightIcon, PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductGrid } from "@/app/dashboard/_components/product-grid";

export default async function DashboardPage() {
    const { userId, redirectToSignIn } = await auth()
    if (userId === null) {
        return redirectToSignIn()
    }
    const products = await getProducts(userId, { limit: 6 })
    if (products.length === 0) {
        return (
            <NoProducts></NoProducts>
        )
    }
    return (
        <>
            <h2 className="mb-6 text-3xl font-semibold flex justify-between">
                <Link href={"/dashboard/products"} className="group flex gap-2 items-center hover:underline">
                    Products
                    <ArrowRightIcon className="size-8 group-hover:translate-x-1 transition-transform"></ArrowRightIcon>
                </Link>
                <Button asChild>
                    <Link href={"/dashboard/products/new"}>
                        <PlusIcon className="size-4 mr-2"></PlusIcon>
                        New Product
                    </Link>
                </Button>
            </h2>
            <ProductGrid products={products}></ProductGrid>
        </>
    );
};
