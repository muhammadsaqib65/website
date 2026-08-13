"use client";

import { FormEvent, useState } from "react";

type SubmitState = "idle" | "loading" | "success" | "error";

export function ContactForm() {
  const [state, setState] = useState<SubmitState>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    setState("loading");
    setMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          phone: formData.get("phone"),
          message: formData.get("message"),
        }),
      });

      const payload = (await response.json()) as { ok?: boolean; message?: string };

      if (!response.ok || !payload.ok) {
        throw new Error(payload.message ?? "Unable to send message");
      }

      form.reset();
      setState("success");
      setMessage("Thank you! Your message has been sent.");
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : "Request failed");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-3 rounded-xl border border-zinc-200 bg-white p-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-sm text-zinc-700">
          Name
          <input required name="name" className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2" />
        </label>
        <label className="text-sm text-zinc-700">
          Email
          <input required type="email" name="email" className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2" />
        </label>
      </div>

      <label className="block text-sm text-zinc-700">
        Phone (optional)
        <input name="phone" className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2" />
      </label>

      <label className="block text-sm text-zinc-700">
        Message
        <textarea required name="message" rows={4} className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2" />
      </label>

      <button
        type="submit"
        disabled={state === "loading"}
        className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {state === "loading" ? "Sending..." : "Send Message"}
      </button>

      {message ? (
        <p className={`text-sm ${state === "success" ? "text-emerald-700" : "text-red-600"}`}>{message}</p>
      ) : null}
    </form>
  );
}
