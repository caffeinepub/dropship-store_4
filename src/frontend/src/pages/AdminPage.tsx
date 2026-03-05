import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useGetEnquiries,
  useGetOrders,
  useMarkEnquiryRead,
  useUpdateOrderStatus,
} from "@/hooks/useQueries";
import {
  LogOut,
  Mail,
  MailOpen,
  MessageSquare,
  Package,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Enquiry, Order } from "../backend.d";

const ORDER_STATUSES = ["pending", "processing", "shipped", "delivered"];

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-600",
  processing: "bg-blue-500/10 text-blue-600",
  shipped: "bg-purple-500/10 text-purple-600",
  delivered: "bg-green-500/10 text-green-600",
};

function formatDate(nanoseconds: bigint): string {
  const ms = Number(nanoseconds / BigInt(1_000_000));
  return new Date(ms).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function OrdersTab({
  orders,
  isLoading,
}: {
  orders: Order[] | undefined;
  isLoading: boolean;
}) {
  const updateStatus = useUpdateOrderStatus();

  const handleStatusChange = async (orderId: bigint, status: string) => {
    try {
      await updateStatus.mutateAsync({ orderId, status });
      toast.success("Order status updated");
    } catch {
      toast.error("Failed to update order status");
    }
  };

  if (isLoading) {
    return (
      <div data-ocid="admin.orders_loading_state" className="space-y-3 p-4">
        {["s1", "s2", "s3", "s4"].map((sk) => (
          <Skeleton key={sk} className="h-12 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div
        data-ocid="admin.orders_empty_state"
        className="flex flex-col items-center gap-4 rounded-xl py-16 text-center"
      >
        <div className="rounded-full bg-muted p-4">
          <Package className="h-8 w-8 text-muted-foreground" />
        </div>
        <div>
          <p className="font-display text-lg font-semibold">No orders yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Orders will appear here once customers start purchasing
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto" data-ocid="admin.orders_table">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order, index) => (
            <TableRow
              key={order.id.toString()}
              data-ocid={`admin.orders_row.${index + 1}`}
            >
              <TableCell className="font-mono text-sm font-medium">
                #{order.id.toString()}
              </TableCell>
              <TableCell>
                <div>
                  <p className="font-medium">{order.customerName}</p>
                  <p className="text-xs text-muted-foreground">{order.phone}</p>
                </div>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {order.email}
              </TableCell>
              <TableCell className="font-semibold text-primary">
                ₹{order.totalAmount.toFixed(2)}
              </TableCell>
              <TableCell>
                <Select
                  defaultValue={order.status}
                  onValueChange={(val) =>
                    void handleStatusChange(order.id, val)
                  }
                  disabled={updateStatus.isPending}
                >
                  <SelectTrigger
                    className={`h-8 w-32 text-xs font-medium ${STATUS_COLORS[order.status] ?? ""}`}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ORDER_STATUSES.map((s) => (
                      <SelectItem
                        key={s}
                        value={s}
                        className="capitalize text-xs"
                      >
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell className="text-xs text-muted-foreground">
                {formatDate(order.createdAt)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function EnquiriesTab({
  enquiries,
  isLoading,
}: {
  enquiries: Enquiry[] | undefined;
  isLoading: boolean;
}) {
  const markRead = useMarkEnquiryRead();

  const handleToggleRead = async (enquiry: Enquiry) => {
    if (enquiry.isRead) return;
    try {
      await markRead.mutateAsync(enquiry.id);
      toast.success("Enquiry marked as read");
    } catch {
      toast.error("Failed to mark enquiry as read");
    }
  };

  if (isLoading) {
    return (
      <div data-ocid="admin.enquiries_loading_state" className="space-y-3 p-4">
        {["s1", "s2", "s3", "s4"].map((sk) => (
          <Skeleton key={sk} className="h-12 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (!enquiries || enquiries.length === 0) {
    return (
      <div
        data-ocid="admin.enquiries_empty_state"
        className="flex flex-col items-center gap-4 rounded-xl py-16 text-center"
      >
        <div className="rounded-full bg-muted p-4">
          <MessageSquare className="h-8 w-8 text-muted-foreground" />
        </div>
        <div>
          <p className="font-display text-lg font-semibold">No enquiries yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Customer enquiries will appear here
          </p>
        </div>
      </div>
    );
  }

  const unreadCount = enquiries.filter((e) => !e.isRead).length;

  return (
    <div>
      {unreadCount > 0 && (
        <div className="mb-4 flex items-center gap-2 rounded-lg bg-primary/5 px-4 py-2 text-sm text-primary">
          <Mail className="h-4 w-4" />
          <span>
            {unreadCount} unread {unreadCount === 1 ? "enquiry" : "enquiries"}
          </span>
        </div>
      )}
      <div className="overflow-x-auto" data-ocid="admin.enquiries_table">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Read</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {enquiries.map((enquiry, index) => (
              <TableRow
                key={enquiry.id.toString()}
                data-ocid={`admin.enquiries_row.${index + 1}`}
                className={!enquiry.isRead ? "bg-primary/5" : ""}
              >
                <TableCell>
                  <div>
                    <div className="flex items-center gap-1.5">
                      {!enquiry.isRead && (
                        <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                      )}
                      <p className="font-medium text-sm">{enquiry.name}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {enquiry.email}
                    </p>
                  </div>
                </TableCell>
                <TableCell className="max-w-[180px]">
                  <p className="truncate text-sm font-medium">
                    {enquiry.subject}
                  </p>
                </TableCell>
                <TableCell className="max-w-[250px]">
                  <p className="line-clamp-2 text-xs text-muted-foreground">
                    {enquiry.message}
                  </p>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                  {formatDate(enquiry.createdAt)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {enquiry.isRead ? (
                      <MailOpen className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Switch
                        checked={enquiry.isRead}
                        onCheckedChange={() => void handleToggleRead(enquiry)}
                        disabled={markRead.isPending}
                      />
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const {
    data: orders,
    isLoading: ordersLoading,
    refetch: refetchOrders,
  } = useGetOrders();
  const {
    data: enquiries,
    isLoading: enquiriesLoading,
    refetch: refetchEnquiries,
  } = useGetEnquiries();

  const [activeTab, setActiveTab] = useState("orders");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "Shivam" && password === "Shivam1234") {
      setIsLoggedIn(true);
      setUsername("");
      setPassword("");
    } else {
      toast.error("Invalid username or password");
    }
  };

  const handleRefresh = () => {
    void refetchOrders();
    void refetchEnquiries();
  };

  // Login screen
  if (!isLoggedIn) {
    return (
      <main className="flex min-h-screen items-center justify-center py-8">
        <div className="mx-auto w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-card">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <ShieldCheck className="h-8 w-8 text-primary" />
            </div>
            <h2 className="font-display text-2xl font-bold">Admin Login</h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Sign in to access the admin dashboard
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <Label
                htmlFor="admin-username"
                className="text-xs font-medium text-muted-foreground uppercase tracking-wide"
              >
                Username
              </Label>
              <Input
                id="admin-username"
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                data-ocid="admin.username_input"
              />
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="admin-password"
                className="text-xs font-medium text-muted-foreground uppercase tracking-wide"
              >
                Password
              </Label>
              <Input
                id="admin-password"
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                data-ocid="admin.password_input"
              />
            </div>

            <Button
              type="submit"
              className="w-full font-semibold"
              data-ocid="admin.submit_button"
            >
              Login
            </Button>
          </form>
        </div>
      </main>
    );
  }

  const orderCount = orders?.length ?? 0;
  const enquiryCount = enquiries?.length ?? 0;
  const unreadCount = enquiries?.filter((e) => !e.isRead).length ?? 0;

  return (
    <main className="min-h-screen py-8">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display text-3xl font-bold">
                Admin Dashboard
              </h1>
              <Badge className="bg-primary/10 text-primary">Admin</Badge>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage orders and customer enquiries
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsLoggedIn(false)}
              className="gap-2"
              data-ocid="admin.logout_button"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            {
              label: "Total Orders",
              value: orderCount,
              icon: Package,
              color: "text-blue-500",
              bg: "bg-blue-500/10",
            },
            {
              label: "Unread Enquiries",
              value: unreadCount,
              icon: Mail,
              color: "text-amber-500",
              bg: "bg-amber-500/10",
            },
            {
              label: "Total Enquiries",
              value: enquiryCount,
              icon: MessageSquare,
              color: "text-purple-500",
              bg: "bg-purple-500/10",
            },
            {
              label: "Revenue",
              value: `₹${(orders ?? []).reduce((s, o) => s + o.totalAmount, 0).toFixed(0)}`,
              icon: Package,
              color: "text-green-500",
              bg: "bg-green-500/10",
            },
          ].map(({ label, value, icon: Icon, color, bg }) => (
            <div
              key={label}
              className="rounded-xl border border-border bg-card p-4 shadow-card"
            >
              <div
                className={`mb-2 flex h-9 w-9 items-center justify-center rounded-lg ${bg}`}
              >
                <Icon className={`h-4 w-4 ${color}`} />
              </div>
              <p className="font-display text-2xl font-bold">{value}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="orders" data-ocid="admin.orders_tab">
              <Package className="mr-1.5 h-4 w-4" />
              Orders
              {orderCount > 0 && (
                <Badge className="ml-2 h-5 w-5 rounded-full p-0 text-[10px] flex items-center justify-center bg-primary text-primary-foreground">
                  {orderCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="enquiries" data-ocid="admin.enquiries_tab">
              <MessageSquare className="mr-1.5 h-4 w-4" />
              Enquiries
              {unreadCount > 0 && (
                <Badge className="ml-2 h-5 w-5 rounded-full p-0 text-[10px] flex items-center justify-center bg-primary text-primary-foreground">
                  {unreadCount}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orders">
            <div className="rounded-xl border border-border bg-card overflow-hidden shadow-card">
              <div className="border-b border-border px-5 py-4">
                <h3 className="font-display font-semibold">All Orders</h3>
              </div>
              <OrdersTab orders={orders} isLoading={ordersLoading} />
            </div>
          </TabsContent>

          <TabsContent value="enquiries">
            <div className="rounded-xl border border-border bg-card overflow-hidden shadow-card">
              <div className="border-b border-border px-5 py-4">
                <h3 className="font-display font-semibold">
                  Customer Enquiries
                </h3>
              </div>
              <EnquiriesTab
                enquiries={enquiries}
                isLoading={enquiriesLoading}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
