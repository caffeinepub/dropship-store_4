import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useCart } from "@/contexts/CartContext";
import { useNavigate } from "@tanstack/react-router";
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, removeItem, updateQty, total } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    onClose();
    void navigate({ to: "/checkout" });
  };

  return (
    <Sheet open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <SheetContent
        side="right"
        className="flex w-full flex-col sm:max-w-md"
        data-ocid="cart.panel"
      >
        <SheetHeader className="pb-4">
          <SheetTitle className="flex items-center gap-2 font-display text-lg">
            <ShoppingBag className="h-5 w-5 text-primary" />
            Shopping Cart
            {items.length > 0 && (
              <span className="ml-auto rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                {items.length}
              </span>
            )}
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 py-12 text-center">
            <div className="rounded-full bg-muted p-6">
              <ShoppingBag className="h-10 w-10 text-muted-foreground" />
            </div>
            <div>
              <p className="font-display text-lg font-semibold">
                Your cart is empty
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Add some products to get started
              </p>
            </div>
            <Button
              variant="outline"
              onClick={onClose}
              data-ocid="cart.close_button"
            >
              Continue Shopping
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 pr-1">
              <div className="flex flex-col gap-4 py-2">
                {items.map((item, index) => (
                  <div
                    key={item.productId.toString()}
                    data-ocid={`cart.item.${index + 1}`}
                    className="flex gap-3 rounded-lg bg-muted/40 p-3"
                  >
                    {/* Color swatch as image placeholder */}
                    <div
                      className="h-16 w-16 flex-shrink-0 rounded-md"
                      style={{
                        background: `hsl(${(Number(item.productId) * 47) % 360}, 65%, 75%)`,
                      }}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {item.name}
                      </p>
                      <p className="text-sm text-primary font-semibold">
                        ₹{item.price.toFixed(2)}
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            updateQty(item.productId, item.quantity - 1)
                          }
                          className="flex h-6 w-6 items-center justify-center rounded border border-border bg-background text-foreground hover:bg-accent transition-colors"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="min-w-[1.5rem] text-center text-sm font-medium">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateQty(item.productId, item.quantity + 1)
                          }
                          className="flex h-6 w-6 items-center justify-center rounded border border-border bg-background text-foreground hover:bg-accent transition-colors"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                        <span className="ml-auto text-sm font-semibold">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.productId)}
                      data-ocid={`cart.delete_button.${index + 1}`}
                      className="flex-shrink-0 self-start rounded p-1 text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="space-y-4 pt-4">
              <Separator />
              <div className="flex items-center justify-between">
                <span className="font-display text-base font-semibold">
                  Total
                </span>
                <span className="font-display text-xl font-bold text-primary">
                  ₹{total.toFixed(2)}
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <Button
                  className="w-full font-semibold"
                  onClick={handleCheckout}
                  data-ocid="cart.checkout_button"
                >
                  Proceed to Checkout
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={onClose}
                  data-ocid="cart.close_button"
                >
                  Continue Shopping
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
