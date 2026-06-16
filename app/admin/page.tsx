"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";

type Member = { firstName: string; lastName: string };

type Party = {
    slug: string;
    email: string;
    envelopeName: string;
    tags: string[];
    head: Member;
    otherMembers: Member[];
    status: "not_sent" | "sent" | "rsvp_received";
};

const STATUS_LABEL: Record<Party["status"], string> = {
    not_sent: "Not Sent",
    sent: "Sent",
    rsvp_received: "RSVP Received",
};

const STATUS_CLASS: Record<Party["status"], string> = {
    not_sent: styles.statusNotSent,
    sent: styles.statusSent,
    rsvp_received: styles.statusReceived,
};

export default function AdminPage() {
    const [authed, setAuthed] = useState(false);
    const [pw, setPw] = useState("");
    const [parties, setParties] = useState<Party[]>([]);
    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState<string | null>(null);
    const [previewHtml, setPreviewHtml] = useState<string | null>(null);
    const [localStatus, setLocalStatus] = useState<Record<string, Party["status"]>>({});

    function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        if (pw === "vishanna_admin") setAuthed(true);
        else alert("Incorrect password");
    }

    useEffect(() => {
        if (!authed) return;
        setLoading(true);
        fetch("/api/admin/guests")
            .then((r) => r.json())
            .then((data) => setParties(data))
            .finally(() => setLoading(false));
    }, [authed]);

    async function sendInvite(party: Party) {
        setSending(party.slug);
        const res = await fetch("/api/admin/send", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                firstName: party.head.firstName,
                email: party.email,
                slug: party.slug,
            }),
        });
        if (res.ok) {
            setLocalStatus((prev) => ({ ...prev, [party.slug]: "sent" }));
        } else {
            alert("Failed to send email");
        }
        setSending(null);
    }

    async function previewInvite(party: Party) {
        const res = await fetch("/api/admin/preview?" + new URLSearchParams({
            firstName: party.head.firstName,
        }));
        const html = await res.text();
        setPreviewHtml(html);
    }

    function getStatus(party: Party): Party["status"] {
        return localStatus[party.slug] ?? party.status;
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
                    <button type="submit" className={styles.loginButton}>Enter</button>
                </form>
            </div>
        );
    }

    return (
        <div className={styles.page}>
            <h1 className={styles.heading}>Guest List</h1>

            {loading && <p className={styles.loading}>Loading…</p>}

            {!loading && (
                <div className={styles.tableWrap}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th className={styles.th}>Party Head</th>
                                <th className={styles.th}>Email</th>
                                <th className={styles.th}>Slug</th>
                                <th className={styles.th}>Other Members</th>
                                <th className={styles.th}>Status</th>
                                <th className={styles.th}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {parties.map((party) => {
                                const status = getStatus(party);
                                return (
                                    <tr key={party.slug} className={styles.tr}>
                                        <td className={styles.td}>
                                            {party.head.firstName} {party.head.lastName}
                                            {party.envelopeName && (
                                                <span className={styles.envelope}>{party.envelopeName}</span>
                                            )}
                                        </td>
                                        <td className={styles.td}>{party.email || <span className={styles.empty}>—</span>}</td>
                                        <td className={styles.td}><code className={styles.slug}>{party.slug}</code></td>
                                        <td className={styles.td}>
                                            {party.otherMembers.length > 0
                                                ? party.otherMembers.map((m) => `${m.firstName} ${m.lastName}`).join(", ")
                                                : <span className={styles.empty}>—</span>}
                                        </td>
                                        <td className={styles.td}>
                                            <span className={`${styles.status} ${STATUS_CLASS[status]}`}>
                                                {STATUS_LABEL[status]}
                                            </span>
                                        </td>
                                        <td className={styles.td}>
                                            <div className={styles.actions}>
                                                <button
                                                    className={styles.btnPreview}
                                                    onClick={() => previewInvite(party)}
                                                    disabled={!party.email}
                                                >
                                                    Preview
                                                </button>
                                                <button
                                                    className={styles.btnSend}
                                                    onClick={() => sendInvite(party)}
                                                    disabled={!party.email || sending === party.slug || status === "rsvp_received"}
                                                >
                                                    {sending === party.slug ? "Sending…" : "Send"}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {previewHtml && (
                <div className={styles.previewOverlay} onClick={() => setPreviewHtml(null)}>
                    <div className={styles.previewModal} onClick={(e) => e.stopPropagation()}>
                        <button className={styles.previewClose} onClick={() => setPreviewHtml(null)}>×</button>
                        <iframe
                            srcDoc={previewHtml}
                            className={styles.previewFrame}
                            title="Email preview"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
