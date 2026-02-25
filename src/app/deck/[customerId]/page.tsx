import { notFound } from "next/navigation";

import { QbrDeck } from "@/components/qbr/qbr-deck";
import { getCustomerById } from "@/lib/get-customer";

export default async function DeckPage({
  params,
}: {
  params: Promise<{ customerId: string }>;
}) {
  const { customerId } = await params;
  const customer = getCustomerById(customerId);

  if (!customer) {
    notFound();
  }

  return <QbrDeck customer={customer} />;
}
