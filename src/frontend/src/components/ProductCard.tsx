import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { Link } from "@tanstack/react-router";
import { PackageX, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import type { Product } from "../backend.d";

const CATEGORY_GRADIENTS: Record<string, string> = {
  Electronics: "linear-gradient(135deg, #1a1a4e 0%, #2d4a8a 100%)",
  Fashion: "linear-gradient(135deg, #4a1a4e 0%, #8a2d6a 100%)",
  "Home & Garden": "linear-gradient(135deg, #1a3a1a 0%, #2d7a3a 100%)",
  Sports: "linear-gradient(135deg, #4e2a1a 0%, #8a4a2d 100%)",
  Toys: "linear-gradient(135deg, #1a4e4a 0%, #2d7a6a 100%)",
  Beauty: "linear-gradient(135deg, #4e1a3a 0%, #8a2d5a 100%)",
  Books: "linear-gradient(135deg, #3a2a1a 0%, #6a4a2d 100%)",
  Automotive: "linear-gradient(135deg, #1a1a1a 0%, #3a3a3a 100%)",
};

export function getCategoryGradient(category: string, id: bigint): string {
  if (CATEGORY_GRADIENTS[category]) return CATEGORY_GRADIENTS[category];
  const hue = Number(id * BigInt(47)) % 360;
  return `linear-gradient(135deg, hsl(${hue}, 60%, 25%) 0%, hsl(${(hue + 40) % 360}, 55%, 40%) 100%)`;
}

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
    });
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div
      data-ocid={`products.item.${index + 1}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
    >
      {/* Image / Gradient Placeholder */}
      <Link
        to="/products/$id"
        params={{ id: product.id.toString() }}
        className="block overflow-hidden"
      >
        <div
          className="relative h-52 w-full overflow-hidden"
          style={{
            background: getCategoryGradient(product.category, product.id),
          }}
        >
          {product.imageUrl && (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="absolute inset-0 h-full w-full object-cover opacity-80 mix-blend-overlay"
              loading="lazy"
            />
          )}
          {/* Category label overlay */}
          <div className="absolute left-3 top-3">
            <Badge className="bg-black/50 text-white hover:bg-black/60 text-xs backdrop-blur-sm">
              {product.category}
            </Badge>
          </div>
          {!product.inStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
              <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-white">
                <PackageX className="h-4 w-4" />
                <span className="text-sm font-semibold">Out of Stock</span>
              </div>
            </div>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex-1">
          <Link
            to="/products/$id"
            params={{ id: product.id.toString() }}
            className="line-clamp-2 font-display text-sm font-semibold text-card-foreground transition-colors hover:text-primary"
          >
            {product.name}
          </Link>
          <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
            {product.description}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <span className="font-display text-lg font-bold text-primary">
            ₹{product.price.toFixed(2)}
          </span>
          <Button
            size="sm"
            disabled={!product.inStock}
            onClick={handleAddToCart}
            className="gap-1.5 text-xs"
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
}
