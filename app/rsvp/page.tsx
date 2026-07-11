import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function RsvpPage() {
    const cookieStore = await cookies();
    const guestRaw = cookieStore.get("wedding-guest")?.value;
    let slug = "";
    if (guestRaw) {
        try {
            const parsed = JSON.parse(guestRaw);
            if (typeof parsed.slug === "string") slug = parsed.slug.trim();
        } catch {
            // fall through
        }
    }
    if (slug) redirect(`/rsvp/${slug}`);
    redirect("/login");
}
