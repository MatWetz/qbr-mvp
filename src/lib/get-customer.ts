import { mockCustomers } from "@/data/mock-customers";
import { CustomerData } from "@/types/qbr";

const LOOKUP_LATENCY_MS = 550;

export async function getCustomerByName(name: string): Promise<CustomerData | null> {
  await new Promise((resolve) => setTimeout(resolve, LOOKUP_LATENCY_MS));

  const query = name.trim().toLowerCase();
  if (!query) {
    return null;
  }

  return (
    mockCustomers.find((customer) => customer.name.toLowerCase() === query) ??
    mockCustomers.find((customer) => customer.id === query) ??
    null
  );
}
