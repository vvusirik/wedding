import styles from "./page.module.css";

const sections = [
  {
    title: "Venue",
    icon: "📍",
    iconBg: "bg-terracotta/10",
    divider: "border-terracotta/30",
    content: (
      <>
        <p className="text-foreground/80 leading-relaxed">
          <strong>The Bowden</strong>
          <br />
          1775 Keller Pkwy
          <br />
          Keller, TX, 76248
        </p>
        <p className="mt-3 text-foreground/70 text-sm">
          Parking is available on site.
        </p>
      </>
    ),
  },
  {
    title: "Nearest Airports",
    icon: "✈️",
    iconBg: "bg-brick/10",
    divider: "border-brick/30",
    content: (
      <ul className="space-y-3 text-foreground/80">
        <li>
          <strong>Dallas Fort Worth (DFW)</strong> — 20 minutes driving from
          venue
          <br />
          <span className="text-sm text-taupe">
            Recommended — closest and has the most direct flights
          </span>
        </li>
        <li>
          <strong>Dallas Lovefield</strong> — 35 minutes driving from venue
          <br />
        </li>
      </ul>
    ),
  },
  {
    title: "Recommended Hotels",
    icon: "🏨",
    iconBg: "bg-forest/10",
    divider: "border-forest/30",
    content: (
      <div className="space-y-4">
        <div
          className={`${styles.hotelCard} hover:border-forest hover:shadow-md transition-all`}
        >
          <p className={styles.hotelName}>
            <a href="https://withjoy.com/stays/bbfb6c30-b2d1-454d-94a7-ecc51ad9cfd9?eventId=59f6056a-eae2-59d5-b2e5-5486e40e3dab&provider=nuitee&checkIn=2026-10-16&checkOut=2026-10-18&currency=USD">
              Hilton Dallas | Southlake Town Square
            </a>
          </p>
          <p className={styles.hotelAddress}>
            1400 Plaza Pl, Southlake, TX 76092
          </p>
          <p className={styles.hotelNote}>
            10 minute drive from The Bowden. There is a discounted rate for this
            hotel when booking via WithJoy.
          </p>
        </div>
        <div
          className={`${styles.hotelCard} hover:border-forest hover:shadow-md transition-all`}
        >
          <p className={styles.hotelName}>
            <a href="https://withjoy.com/stays/4872f7e9-e5a4-409a-94e9-e48b74313d62?eventId=59f6056a-eae2-59d5-b2e5-5486e40e3dab&provider=nuitee&checkIn=2026-10-16&checkOut=2026-10-18&currency=USD">
              Hampton Inn & Suites Keller Town Center
            </a>
          </p>
          <p className={styles.hotelAddress}>
            200 Town Center Lane Keller, Texas 76248
          </p>
          <p className={styles.hotelNote}>
            2 minute drive from The Bowden. There is a discounted rate for this
            hotel when booking via WithJoy.
          </p>
        </div>
        <div
          className={`${styles.hotelCard} hover:border-forest hover:shadow-md transition-all`}
        >
          <p className={styles.hotelName}>
            <a href="https://www.marriott.com/en-us/hotels/dfwdl-delta-hotels-dallas-southlake/overview/">
              Delta Hotels Dallas Southlake
            </a>
          </p>
          <p className={styles.hotelAddress}>
            251 E State Hwy 114, Southlake, TX 76092
          </p>
          <p className={styles.hotelNote}>10 minute drive from The Bowden</p>
        </div>
        <div
          className={`${styles.hotelCard} hover:border-forest hover:shadow-md transition-all`}
        >
          <p className={styles.hotelName}>
            <a href="https://www.marriott.com/en-us/hotels/dalwl-the-ricardo-marriott-dfw-westlake/overview/?cid=AFF_Affiliate">
              The Marriott DFW - The Ricardo
            </a>
          </p>
          <p className={styles.hotelAddress}>
            1301 Solana Blvd Building 3, Westlake, TX 76262
          </p>
          <p className={styles.hotelNote}>15 minute drive from The Bowden</p>
        </div>
      </div>
    ),
  },
  {
    title: "Getting Around",
    icon: "🚗",
    iconBg: "bg-taupe/10",
    divider: "border-taupe/30",
    content: (
      <ul className="list-disc list-inside space-y-2 text-foreground/80">
        <li>Rideshare services (Uber / Lyft) are available in the area.</li>
        <li>Rental cars available at the airport.</li>
      </ul>
    ),
  },
  {
    title: "Activities",
    icon: "🎭",
    iconBg: "bg-coral/10",
    divider: "border-coral/30",
    content: (
      <div>
        <p className="text-foreground/80 leading-relaxed">
          If you have some time to explore, here are some of Vishal and Hanna's
          suggested spots:
        </p>
        {/* TODO: map of activities */}
      </div>
    ),
  },
];

export default function TravelPage() {
  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>Travel</h1>
      <div className={styles.divider} />
      <p className={styles.intro}>
        We want to make it as easy as possible for you to join us. Here&rsquo;s
        everything you need to know to get here.
      </p>

      <div className="space-y-10">
        {sections.map((section) => (
          <div key={section.title}>
            <h2 className={styles.sectionHeading}>
              <span className={`${styles.iconCircle} ${section.iconBg}`}>
                {section.icon}
              </span>
              {section.title}
            </h2>
            <div
              className={`${styles.sectionBody} border-t ${section.divider}`}
            >
              {section.content}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
