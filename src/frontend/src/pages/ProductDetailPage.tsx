import { getCategoryGradient } from "@/components/ProductCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/contexts/CartContext";
import { useGetProduct } from "@/hooks/useQueries";
import { Link, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  CheckCircle,
  MessageCircle,
  Minus,
  PackageX,
  Plus,
  ShoppingCart,
  Tag,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function ProductDetailPage() {
  const params = useParams({ strict: false }) as { id?: string };
  const productId = BigInt(params.id ?? "0");
  const { data: product, isLoading } = useGetProduct(productId);
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    if (!product) return;
    for (let i = 0; i < quantity; i++) {
      addItem({
        productId: product.id,
        name: product.name,
        price: product.price,
      });
    }
    toast.success(`${quantity}x ${product.name} added to cart!`);
  };

  if (isLoading) {
    return (
      <main className="min-h-screen py-8">
        <div className="container mx-auto px-4 md:px-6">
          <Skeleton className="mb-6 h-6 w-32" />
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
            <Skeleton className="h-96 w-full rounded-xl" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-xl font-semibold text-muted-foreground">
            Product not found
          </p>
          <Button asChild className="mt-4">
            <Link to="/products">Back to Products</Link>
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen py-8">
      <div className="container mx-auto px-4 md:px-6">
        {/* Breadcrumb */}
        <Link
          to="/products"
          className="mb-6 flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Products
        </Link>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
          {/* Product Image */}
          <div
            className="flex h-80 w-full items-center justify-center rounded-2xl md:h-[450px]"
            style={{
              background: getCategoryGradient(product.category, product.id),
            }}
          >
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="h-full w-full rounded-2xl object-cover opacity-80 mix-blend-overlay"
              />
            ) : (
              <div className="text-center text-white/60">
                <Tag className="mx-auto h-16 w-16 opacity-40" />
                <p className="mt-2 text-sm opacity-60">{product.category}</p>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col gap-5">
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  {product.category}
                </Badge>
                {product.inStock ? (
                  <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20 text-xs">
                    <CheckCircle className="mr-1 h-3 w-3" />
                    In Stock
                  </Badge>
                ) : (
                  <Badge
                    variant="destructive"
                    className="bg-destructive/10 text-destructive text-xs"
                  >
                    <PackageX className="mr-1 h-3 w-3" />
                    Out of Stock
                  </Badge>
                )}
              </div>
              <h1 className="mt-3 font-display text-3xl font-bold leading-tight md:text-4xl">
                {product.name}
              </h1>
            </div>

            <p className="leading-relaxed text-muted-foreground">
              {product.description}
            </p>

            <Separator />

            <div className="flex items-baseline gap-2">
              <span className="font-display text-4xl font-extrabold text-primary">
                ₹{product.price.toFixed(2)}
              </span>
              <span className="text-sm text-muted-foreground">per item</span>
            </div>

            {/* Quantity Selector */}
            {product.inStock && (
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium">Quantity:</span>
                <div className="flex items-center overflow-hidden rounded-lg border border-border">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="flex h-10 w-10 items-center justify-center text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="flex h-10 min-w-[3rem] items-center justify-center border-x border-border text-center font-medium">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                    className="flex h-10 w-10 items-center justify-center text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    disabled={quantity >= 10}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <span className="text-sm text-muted-foreground">
                  Subtotal:{" "}
                  <strong className="text-foreground">
                    ₹{(product.price * quantity).toFixed(2)}
                  </strong>
                </span>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                size="lg"
                className="flex-1 font-semibold"
                disabled={!product.inStock}
                onClick={handleAddToCart}
                data-ocid="product_detail.add_button"
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                {product.inStock ? "Add to Cart" : "Out of Stock"}
              </Button>
              <Button size="lg" variant="outline" asChild className="flex-1">
                <Link to="/contact">
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Ask a Question
                </Link>
              </Button>
            </div>

            {/* Trust badges */}
            <div className="mt-2 grid grid-cols-3 gap-3 rounded-xl bg-muted/50 p-4">
              {[
                { label: "Fast Delivery", sub: "2-5 business days" },
                { label: "Secure Payment", sub: "256-bit encryption" },
                { label: "Easy Returns", sub: "30-day policy" },
              ].map((item) => (
                <div key={item.label} className="text-center">
                  <p className="text-xs font-semibold">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
