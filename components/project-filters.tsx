"use client";

import { useRouter } from "next/navigation";

interface ProjectFiltersProps {
  activeStatus: string;
  activeType: string;
  activeLocation: string;
}

export function ProjectFilters({
  activeStatus,
  activeType,
  activeLocation,
}: ProjectFiltersProps) {
  const router = useRouter();

  function changeType(type: string) {
    const query = new URLSearchParams();
    if (activeStatus !== "all") query.set("status", activeStatus);
    if (type !== "all") query.set("type", type);
    if (activeLocation !== "all") query.set("location", activeLocation);
    router.push(query.size ? `/projects?${query}` : "/projects");
  }

  return (
    <label className="type-filter">
      <span>Project type</span>
      <select
        aria-label="Filter projects by type"
        value={activeType}
        onChange={(event) => changeType(event.target.value)}
      >
        <option value="all">All opportunities</option>
        <option value="land-share">Land-share</option>
        <option value="flat-share">Flat-share</option>
      </select>
    </label>
  );
}
