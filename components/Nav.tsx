import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function Nav() {
  const session = await getServerSession(authOptions);
  return (
    <nav className="bg-white border-b">
      <div className="container-page flex gap-4 items-center">
        <Link href="/" className="font-bold">MedAI</Link>
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/chat">AI Doctor</Link>
        {session?.user?.role === "ADMIN" && <Link href="/admin">Admin</Link>}
        <div className="ml-auto text-sm text-slate-500">Educational only</div>
      </div>
    </nav>
  );
}
