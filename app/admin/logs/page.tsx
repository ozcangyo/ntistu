import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function LogsPage() {
  const session = await getServerSession(authOptions);
  if (session?.user.role !== "ADMIN") return <main className="container-page">Forbidden</main>;
  const logs = await prisma.adminLog.findMany({ take: 100, orderBy: { createdAt: "desc" }, include: { adminUser: true } });
  return <main className="container-page card"><h1 className="text-xl font-bold">Admin logs</h1>
    <ul className="list-disc ml-5">{logs.map((l: any)=><li key={l.id}>{l.createdAt.toISOString()} {l.adminUser.email} {l.action} {l.entity}#{l.entityId}</li>)}</ul>
  </main>;
}
