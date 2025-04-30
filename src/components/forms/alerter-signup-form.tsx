"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { Header } from "../header";

export function MEVAlerterSignup({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [telegramHandle, setTelegramHandle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ telegramHandle }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Signup failed");
      }

      setIsSuccess(true);
    } catch (err) {
      console.error(err);
      setError("Failed to sign up. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Header
        title="MEV Alerter"
        description={
          <span>
            A live monitoring system that alerts you whenever an MEV attack is
            detected on your wallet address. <br /> It sends notifications to
            selected channels to keep you informed, helps prevent future MEV
            attacks, <br /> and reminds you to set the correct slippage.
          </span>
        }
      />
      <div className="max-w-md">
        {isSuccess ? (
          <div className="flex flex-col items-center justify-center space-y-3 py-6 text-center">
            <CheckCircle2 className="h-12 w-12 text-green-500" />
            <h3 className="text-xl font-medium">You&apos;re all set!</h3>
            <p className="text-muted-foreground">
              We&apos;ll send the next steps on how to use the alerts to{" "}
              {telegramHandle} once they&apos;re ready.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6">
              <div className="grid gap-2">
                <Label htmlFor="telegram">Telegram Handle</Label>
                <Input
                  id="telegram"
                  type="text"
                  placeholder="@yourusername"
                  value={telegramHandle}
                  onChange={(e) => setTelegramHandle(e.target.value)}
                  required
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  <p>{error}</p>
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Signing up..." : "Sign up"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
