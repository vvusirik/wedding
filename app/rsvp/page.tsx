import Image from "next/image";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import styles from "./page.module.css";

export default async function RsvpPage() {
    const cookieStore = await cookies();
    const guestRaw = cookieStore.get("wedding-guest")?.value;
    let slug = "";
    if (guestRaw) {
        try {
            const parsed = JSON.parse(guestRaw);
            if (typeof parsed.slug === "string") slug = parsed.slug.trim();
        } catch {
            // fall through to landing
        }
    }
    if (slug) redirect(`/rsvp/${slug}`);

    return (
        <div className={styles.page}>
            <h1 className={styles.heading}>Responde Sil Vous Plait</h1>
            <div className={styles.envelopeWrap}>
                <Image
                    src="/images/envelope-no-text.png"
                    alt=""
                    width={800}
                    height={494}
                    className={styles.envelope}
                    priority
                />
            </div>
            <p className={styles.reminder}>
                Please use the personalized link from your invitation to RSVP. <br />
                Replies appreciated by July 1st.
            </p>
        </div>
    );
}
