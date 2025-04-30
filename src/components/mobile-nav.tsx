"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import LogoIcon from "./icons/logo";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { menuItems } from "@/lib/constants";

export const MobileNav = () => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="lg:hidden relative z-50">
      <div className="flex justify-between items-center p-4 bg-zinc-900 text-white">
        <LogoIcon size={40} />
        <button onClick={() => setOpen((prev) => !prev)}>
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {open && (
        <div
          ref={menuRef}
          className="absolute right-4 top-16 w-56 bg-zinc-800 shadow-lg rounded-lg p-4 space-y-4"
        >
          {menuItems.map((group) => (
            <div key={group.group}>
              <div className="text-xs uppercase text-zinc-400 tracking-wide mb-2">
                {group.group}
              </div>
              <div className="flex flex-col gap-2">
                {group.links.map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setOpen(false)}
                    className={`text-sm px-2 py-1 rounded-md hover:bg-zinc-700 transition ${
                      pathname === href ? "text-brand" : "text-white"
                    }`}
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
