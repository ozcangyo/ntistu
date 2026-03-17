import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function AdminHome() {
  const session = await getServerSession(authOptions);
  if (session?.user.role !== "ADMIN") return <main className="container-page">Forbidden</main>;
  return <main className="container-page card"><h1 className="text-xl font-bold">Admin</h1>
  <div className="flex gap-3 mt-3"><Link className="btn" href="/admin/medications">Medications</Link><Link className="btn" href="/admin/logs">Audit logs</Link></div></main>;
}
