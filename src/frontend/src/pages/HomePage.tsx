import { ProductCard } from "@/components/ProductCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetProducts } from "@/hooks/useQueries";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  RefreshCw,
  ShieldCheck,
  Star,
  TruckIcon,
} from "lucide-react";
import { motion } from "motion/react";

const SAMPLE_CATEGORIES = [
  "Electronics",
  "Fashion",
  "Home & Garden",
  "Sports",
  "Beauty",
  "Automotive",
];

const FEATURES = [
  {
    icon: TruckIcon,
    title: "Free Shipping",
    desc: "On all orders over ₹999",
  },
  {
    icon: ShieldCheck,
    title: "Secure Payment",
    desc: "100% protected transactions",
  },
  {
    icon: RefreshCw,
    title: "Easy Returns",
    desc: "30-day hassle-free returns",
  },
  {
    icon: Star,
    title: "Top Rated",
    desc: "Curated premium products",
  },
];

export function HomePage() {
  const { data: products, isLoading } = useGetProducts();

  const featuredProducts = products?.slice(0, 6) ?? [];
  const categories = products
    ? [...new Set(products.map((p) => p.category))].filter(Boolean)
    : SAMPLE_CATEGORIES;

  return (
    <main>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="relative h-[500px] w-full">
          <img
            src="/assets/generated/hero-banner.dim_1200x500.jpg"
            alt="Shop the best products"
            className="h-full w-full object-cover"
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />

          {/* Hero Content */}
          <div className="absolute inset-0 flex items-center">
            <div className="container mx-auto px-4 md:px-6">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="max-w-lg space-y-5"
              >
                <Badge className="bg-primary/90 text-primary-foreground text-xs uppercase tracking-wider">
                  New Arrivals 2026
                </Badge>
                <h1 className="font-display text-4xl font-extrabold leading-tight text-white md:text-5xl lg:text-6xl">
                  Shop the <span className="text-primary">Best Products</span>
                </h1>
                <p className="text-base text-white/80 md:text-lg">
                  Discover thousands of premium products at unbeatable prices.
                  Fast delivery, secure payment, easy returns.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button
                    size="lg"
                    asChild
                    className="font-semibold shadow-gold"
                    data-ocid="hero.primary_button"
                  >
                    <Link to="/products">
                      Shop Now
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    asChild
                    className="border-white/30 text-white hover:bg-white/10 hover:text-white"
                  >
                    <Link to="/contact">Contact Us</Link>
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="border-y border-border bg-muted/40">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 divide-x divide-border md:grid-cols-4">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="flex flex-col items-center gap-2 px-4 py-5 text-center sm:flex-row sm:text-left"
              >
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-display text-sm font-semibold">{title}</p>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="mb-6 font-display text-2xl font-bold md:text-3xl">
              Shop by Category
            </h2>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <Link key={cat} to="/products" search={{ category: cat }}>
                  <Badge
                    variant="outline"
                    className="cursor-pointer px-4 py-2 text-sm font-medium transition-all hover:bg-primary hover:text-primary-foreground hover:border-primary"
                  >
                    {cat}
                  </Badge>
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-8 flex items-center justify-between"
          >
            <div>
              <h2 className="font-display text-2xl font-bold md:text-3xl">
                Featured Products
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Handpicked for you this season
              </p>
            </div>
            <Button variant="ghost" asChild className="hidden sm:flex">
              <Link to="/products">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>

          {isLoading ? (
            <div
              data-ocid="products.list"
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {["s1", "s2", "s3", "s4", "s5", "s6"].map((sk) => (
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
          ) : featuredProducts.length > 0 ? (
            <motion.div
              data-ocid="products.list"
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
              variants={{
                hidden: {},
                show: {
                  transition: {
                    staggerChildren: 0.08,
                  },
                },
              }}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              {featuredProducts.map((product, index) => (
                <motion.div
                  key={product.id.toString()}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    show: { opacity: 1, y: 0 },
                  }}
                >
                  <ProductCard product={product} index={index} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="flex flex-col items-center gap-4 rounded-xl border border-border py-16 text-center">
              <p className="text-muted-foreground">
                No products available yet. Check back soon!
              </p>
              <Button asChild>
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>
          )}

          <div className="mt-8 flex justify-center sm:hidden">
            <Button variant="outline" asChild>
              <Link to="/products">
                View All Products
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
