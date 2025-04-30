"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoIcon from "./icons/logo";
import { menuItems } from "@/lib/constants";
import { Separator } from "./ui/separator";

export const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex fixed top-0 left-0 h-screen w-48 text-white flex-col py-4 z-40 overflow-y-auto border-r border-zinc-800 space-y-4">
      <div className="px-4 space-y-2">
        <Link href="/">
          <LogoIcon size={60} />
        </Link>
        <Separator />
      </div>

      <nav className="flex flex-col gap-6 px-2">
        {menuItems.map((group) => (
          <div key={group.group}>
            <div className="text-[11px] text-zinc-400 uppercase tracking-wide px-2 mb-2">
              {group.group}
            </div>

            <div className="flex flex-col gap-1">
              {group.links.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors hover:bg-card ${
                    pathname === href ? "bg-card text-brand" : "text-white"
                  }`}
                >
                  <Icon size={18} />
                  <span>{label}</span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
};
