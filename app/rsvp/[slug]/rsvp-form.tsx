"use client";

import { useMemo, useState } from "react";
import styles from "./page.module.css";

type Member = { firstName: string; lastName: string; tags: string[] };

type Props = {
    slug: string;
    party: Member[];
    alreadySubmitted: boolean;
};

const EVENT_ORDER = [
    "morning",
    "evening",
    "reception",
] as const;
const EVENT_LABELS: Record<string, string> = {
    morning: "Morning Ceremony",
    evening: "Evening Ceremony",
    reception: "Reception",
};
const EVENT_TIMES: Record<string, string> = {
    morning: "Starts at 10 AM",
    evening: "Starts at 5 PM",
    reception: "6 PM Cocktail Hour · 7 PM Reception",
};
// Which guest tag grants an invitation to each event row.
// Both evening ceremony and reception are unlocked by the "evening" tag.
const EVENT_INVITED_BY: Record<string, string> = {
    morning: "morning",
    evening: "evening",
    reception: "evening",
};

type Decision = "accept" | "decline" | null;

export function RsvpForm({ slug, party, alreadySubmitted }: Props) {
    const [decision, setDecision] = useState<Decision>(null);

    // Per-member attendance: { memberIndex: { eventRow: bool } }
    const [attending, setAttending] = useState<
        Record<number, Record<string, boolean>>
    >(() => {
        const init: Record<number, Record<string, boolean>> = {};
        party.forEach((m, i) => {
            init[i] = {};
            for (const row of EVENT_ORDER) {
                if (m.tags.includes(EVENT_INVITED_BY[row])) init[i][row] = true;
            }
        });
        return init;
    });

    // Party-level
    const [email, setEmail] = useState("");
    const [dietaryNotes, setDietaryNotes] = useState("");
    const [songRequest, setSongRequest] = useState("");
    const [message, setMessage] = useState("");

    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [submitted, setSubmitted] = useState(false);

    // Only show event rows that at least one member is invited to
    const visibleEvents = useMemo(() => {
        return EVENT_ORDER.filter((e) =>
            party.some((m) => m.tags.includes(EVENT_INVITED_BY[e])),
        );
    }, [party]);

    function toggle(memberIdx: number, tag: string) {
        setAttending((prev) => ({
            ...prev,
            [memberIdx]: { ...prev[memberIdx], [tag]: !prev[memberIdx]?.[tag] },
        }));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (decision === null) {
            setError("Please choose Accept or Decline.");
            return;
        }
        setError(null);
        setSubmitting(true);
        try {
            const accepting = decision === "accept";
            const body = {
                slug,
                email: email.trim(),
                dietaryNotes: accepting ? dietaryNotes.trim() : "",
                songRequest: accepting ? songRequest.trim() : "",
                message: message.trim(),
                members: party.map((m, i) => {
                    const eventsAttending = accepting
                        ? visibleEvents.filter(
                            (t) => m.tags.includes(t) && attending[i]?.[t],
                        )
                        : [];
                    return {
                        firstName: m.firstName,
                        lastName: m.lastName,
                        attending: accepting && eventsAttending.length > 0,
                        eventsAttending,
                    };
                }),
            };
            const minDelay = new Promise((r) => setTimeout(r, 600));
            const [res] = await Promise.all([
                fetch("/api/rsvp", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body),
                }),
                minDelay,
            ]);
            if (!res.ok) {
                const txt = await res.text();
                throw new Error(txt || `submission failed (${res.status})`);
            }
            setSubmitted(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : "submission failed");
        } finally {
            setSubmitting(false);
        }
    }

    if (submitted) {
        return (
            <div className={styles.success}>
                <h2 className={styles.successHeading}>Thank you!</h2>
                <p className={styles.successBody}>
                    {decision === "accept"
                        ? "Your response is in. We can’t wait to see you."
                        : "Thank you for letting us know. We’ll miss you."}
                </p>
            </div>
        );
    }

    return (
        <form
            className={styles.form}
            onSubmit={handleSubmit}
            onKeyDown={(e) => {
                if (
                    e.key === "Enter" &&
                    (e.target as HTMLElement).tagName === "INPUT"
                ) {
                    e.preventDefault();
                }
            }}
        >
            <div className={styles.decisionGroup}>
                <button
                    type="button"
                    className={`${styles.decisionChoice} ${styles.decisionAccept} ${decision === "accept" ? styles.decisionActive : ""}`}
                    onClick={() => setDecision("accept")}
                    aria-pressed={decision === "accept"}
                >
                    Joyfully accept
                </button>
                <button
                    type="button"
                    className={`${styles.decisionChoice} ${styles.decisionDecline} ${decision === "decline" ? styles.decisionActive : ""}`}
                    onClick={() => setDecision("decline")}
                    aria-pressed={decision === "decline"}
                >
                    Regretfully decline
                </button>
            </div>

            {decision === "accept" && (
                <div className={styles.gridScroll}>
                    <table className={styles.grid}>
                        <thead>
                            <tr>
                                <th className={styles.gridCornerCell} />
                                {party.map((m) => (
                                    <th
                                        key={`${m.firstName}-${m.lastName}`}
                                        className={styles.gridMemberHeader}
                                    >
                                        {m.firstName}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {visibleEvents.map((tag) => (
                                <tr key={tag}>
                                    <th scope="row" className={styles.gridEventHeader}>
                                        <span className={styles.gridEventName}>
                                            {EVENT_LABELS[tag]}
                                        </span>
                                        <span className={styles.gridEventTime}>
                                            {EVENT_TIMES[tag]}
                                        </span>
                                    </th>
                                    {party.map((m, i) => {
                                        const invited = m.tags.includes(EVENT_INVITED_BY[tag]);
                                        return (
                                            <td key={`${tag}-${i}`} className={styles.gridCheckCell}>
                                                {invited ? (
                                                    <label className={styles.gridCheckLabel}>
                                                        <input
                                                            type="checkbox"
                                                            className={styles.visuallyHiddenCheckbox}
                                                            checked={!!attending[i]?.[tag]}
                                                            onChange={() => toggle(i, tag)}
                                                            aria-label={`${m.firstName} attending ${EVENT_LABELS[tag]}`}
                                                        />
                                                        <span
                                                            className={styles.checkIndicator}
                                                            aria-hidden="true"
                                                        />
                                                    </label>
                                                ) : (
                                                    <span className={styles.gridDash}>—</span>
                                                )}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {decision !== null && (
                <>
                    <div className={styles.field}>
                        <label className={styles.fieldLabel} htmlFor="email">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            className={styles.input}
                            placeholder="For RSVP confirmation"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    {decision === "accept" && (
                        <>
                            <div className={styles.field}>
                                <label className={styles.fieldLabel} htmlFor="dietary">
                                    Dietary Notes
                                </label>
                                <input
                                    id="dietary"
                                    type="text"
                                    className={styles.input}
                                    placeholder="Any allergies or restrictions in your party"
                                    value={dietaryNotes}
                                    onChange={(e) => setDietaryNotes(e.target.value)}
                                />
                            </div>
                            <div className={styles.field}>
                                <label className={styles.fieldLabel} htmlFor="song">
                                    Song Request
                                </label>
                                <input
                                    id="song"
                                    type="text"
                                    className={styles.input}
                                    placeholder="Help us build the playlist"
                                    value={songRequest}
                                    onChange={(e) => setSongRequest(e.target.value)}
                                />
                            </div>
                        </>
                    )}

                    <div className={styles.field}>
                        <label className={styles.fieldLabel} htmlFor="message">
                            A Note to Us
                        </label>
                        <textarea
                            id="message"
                            className={styles.textarea}
                            placeholder="Drop us a note"
                            rows={4}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                    </div>
                </>
            )}

            {error && <p className={styles.error}>{error}</p>}

            {decision !== null && (
                <>
                    <button type="submit" className={styles.button} disabled={submitting}>
                        {submitting ? (
                            <span className={styles.buttonLoading}>
                                <span className={styles.spinner} aria-hidden="true" />
                                Sending
                            </span>
                        ) : alreadySubmitted ? (
                            "Update RSVP"
                        ) : (
                            "Submit RSVP"
                        )}
                    </button>
                    {alreadySubmitted && (
                        <p className={styles.updateHint}>
                            We already have your RSVP &mdash; resubmit to update.
                        </p>
                    )}
                </>
            )}
        </form>
    );
}
