"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import styles from "./page.module.css";

type Person = {
    id: string;
    firstName: string;
    lastName: string;
    partySlug: string;
    partyLabel: string;
    guestOf: string;
    declined: boolean;
};

const GUEST_OF_LABELS: Record<string, string> = {
    vishal_hanna: "Vishal & Hanna",
    murali_sapna: "Murali & Sapna",
};

function guestOfLabel(value: string): string {
    return GUEST_OF_LABELS[value] ?? value;
}

type SeatingTable = {
    id: string;
    name: string;
    guestIds: string[];
};

type GuestStatus = "yellow" | "red";

type ContextMenuState = {
    guestId: string;
    x: number;
    y: number;
};

const MIN_SEATS = 8;
const MAX_SEATS = 12;
const DRAG_MIME = "text/x-guest-id";
const TABLE_DRAG_MIME = "text/x-table-id";

function newTableId() {
    return `t-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function autosizeTextarea(el: HTMLTextAreaElement | null) {
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
}

function capacityClass(count: number): string {
    if (count === 0) return styles.capacityEmpty;
    if (count < MIN_SEATS) return styles.capacityLow;
    if (count < MAX_SEATS) return styles.capacityGood;
    return styles.capacityFull;
}

export default function SeatingChartPage() {
    const [authed, setAuthed] = useState(false);
    const [pw, setPw] = useState("");
    const [loading, setLoading] = useState(false);
    const [people, setPeople] = useState<Person[]>([]);
    const [tables, setTables] = useState<SeatingTable[]>([]);
    const [statuses, setStatuses] = useState<Record<string, GuestStatus>>({});
    const [search, setSearch] = useState("");
    const [guestOfFilter, setGuestOfFilter] = useState<string>("all");
    const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
    const [dragOverTableId, setDragOverTableId] = useState<string | null>(null);
    const [dragOverSidebar, setDragOverSidebar] = useState(false);
    const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);

    const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const skipNextSave = useRef(true);

    function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        if (pw === "vishanna_admin") setAuthed(true);
        else alert("Incorrect password");
    }

    useEffect(() => {
        if (!authed) return;
        setLoading(true);
        fetch("/api/admin/seating")
            .then((r) => r.json())
            .then((data) => {
                setPeople(data.people ?? []);
                setTables(data.tables ?? []);
                setStatuses(data.statuses ?? {});
            })
            .finally(() => setLoading(false));
    }, [authed]);

    const peopleById = useMemo(() => {
        const map = new Map<string, Person>();
        for (const p of people) map.set(p.id, p);
        return map;
    }, [people]);

    const seatedIds = useMemo(() => {
        const s = new Set<string>();
        for (const t of tables) for (const id of t.guestIds) s.add(id);
        return s;
    }, [tables]);

    const guestOfOptions = useMemo(() => {
        const values = new Set<string>();
        for (const p of people) if (p.guestOf) values.add(p.guestOf);
        return [...values].sort();
    }, [people]);

    const effectiveStatus = useCallback(
        (p: Person): GuestStatus | undefined => statuses[p.id] ?? (p.declined ? "red" : undefined),
        [statuses],
    );

    const unseatedPeople = useMemo(() => {
        const q = search.trim().toLowerCase();
        return people
            .filter((p) => !seatedIds.has(p.id))
            .filter((p) => guestOfFilter === "all" || p.guestOf === guestOfFilter)
            .filter((p) =>
                !q
                    ? true
                    : `${p.firstName} ${p.lastName} ${p.partyLabel}`.toLowerCase().includes(q),
            )
            .sort((a, b) => {
                const aRed = effectiveStatus(a) === "red" ? 1 : 0;
                const bRed = effectiveStatus(b) === "red" ? 1 : 0;
                if (aRed !== bRed) return aRed - bRed;
                return a.firstName.localeCompare(b.firstName);
            });
    }, [people, seatedIds, search, guestOfFilter, effectiveStatus]);

    const unseatedCount = useMemo(
        () => unseatedPeople.filter((p) => effectiveStatus(p) !== "red").length,
        [unseatedPeople, effectiveStatus],
    );
    const notSureCount = useMemo(
        () => unseatedPeople.filter((p) => effectiveStatus(p) === "yellow").length,
        [unseatedPeople, effectiveStatus],
    );

    // Debounced autosave whenever tables or statuses change (skip the initial load).
    useEffect(() => {
        if (skipNextSave.current) {
            skipNextSave.current = false;
            return;
        }
        if (saveTimer.current) clearTimeout(saveTimer.current);
        setSaveState("saving");
        saveTimer.current = setTimeout(async () => {
            try {
                const res = await fetch("/api/admin/seating", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ tables, statuses }),
                });
                setSaveState(res.ok ? "saved" : "error");
            } catch {
                setSaveState("error");
            }
        }, 900);
        return () => {
            if (saveTimer.current) clearTimeout(saveTimer.current);
        };
    }, [tables, statuses]);

    useEffect(() => {
        if (!contextMenu) return;
        const close = () => setContextMenu(null);
        window.addEventListener("click", close);
        window.addEventListener("scroll", close, true);
        return () => {
            window.removeEventListener("click", close);
            window.removeEventListener("scroll", close, true);
        };
    }, [contextMenu]);

    const addTable = useCallback(() => {
        setTables((prev) => [
            ...prev,
            { id: newTableId(), name: `Table ${prev.length + 1}`, guestIds: [] },
        ]);
    }, []);

    const renameTable = useCallback((tableId: string, name: string) => {
        setTables((prev) => prev.map((t) => (t.id === tableId ? { ...t, name } : t)));
    }, []);

    const deleteTable = useCallback((tableId: string) => {
        if (!confirm("Delete this table? Seated guests will move back to the unseated list.")) return;
        setTables((prev) => prev.filter((t) => t.id !== tableId));
    }, []);

    const reorderTable = useCallback((draggedId: string, targetId: string) => {
        if (draggedId === targetId) return;
        setTables((prev) => {
            const next = [...prev];
            const fromIdx = next.findIndex((t) => t.id === draggedId);
            if (fromIdx === -1) return prev;
            const [moved] = next.splice(fromIdx, 1);
            const toIdx = next.findIndex((t) => t.id === targetId);
            if (toIdx === -1) return prev;
            next.splice(toIdx, 0, moved);
            return next;
        });
    }, []);

    const unseatGuest = useCallback((guestId: string) => {
        setTables((prev) => prev.map((t) => ({ ...t, guestIds: t.guestIds.filter((id) => id !== guestId) })));
    }, []);

    const seatGuest = useCallback((guestId: string, tableId: string) => {
        setTables((prev) => {
            const target = prev.find((t) => t.id === tableId);
            if (!target) return prev;
            const alreadyThere = target.guestIds.includes(guestId);
            if (!alreadyThere && target.guestIds.length >= MAX_SEATS) {
                alert(`This table is already full (${MAX_SEATS}/${MAX_SEATS}).`);
                return prev;
            }
            return prev.map((t) => {
                const withoutGuest = t.guestIds.filter((id) => id !== guestId);
                if (t.id === tableId) return { ...t, guestIds: [...withoutGuest, guestId] };
                return { ...t, guestIds: withoutGuest };
            });
        });
    }, []);

    function openContextMenu(e: React.MouseEvent, guestId: string) {
        e.preventDefault();
        setContextMenu({ guestId, x: e.clientX, y: e.clientY });
    }

    function setStatus(guestId: string, status: GuestStatus | null) {
        setStatuses((prev) => {
            const next = { ...prev };
            if (status) next[guestId] = status;
            else delete next[guestId];
            return next;
        });
        setContextMenu(null);
    }

    function onDragStartPerson(e: React.DragEvent, guestId: string) {
        e.dataTransfer.setData(DRAG_MIME, guestId);
        e.dataTransfer.effectAllowed = "move";
    }

    function onDragStartTable(e: React.DragEvent, tableId: string) {
        e.dataTransfer.setData(TABLE_DRAG_MIME, tableId);
        e.dataTransfer.effectAllowed = "move";
    }

    function onDropOnTable(e: React.DragEvent, tableId: string) {
        e.preventDefault();
        setDragOverTableId(null);
        const draggedTableId = e.dataTransfer.getData(TABLE_DRAG_MIME);
        if (draggedTableId) {
            reorderTable(draggedTableId, tableId);
            return;
        }
        const guestId = e.dataTransfer.getData(DRAG_MIME);
        if (guestId) seatGuest(guestId, tableId);
    }

    function onDropOnSidebar(e: React.DragEvent) {
        e.preventDefault();
        setDragOverSidebar(false);
        const guestId = e.dataTransfer.getData(DRAG_MIME);
        if (guestId) unseatGuest(guestId);
    }

    function exportCsv() {
        const rows: string[][] = [["Table", "First Name", "Last Name", "Party"]];
        for (const table of tables) {
            for (const guestId of table.guestIds) {
                const p = peopleById.get(guestId);
                rows.push([table.name, p?.firstName ?? "", p?.lastName ?? "", p?.partyLabel ?? ""]);
            }
        }
        for (const p of unseatedPeopleAll(people, seatedIds)) {
            rows.push(["Unassigned", p.firstName, p.lastName, p.partyLabel]);
        }

        const csv = rows
            .map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(","))
            .join("\n");
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "seating-chart.csv";
        a.click();
        URL.revokeObjectURL(url);
    }

    if (!authed) {
        return (
            <div className={styles.loginWrap}>
                <form className={styles.loginForm} onSubmit={handleLogin}>
                    <h1 className={styles.loginHeading}>Admin</h1>
                    <input
                        type="password"
                        className={styles.loginInput}
                        placeholder="Password"
                        value={pw}
                        onChange={(e) => setPw(e.target.value)}
                        autoFocus
                    />
                    <button type="submit" className={styles.loginButton}>
                        Enter
                    </button>
                </form>
            </div>
        );
    }

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <h1 className={styles.heading}>Seating Chart</h1>
                <div className={styles.headerActions}>
                    <span className={styles.saveStatus}>
                        {saveState === "saving" && "Saving…"}
                        {saveState === "saved" && "Saved"}
                        {saveState === "error" && "Failed to save"}
                    </span>
                    <button className={styles.btnSecondary} onClick={addTable}>
                        + Add Table
                    </button>
                    <button className={styles.btnPrimary} onClick={exportCsv}>
                        Export CSV
                    </button>
                </div>
            </div>

            {loading ? (
                <p className={styles.loading}>Loading…</p>
            ) : (
                <div className={styles.layout}>
                    <aside
                        className={`${styles.sidebar} ${dragOverSidebar ? styles.sidebarDragOver : ""}`}
                        onDragOver={(e) => {
                            e.preventDefault();
                            setDragOverSidebar(true);
                        }}
                        onDragLeave={() => setDragOverSidebar(false)}
                        onDrop={onDropOnSidebar}
                    >
                        <input
                            className={styles.search}
                            type="text"
                            placeholder="Search guests…"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        {guestOfOptions.length > 0 && (
                            <select
                                className={styles.guestOfSelect}
                                value={guestOfFilter}
                                onChange={(e) => setGuestOfFilter(e.target.value)}
                            >
                                <option value="all">All Guests</option>
                                {guestOfOptions.map((v) => (
                                    <option key={v} value={v}>
                                        {guestOfLabel(v)}
                                    </option>
                                ))}
                            </select>
                        )}
                        <div className={styles.sidebarStats}>
                            <p className={styles.sidebarCount}>{unseatedCount} unseated</p>
                            {notSureCount > 0 && (
                                <p className={styles.sidebarCountYellow}>{notSureCount} not sure</p>
                            )}
                        </div>
                        <div className={styles.guestList}>
                            {unseatedPeople.map((p) => (
                                <div
                                    key={p.id}
                                    className={`${styles.guestChip} ${effectiveStatus(p) === "yellow" ? styles.guestChipYellow : ""} ${effectiveStatus(p) === "red" ? styles.guestChipRed : ""}`}
                                    draggable
                                    onDragStart={(e) => onDragStartPerson(e, p.id)}
                                    onContextMenu={(e) => openContextMenu(e, p.id)}
                                >
                                    <span className={styles.guestName}>
                                        {p.firstName} {p.lastName}
                                    </span>
                                    <span className={styles.guestParty}>{p.partyLabel}</span>
                                </div>
                            ))}
                            {unseatedPeople.length === 0 && (
                                <p className={styles.emptyState}>No matching guests</p>
                            )}
                        </div>
                    </aside>

                    <main className={styles.grid}>
                        {tables.map((table) => (
                            <div
                                key={table.id}
                                className={`${styles.tableCard} ${dragOverTableId === table.id ? styles.tableCardDragOver : ""}`}
                                onDragOver={(e) => {
                                    e.preventDefault();
                                    setDragOverTableId(table.id);
                                }}
                                onDragLeave={() =>
                                    setDragOverTableId((cur) => (cur === table.id ? null : cur))
                                }
                                onDrop={(e) => onDropOnTable(e, table.id)}
                            >
                                <div className={styles.tableCardHeader}>
                                    <span
                                        className={styles.dragHandle}
                                        draggable
                                        onDragStart={(e) => onDragStartTable(e, table.id)}
                                        title="Drag to reorder"
                                    >
                                        ⠿
                                    </span>
                                    <textarea
                                        className={styles.tableName}
                                        rows={1}
                                        value={table.name}
                                        ref={autosizeTextarea}
                                        onChange={(e) => {
                                            renameTable(table.id, e.target.value);
                                            autosizeTextarea(e.currentTarget);
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") e.preventDefault();
                                        }}
                                    />
                                    <span
                                        className={`${styles.capacity} ${capacityClass(table.guestIds.length)}`}
                                    >
                                        {table.guestIds.length}/{MAX_SEATS}
                                    </span>
                                    <button
                                        className={styles.tableDelete}
                                        onClick={() => deleteTable(table.id)}
                                        title="Delete table"
                                    >
                                        ×
                                    </button>
                                </div>
                                <div className={styles.seatedList}>
                                    {table.guestIds.map((guestId) => {
                                        const p = peopleById.get(guestId);
                                        if (!p) return null;
                                        return (
                                            <div
                                                key={guestId}
                                                className={styles.seatedChip}
                                                draggable
                                                onDragStart={(e) => onDragStartPerson(e, guestId)}
                                            >
                                                <span>
                                                    {p.firstName} {p.lastName}
                                                </span>
                                                <button
                                                    className={styles.seatedRemove}
                                                    onClick={() => unseatGuest(guestId)}
                                                    title="Remove from table"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        );
                                    })}
                                    {table.guestIds.length === 0 && (
                                        <p className={styles.dropHint}>Drag guests here</p>
                                    )}
                                </div>
                            </div>
                        ))}
                        {tables.length === 0 && (
                            <p className={styles.emptyState}>
                                No tables yet — click &ldquo;Add Table&rdquo; to start.
                            </p>
                        )}
                    </main>
                </div>
            )}

            {contextMenu && (
                <div
                    className={styles.contextMenu}
                    style={{ top: contextMenu.y, left: contextMenu.x }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        className={styles.contextMenuItem}
                        onClick={() => setStatus(contextMenu.guestId, "yellow")}
                    >
                        <span className={`${styles.statusDot} ${styles.statusDotYellow}`} />
                        Not Sure
                    </button>
                    <button
                        className={styles.contextMenuItem}
                        onClick={() => setStatus(contextMenu.guestId, "red")}
                    >
                        <span className={`${styles.statusDot} ${styles.statusDotRed}`} />
                        Not Coming
                    </button>
                    {statuses[contextMenu.guestId] && (
                        <button
                            className={styles.contextMenuItem}
                            onClick={() => setStatus(contextMenu.guestId, null)}
                        >
                            Clear
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}

function unseatedPeopleAll(people: Person[], seatedIds: Set<string>): Person[] {
    return people.filter((p) => !seatedIds.has(p.id));
}
