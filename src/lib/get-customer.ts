import { mockCustomers } from "@/data/mock-customers";
import { CustomerData } from "@/types/qbr";

const LOOKUP_LATENCY_MS = 550;

export async function getCustomerByQuery(name: string): Promise<CustomerData | null> {
  const query = name.trim().toLowerCase();
  if (!query) {
    return null;
  }

  await new Promise((resolve) => setTimeout(resolve, LOOKUP_LATENCY_MS));

  return (
    mockCustomers.find((customer) => customer.name.toLowerCase() === query) ??
    mockCustomers.find((customer) => customer.id === query) ??
    null
  );
}

export function getCustomerById(customerId: string): CustomerData | null {
  const id = customerId.trim().toLowerCase();
  if (!id) {
    return null;
  }

  return mockCustomers.find((customer) => customer.id.toLowerCase() === id) ?? null;
}
