import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Enquiry, Order, Product } from "../backend.d";
import { useActor } from "./useActor";

// Price overrides in INR — applied client-side to ensure correct prices
// regardless of backend state.
const PRICE_OVERRIDES: Record<string, number> = {
  "1": 399, // Wireless Earbuds
  "2": 699, // Smart Watch
  "3": 150, // Yoga Mat
  "4": 99, // Water Bottle
  "5": 299, // Bluetooth Speaker
  "6": 499, // Fitness Tracker
};

function applyPriceOverride(product: Product): Product {
  const override = PRICE_OVERRIDES[product.id.toString()];
  if (override !== undefined) {
    return { ...product, price: override };
  }
  return product;
}

export function useGetProducts() {
  const { actor, isFetching } = useActor();
  return useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      if (!actor) return [];
      const products = await actor.getProducts();
      return products.map(applyPriceOverride);
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}

export function useGetProduct(id: bigint) {
  const { actor, isFetching } = useActor();
  return useQuery<Product | null>({
    queryKey: ["product", id.toString()],
    queryFn: async () => {
      if (!actor) return null;
      const product = await actor.getProduct(id);
      if (!product) return null;
      return applyPriceOverride(product);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetOrders() {
  const { actor, isFetching } = useActor();
  return useQuery<Order[]>({
    queryKey: ["orders"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getOrders();
    },
    enabled: !!actor && !isFetching,
    staleTime: 10_000,
  });
}

export function useGetEnquiries() {
  const { actor, isFetching } = useActor();
  return useQuery<Enquiry[]>({
    queryKey: ["enquiries"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getEnquiries();
    },
    enabled: !!actor && !isFetching,
    staleTime: 10_000,
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSubmitOrder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      customerName: string;
      email: string;
      phone: string;
      shippingAddress: string;
      items: string;
      totalAmount: number;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.submitOrder(
        data.customerName,
        data.email,
        data.phone,
        data.shippingAddress,
        data.items,
        data.totalAmount,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}

export function useSubmitEnquiry() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (data: {
      name: string;
      email: string;
      subject: string;
      message: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.submitEnquiry(
        data.name,
        data.email,
        data.subject,
        data.message,
      );
    },
  });
}

export function useUpdateOrderStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      orderId,
      status,
    }: {
      orderId: bigint;
      status: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateOrderStatus(orderId, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}

export function useMarkEnquiryRead() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (enquiryId: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.markEnquiryRead(enquiryId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enquiries"] });
    },
  });
}
