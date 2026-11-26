import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import { constructionStatusLabel, type ConstructionView } from "@/lib/constructions";
import { cn } from "@/lib/utils";

/** Card with a diagonal status ribbon and a white caption panel (no gradients). */
export function ConstructionCard({ item, priority = false }: { item: ConstructionView; priority?: boolean }) {
  return (
    <Link
      href={`/construction/${item.slug}`}
      className="group relative block aspect-[4/5] overflow-hidden rounded-[24px] bg-navy-900 outline-none ring-brand-purple focus-visible:ring-4 lg:rounded-[28px]"
    >
      <Image
        src={item.coverImage}
        alt={item.title}
        fill
        priority={priority}
        sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
        className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105"
      />

      {/* Diagonal status ribbon */}
      <span
        className={cn(
          "absolute -right-12 top-7 w-48 rotate-45 py-1.5 text-center text-[11px] font-extrabold uppercase tracking-[0.2em] text-white shadow-md",
          item.status === "completed" ? "bg-navy-900" : "bg-brand-purple",
        )}
      >
        {constructionStatusLabel[item.status]}
      </span>

      {/* Caption */}
      <div className="absolute inset-x-3 bottom-3 flex items-center gap-3 rounded-2xl bg-white p-4 shadow-[0_12px_30px_-12px_rgba(17,20,58,0.45)] sm:inset-x-4 sm:bottom-4">
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-[17px] font-extrabold uppercase tracking-tight text-navy-900 sm:text-[18px]">
            {item.title}
          </h3>
          <p className="mt-1 flex items-center gap-1.5 text-[13.5px] font-medium text-slate-500">
            <MapPin className="size-3.5 shrink-0 text-brand-purple" aria-hidden="true" />
            <span className="truncate">{item.location}</span>
          </p>
        </div>
        <span
          aria-hidden="true"
          className="grid size-10 shrink-0 place-items-center rounded-full bg-brand-purple text-white transition-transform duration-500 group-hover:rotate-45"
        >
          <ArrowUpRight className="size-5" />
        </span>
      </div>
    </Link>
  );
}
