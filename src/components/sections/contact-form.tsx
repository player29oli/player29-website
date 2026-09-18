"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { ClosingSection } from "@/lib/content/schema";

type Status = "idle" | "submitting" | "success" | "error";

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function ContactForm({
  copy,
  email,
  name,
  endpoint,
}: {
  copy: ClosingSection["contact"];
  email: string;
  name: string;
  endpoint: string;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const senderName = String(data.get("name") ?? "").trim();
    const senderEmail = String(data.get("email") ?? "").trim();
    const organisation = String(data.get("organisation") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();

    const nextErrors: Record<string, string> = {};
    if (!senderName) nextErrors.name = copy.validation.nameRequired;
    if (!senderEmail) nextErrors.email = copy.validation.emailRequired;
    else if (!isValidEmail(senderEmail)) nextErrors.email = copy.validation.emailInvalid;
    if (!message) nextErrors.message = copy.validation.messageRequired;
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setStatus("submitting");

    const payload = { name: senderName, email: senderEmail, organisation, message };

    if (!endpoint) {
      const subject = encodeURIComponent(`${name} enquiry from ${senderName}`);
      const body = encodeURIComponent(
        `${message}\n\n${senderName}${organisation ? `\n${organisation}` : ""}\n${senderEmail}`,
      );
      window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
      setStatus("success");
      form.reset();
      return;
    }

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("Request failed");
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-5" noValidate>
      <div className="grid gap-2">
        <Label htmlFor="name">{copy.fields.name}</Label>
        <Input
          id="name"
          name="name"
          autoComplete="name"
          required
          aria-invalid={errors.name ? true : undefined}
          aria-describedby={errors.name ? "name-error" : undefined}
          className="h-11 min-h-11 rounded-[13px] bg-white px-3 text-[1rem]"
        />
        {errors.name ? (
          <p id="name-error" className="text-sm text-red-700">
            {errors.name}
          </p>
        ) : null}
      </div>
      <div className="grid gap-2">
        <Label htmlFor="email">{copy.fields.email}</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={errors.email ? "email-error" : undefined}
          className="h-11 min-h-11 rounded-[13px] bg-white px-3 text-[1rem]"
        />
        {errors.email ? (
          <p id="email-error" className="text-sm text-red-700">
            {errors.email}
          </p>
        ) : null}
      </div>
      <div className="grid gap-2">
        <Label htmlFor="organisation">{copy.fields.organisation}</Label>
        <Input
          id="organisation"
          name="organisation"
          autoComplete="organization"
          className="h-11 min-h-11 rounded-[13px] bg-white px-3 text-[1rem]"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="message">{copy.fields.message}</Label>
        <Textarea
          id="message"
          name="message"
          required
          rows={5}
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={errors.message ? "message-error" : undefined}
          className="min-h-32 rounded-[13px] bg-white px-3 py-3 text-[1rem]"
        />
        {errors.message ? (
          <p id="message-error" className="text-sm text-red-700">
            {errors.message}
          </p>
        ) : null}
      </div>
      <Button type="submit" size="cta" disabled={status === "submitting"}>
        {status === "submitting" ? copy.sending : copy.submit}
      </Button>
      {status === "success" ? (
        <p role="status" className="text-sm font-medium text-ink">
          {copy.success}
        </p>
      ) : null}
      {status === "error" ? (
        <p role="alert" className="text-sm font-medium text-red-700">
          {copy.error}{" "}
          <a className="underline" href={`mailto:${email}`}>
            {email}
          </a>
        </p>
      ) : null}
    </form>
  );
}
