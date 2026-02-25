"use client";

import Image from "next/image";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { mockCustomers } from "@/data/mock-customers";
import { getCustomerByQuery } from "@/lib/get-customer";

export function QbrBuilder() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isMounted = useRef(true);

  const lookupExamples = useMemo(() => mockCustomers.map((customer) => customer.name), []);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const customer = await getCustomerByQuery(query);
      if (!isMounted.current) {
        return;
      }

      if (!customer) {
        setError("No mock customer found. Try one of the sample names below.");
        return;
      }

      router.push(`/deck/${customer.id}`);
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  };

  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden px-4 py-8 text-slate-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(255,95,40,0.2),transparent_40%),radial-gradient(circle_at_80%_10%,rgba(48,78,255,0.2),transparent_40%)]" />

      <Card className="relative z-10 w-full max-w-2xl border border-orange-500/30 bg-[#0a0b16]/90 shadow-[0_0_80px_rgba(255,95,40,0.12)] backdrop-blur-xl">
        <CardHeader className="space-y-4">
          <Image src="/coderabbit-logo-light.svg" alt="CodeRabbit" width={170} height={34} />
          <Badge className="w-fit border-orange-400/40 bg-orange-500/10 text-orange-300">QBR Launcher</Badge>
          <CardTitle className="font-mono text-2xl tracking-tight text-slate-50 md:text-3xl">
            Open Fullscreen QBR Deck
          </CardTitle>
          <CardDescription className="text-slate-300">
            Enter a customer name to open a dedicated fullscreen presentation route optimized for desktop and mobile.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form className="flex flex-col gap-3 md:flex-row" onSubmit={onSubmit}>
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Example: Acme Health"
              className="border-slate-700 bg-[#101226] text-slate-100 placeholder:text-slate-400"
              aria-label="Customer Name"
            />
            <Button type="submit" disabled={loading} className="bg-orange-500 text-black hover:bg-orange-400">
              {loading ? "Opening..." : "Open Deck"}
            </Button>
          </form>

          <div className="flex flex-wrap gap-2 text-xs text-slate-300">
            {lookupExamples.map((name) => (
              <button
                key={name}
                type="button"
                className="rounded-full border border-slate-700 bg-slate-900/60 px-3 py-1 hover:border-orange-400/50 hover:text-orange-200"
                onClick={() => setQuery(name)}
              >
                {name}
              </button>
            ))}
          </div>

          {error ? (
            <p className="text-sm text-red-300" role="alert" aria-live="assertive">
              {error}
            </p>
          ) : null}
        </CardContent>
      </Card>
    </main>
  );
}
