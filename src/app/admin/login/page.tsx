import Link from "next/link";
import { loginAction } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

type LoginPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminLoginPage({ searchParams }: LoginPageProps) {
  const params = (await searchParams) ?? {};
  const hasError = params.error === "1";

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-10 text-zinc-100">
      <section className="mx-auto w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900/70 p-8 shadow-2xl">
        <p className="text-xs uppercase tracking-[0.22em] text-zinc-400">Riwaayat Studio</p>
        <h1 className="mt-2 text-3xl font-semibold">Admin Login</h1>
        <p className="mt-2 text-sm text-zinc-300">
          Sign in to manage products, stock status, payments, and contact settings.
        </p>

        {hasError ? (
          <p className="mt-4 rounded-lg border border-red-500/60 bg-red-500/10 px-3 py-2 text-sm text-red-200">
            Invalid username or password.
          </p>
        ) : null}

        <form action={loginAction} className="mt-6 space-y-4">
          <label className="block text-sm">
            <span className="mb-1 block text-zinc-200">Username</span>
            <input
              required
              name="username"
              type="text"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 outline-none ring-amber-300 focus:ring"
            />
          </label>

          <label className="block text-sm">
            <span className="mb-1 block text-zinc-200">Password</span>
            <input
              required
              name="password"
              type="password"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 outline-none ring-amber-300 focus:ring"
            />
          </label>

          <button
            type="submit"
            className="w-full rounded-lg bg-amber-500 px-4 py-2 font-semibold text-zinc-900 transition hover:bg-amber-400"
          >
            Sign In
          </button>
        </form>

        <p className="mt-4 text-xs text-zinc-400">
          Tip: set <code>ADMIN_USERNAME</code> and <code>ADMIN_PASSWORD</code> in your environment variables.
        </p>

        <Link href="/" className="mt-5 inline-block text-sm text-amber-300 hover:text-amber-200">
          ← Back to Store
        </Link>
      </section>
    </main>
  );
}
