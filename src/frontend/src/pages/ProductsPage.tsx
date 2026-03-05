import { ProductCard } from "@/components/ProductCard";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetProducts } from "@/hooks/useQueries";
import { cn } from "@/lib/utils";
import { useSearch } from "@tanstack/react-router";
import { Search, SlidersHorizontal } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";

export function ProductsPage() {
  const { data: products, isLoading } = useGetProducts();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const search = useSearch({ strict: false }) as any;
  const initialCategory = (search?.category as string) || "All";

  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (search?.category) {
      setActiveCategory(search.category as string);
    }
  }, [search?.category]);

  const categories = useMemo(() => {
    if (!products) return ["All"];
    const cats = [...new Set(products.map((p) => p.category).filter(Boolean))];
    return ["All", ...cats];
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    return products.filter((p) => {
      const matchesCategory =
        activeCategory === "All" || p.category === activeCategory;
      const matchesSearch =
        !searchQuery ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, activeCategory, searchQuery]);

  return (
    <main className="min-h-screen py-8">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <h1 className="font-display text-3xl font-bold md:text-4xl">
            All Products
          </h1>
          <p className="mt-2 text-muted-foreground">
            {isLoading
              ? "Loading products..."
              : `${filteredProducts.length} product${filteredProducts.length !== 1 ? "s" : ""} found`}
          </p>
        </motion.div>

        {/* Filters Row */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                type="button"
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "rounded-full px-4 py-1.5 text-sm font-medium transition-all",
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground shadow-gold"
                    : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              data-ocid="products.search_input"
            />
          </div>
        </div>

        {/* Filters info */}
        {(activeCategory !== "All" || searchQuery) && (
          <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span>Showing results for</span>
            {activeCategory !== "All" && (
              <Badge variant="secondary">{activeCategory}</Badge>
            )}
            {searchQuery && <Badge variant="secondary">"{searchQuery}"</Badge>}
          </div>
        )}

        {/* Products Grid */}
        {isLoading ? (
          <div
            data-ocid="products.list"
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {["s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8"].map((sk) => (
              <div
                key={sk}
                className="overflow-hidden rounded-xl border border-border"
              >
                <Skeleton className="h-52 w-full" />
                <div className="space-y-3 p-4">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-full" />
                  <div className="flex justify-between">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-8 w-24" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <motion.div
            data-ocid="products.list"
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.06 } },
            }}
            initial="hidden"
            animate="show"
          >
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id.toString()}
                variants={{
                  hidden: { opacity: 0, y: 16 },
                  show: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.3 }}
              >
                <ProductCard product={product} index={index} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div
            data-ocid="products.empty_state"
            className="flex flex-col items-center gap-4 rounded-xl border border-border py-20 text-center"
          >
            <div className="rounded-full bg-muted p-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <p className="font-display text-lg font-semibold">
                No products found
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Try adjusting your search or category filter
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setActiveCategory("All");
                setSearchQuery("");
              }}
              className="text-sm text-primary hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
