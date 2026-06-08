import Image from "next/image";
import styles from "./page.module.css";

// Paste the iframe `src` from Google My Maps (Share → Embed on my site).
// Leave empty to hide the map until it's ready.
const ACTIVITIES_MAP_EMBED_URL =
    "https://www.google.com/maps/d/u/2/embed?mid=1rZg7ePLJVyV9P9joGevZoNpPdlhGACk&ehbc=2E312F&noprof=1";

const sections = [
    {
        title: "Venue",
        divider: "border-terracotta/30",
        content: (
            <>
                <p className="leading-relaxed">
                    <a href="https://maps.app.goo.gl/gjbZ7UGEL6KSnmDk9">
                        <strong>The Bowden</strong>
                    </a>
                    <br />
                    1775 Keller Pkwy
                    <br />
                    Keller, TX, 76248
                </p>
                <p className="mt-3">
                    Parking is available on site.
                </p>
                <Image
                    src="/images/icons/bowden.png"
                    alt="The Bowden illustration"
                    width={900}
                    height={400}
                    className={styles.bowdenIllustration}
                />
            </>
        ),
    },
    {
        title: "Nearest Airports",
        divider: "border-brick/30",
        content: (
            <>
                <ul className="space-y-3">
                    <li>
                        <strong>Dallas Fort Worth (DFW)</strong> - 20 minutes driving from
                        venue
                        <br />
                        <span className="text-sm text-taupe">
                            Recommended - closest and has the most direct flights
                        </span>
                    </li>
                    <li>
                        <strong>Dallas Lovefield (DAL)</strong> - 35 minutes driving from
                        venue
                        <br />
                    </li>
                </ul>
                <Image
                    src="/images/icons/plane.png"
                    alt=""
                    width={320}
                    height={320}
                    className={styles.planeIcon}
                />
            </>
        ),
    },
    {
        title: "Recommended Hotels",
        divider: "border-forest/30",
        content: (
            <>
                <p className={`${styles.hotelTextBody} text-foreground/80 mb-4`}>
                    For guests traveling from out of town, there are several hotels in
                    Southlake near the Bowden. Airbnb also has listings in the area which
                    can be good for larger groups planning on staying together.
                </p>
                <div className="space-y-4">
                    <a
                        className={`${styles.hotelCard} hover:border-forest hover:shadow-md transition-all`}
                        href="https://withjoy.com/stays/bbfb6c30-b2d1-454d-94a7-ecc51ad9cfd9?eventId=59f6056a-eae2-59d5-b2e5-5486e40e3dab&provider=nuitee&checkIn=2026-10-16&checkOut=2026-10-18&currency=USD"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <p className={styles.hotelName}>
                            Hilton Dallas - Southlake Town Square
                        </p>
                        <p className={styles.hotelAddress}>
                            1400 Plaza Pl, Southlake, TX 76092
                        </p>
                        <p className={styles.hotelNote}>
                            10 minute drive from The Bowden. There is a discounted rate for
                            this hotel when booking via WithJoy.
                        </p>
                    </a>
                    <a
                        className={`${styles.hotelCard} hover:border-forest hover:shadow-md transition-all`}
                        href="https://withjoy.com/stays/4872f7e9-e5a4-409a-94e9-e48b74313d62?eventId=59f6056a-eae2-59d5-b2e5-5486e40e3dab&provider=nuitee&checkIn=2026-10-16&checkOut=2026-10-18&currency=USD"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <p className={styles.hotelName}>
                            Hampton Inn &amp; Suites - Keller Town Center
                        </p>
                        <p className={styles.hotelAddress}>
                            200 Town Center Lane Keller, Texas 76248
                        </p>
                        <p className={styles.hotelNote}>
                            2 minute drive from The Bowden. There is a discounted rate for
                            this hotel when booking via WithJoy.
                        </p>
                    </a>
                    <a
                        className={`${styles.hotelCard} hover:border-forest hover:shadow-md transition-all`}
                        href="https://www.marriott.com/en-us/hotels/dfwdl-delta-hotels-dallas-southlake/overview/"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <p className={styles.hotelName}>Delta Hotels - Dallas Southlake</p>
                        <p className={styles.hotelAddress}>
                            251 E State Hwy 114, Southlake, TX 76092
                        </p>
                        <p className={styles.hotelNote}>10 minute drive from The Bowden</p>
                    </a>
                    <a
                        className={`${styles.hotelCard} hover:border-forest hover:shadow-md transition-all`}
                        href="https://www.marriott.com/en-us/hotels/dalwl-the-ricardo-marriott-dfw-westlake/overview/?cid=AFF_Affiliate"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <p className={styles.hotelName}>The Marriott DFW - The Ricardo</p>
                        <p className={styles.hotelAddress}>
                            1301 Solana Blvd Building 3, Westlake, TX 76262
                        </p>
                        <p className={styles.hotelNote}>15 minute drive from The Bowden</p>
                    </a>
                </div>
            </>
        ),
    },
    {
        title: "Getting Around",
        divider: "border-taupe/30",
        content: (
            <ul className="list-disc list-inside space-y-2">
                <li>
                    Public transit is sparse to non-existent in this part of Dallas, so
                    plan to get around by car.
                </li>
                <li>Rideshare services (Uber / Lyft) are available in the area.</li>
                <li>Rental cars are available at the airport.</li>
            </ul>
        ),
    },
    {
        title: "Activities",
        divider: "border-coral/30",
        content: (
            <div>
                <p className="leading-relaxed">
                    If you have some time to explore, here are some of Vishal and
                    Hanna&rsquo;s suggested spots around the area.
                </p>
                {ACTIVITIES_MAP_EMBED_URL && (
                    <iframe
                        src={ACTIVITIES_MAP_EMBED_URL}
                        title="Map of suggested activities"
                        className={styles.mapEmbed}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        allowFullScreen
                    />
                )}
            </div>
        ),
    },
];

export default function TravelPage() {
    return (
        <div className={styles.page}>
            <h1 className={styles.heading}>Travel</h1>
            <div>
                {sections.map((section, i) => (
                    <div key={section.title}>
                        {i > 0 && <hr className={styles.divider} />}
                        <div className={styles.sectionBody}>
                            <h2 className={styles.sectionHeading}>{section.title}</h2>
                            {section.content}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
