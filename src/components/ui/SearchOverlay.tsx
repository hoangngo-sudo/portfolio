"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Dialog } from "@base-ui/react/dialog";
import { FiSearch } from "react-icons/fi";
import { searchItems, type SearchItem } from "@/lib/search";
import { smoothScrollToId } from "@/lib/scroll";
import { KeycapButton } from "@/components/ui/KeycapButton";

export function SearchOverlay() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    if (!query.trim()) return [];
    return searchItems(query);
  }, [query]);

  // Group results by section
  const grouped = useMemo(() => {
    const map = new Map<string, SearchItem[]>();
    for (const item of results) {
      const list = map.get(item.section) ?? [];
      list.push(item);
      map.set(item.section, list);
    }
    return map;
  }, [results]);

  // Cmd+K / Ctrl+K shortcut
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSelect = useCallback(
    (item: SearchItem) => {
      setOpen(false);
      setQuery("");
      if (item.href) {
        window.open(item.href, "_blank", "noopener,noreferrer");
      } else {
        // Delay scroll until after dialog unmounts
        requestAnimationFrame(() => {
          smoothScrollToId(item.sectionId);
        });
      }
    },
    []
  );

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger
        render={(props) => (
          <KeycapButton {...props}>
            <FiSearch size={14} />
            Search
            <span className="ml-2 hidden text-[10px] font-medium text-current sm:inline">
              ⌘ K
            </span>
          </KeycapButton>
        )}
      />

      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-100 bg-black/60 backdrop-blur-sm" />
        <Dialog.Popup className="fixed top-[15%] left-1/2 z-101 w-[calc(100vw-2rem)] max-w-lg -translate-x-1/2 rounded-xl border border-card-border bg-dark-bg-alt p-0 shadow-2xl">
          <div className="flex items-center gap-3 border-b border-card-border px-4 py-3">
            <FiSearch size={18} className="shrink-0 text-text-muted" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search skills, projects, courses..."
              className="flex-1 bg-transparent text-base text-text-primary outline-none placeholder:text-text-muted"
              autoFocus
            />
            <Dialog.Close className="rounded px-2 py-1 text-xs text-text-muted transition-colors hover:bg-card-hover hover:text-text-primary">
              ESC
            </Dialog.Close>
          </div>

          <div className="max-h-[60vh] overflow-y-auto p-2">
            {query.trim() && results.length === 0 && (
              <p className="px-3 py-6 text-center text-sm text-text-muted">
                No results for &ldquo;{query}&rdquo;
              </p>
            )}

            {!query.trim() && (
              <p className="px-3 py-6 text-center text-sm text-text-muted">
                Start typing to search...
              </p>
            )}

            {Array.from(grouped.entries()).map(([section, items]) => (
              <div key={section} className="mb-2">
                <p className="px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-text-muted">
                  {section}
                </p>
                {items.map((item, i) => (
                  <button
                    key={`${item.title}-${i}`}
                    onClick={() => handleSelect(item)}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-card-hover"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-text-primary">
                        {item.title}
                      </p>
                      {item.description && (
                        <p className="truncate text-xs text-text-muted">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            ))}
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
