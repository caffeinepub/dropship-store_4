import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/contexts/CartContext";
import { useSubmitOrder } from "@/hooks/useQueries";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  Loader2,
  ShoppingBag,
} from "lucide-react";
import { useState } from "react";

interface FormData {
  customerName: string;
  email: string;
  phone: string;
  shippingAddress: string;
}

interface FormErrors {
  customerName?: string;
  email?: string;
  phone?: string;
  shippingAddress?: string;
}

function validate(data: FormData): FormErrors {
  const errors: FormErrors = {};
  if (!data.customerName.trim()) errors.customerName = "Full name is required";
  if (!data.email.trim()) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = "Please enter a valid email";
  }
  if (!data.phone.trim()) errors.phone = "Phone number is required";
  if (!data.shippingAddress.trim())
    errors.shippingAddress = "Shipping address is required";
  return errors;
}

export function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();
  const submitOrder = useSubmitOrder();

  const [form, setForm] = useState<FormData>({
    customerName: "",
    email: "",
    phone: "",
    shippingAddress: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [orderId, setOrderId] = useState<bigint | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const serializedItems = JSON.stringify(
        items.map((item) => ({
          productId: item.productId.toString(),
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
      );

      const id = await submitOrder.mutateAsync({
        customerName: form.customerName,
        email: form.email,
        phone: form.phone,
        shippingAddress: form.shippingAddress,
        items: serializedItems,
        totalAmount: total,
      });

      setOrderId(id);
      clearCart();
    } catch {
      // Error handled by mutation state
    }
  };

  // Empty cart
  if (items.length === 0 && !orderId) {
    return (
      <main className="flex min-h-screen items-center justify-center py-8">
        <div className="text-center">
          <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground" />
          <h2 className="mt-4 font-display text-2xl font-bold">
            Your cart is empty
          </h2>
          <p className="mt-2 text-muted-foreground">
            Add some products before checking out
          </p>
          <Button asChild className="mt-6">
            <Link to="/products">Browse Products</Link>
          </Button>
        </div>
      </main>
    );
  }

  // Success state
  if (orderId) {
    return (
      <main className="flex min-h-screen items-center justify-center py-8">
        <div
          data-ocid="checkout.success_state"
          className="mx-auto max-w-md rounded-2xl border border-border bg-card p-8 text-center shadow-card"
        >
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
          <h2 className="mt-4 font-display text-2xl font-bold">
            Order Placed!
          </h2>
          <p className="mt-2 text-muted-foreground">
            Thank you for your order. We'll send you a confirmation email
            shortly.
          </p>
          <div className="mt-4 rounded-lg bg-muted p-3">
            <p className="text-sm text-muted-foreground">Order ID</p>
            <p className="font-display text-lg font-bold text-primary">
              #{orderId.toString()}
            </p>
          </div>
          <div className="mt-6 flex flex-col gap-2 sm:flex-row">
            <Button asChild className="flex-1">
              <Link to="/products">Continue Shopping</Link>
            </Button>
            <Button variant="outline" asChild className="flex-1">
              <Link to="/contact">Contact Support</Link>
            </Button>
          </div>
        </div>
      </main>
    );
  }

  // Suppress unused import
  void navigate;

  return (
    <main className="min-h-screen py-8">
      <div className="container mx-auto px-4 md:px-6">
        {/* Back */}
        <Link
          to="/products"
          className="mb-6 flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Continue Shopping
        </Link>

        <h1 className="mb-8 font-display text-3xl font-bold">Checkout</h1>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
          {/* Form */}
          <div className="lg:col-span-3">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="rounded-xl border border-border bg-card p-6 shadow-card">
                <h2 className="mb-5 font-display text-lg font-semibold">
                  Customer Information
                </h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="customerName">Full Name *</Label>
                    <Input
                      id="customerName"
                      name="customerName"
                      value={form.customerName}
                      onChange={handleChange}
                      placeholder="John Doe"
                      data-ocid="checkout.input"
                      className={
                        errors.customerName ? "border-destructive" : ""
                      }
                    />
                    {errors.customerName && (
                      <p
                        data-ocid="checkout.error_state"
                        className="flex items-center gap-1 text-xs text-destructive"
                      >
                        <AlertCircle className="h-3 w-3" />
                        {errors.customerName}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      data-ocid="checkout.input"
                      className={errors.email ? "border-destructive" : ""}
                    />
                    {errors.email && (
                      <p className="flex items-center gap-1 text-xs text-destructive">
                        <AlertCircle className="h-3 w-3" />
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+1 (555) 000-0000"
                      className={errors.phone ? "border-destructive" : ""}
                    />
                    {errors.phone && (
                      <p className="flex items-center gap-1 text-xs text-destructive">
                        <AlertCircle className="h-3 w-3" />
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <Label htmlFor="shippingAddress">Shipping Address *</Label>
                    <Textarea
                      id="shippingAddress"
                      name="shippingAddress"
                      value={form.shippingAddress}
                      onChange={handleChange}
                      placeholder="123 Main Street, City, State, ZIP, Country"
                      rows={3}
                      className={
                        errors.shippingAddress ? "border-destructive" : ""
                      }
                      data-ocid="checkout.textarea"
                    />
                    {errors.shippingAddress && (
                      <p className="flex items-center gap-1 text-xs text-destructive">
                        <AlertCircle className="h-3 w-3" />
                        {errors.shippingAddress}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {submitOrder.isError && (
                <div
                  data-ocid="checkout.error_state"
                  className="flex items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive"
                >
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                  <p>
                    Failed to place order. Please try again or{" "}
                    <Link to="/contact" className="underline">
                      contact support
                    </Link>
                    .
                  </p>
                </div>
              )}

              <Button
                type="submit"
                size="lg"
                className="w-full font-semibold"
                disabled={submitOrder.isPending}
                data-ocid="checkout.submit_button"
              >
                {submitOrder.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Placing Order...
                  </>
                ) : (
                  `Place Order · ₹${total.toFixed(2)}`
                )}
              </Button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-2">
            <div className="sticky top-24 rounded-xl border border-border bg-card p-6 shadow-card">
              <h2 className="mb-4 font-display text-lg font-semibold">
                Order Summary
              </h2>
              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.productId.toString()}
                    className="flex items-center gap-3"
                  >
                    <div
                      className="h-10 w-10 flex-shrink-0 rounded-md"
                      style={{
                        background: `hsl(${(Number(item.productId) * 47) % 360}, 65%, 75%)`,
                      }}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {item.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <span className="text-sm font-semibold">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
              <Separator className="my-4" />
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
              </div>
              <Separator className="my-4" />
              <div className="flex justify-between">
                <span className="font-display font-bold">Total</span>
                <span className="font-display text-xl font-extrabold text-primary">
                  ₹{total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
