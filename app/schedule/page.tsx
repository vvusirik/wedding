import styles from "./page.module.css";

const events = [
  {
    day: "Thursday, October 15",
    title: "Haldi",
    time: "12:00 PM - 3:00 PM",
    location: "Frisco, TX",
    description:
      "Please join us at the Vusirikala's home for the colorful pre-wedding Indian ceremony, Haldi! Haldi is the Hindi word for turmeric, an ingredient known for its healing and purification properties. This ceremony prominently involves turmeric yellow colors and a ritual where Haldi paste is applied to the bride and groom to ward off the Buri Nazar, the Sanskrit term for evil eye.",
    borderColor: "border-turmeric",
    titleColor: "text-turmeric",
    dotColor: "bg-turmeric",
  },
  {
    day: "Thursday, October 15",
    title: "Mehndi",
    time: "6:00 PM – 10:00 PM",
    location: "Frisco, TX",
    description:
      "Please join us at the Vusirikala residence for the Mehndi! Mehndi is a ceremony meant to symbolize prosperity and joy in the couple's marriage. Mehndi, or henna, refers to the paste used to intricately decorate the bride's hands and feet. Guests are also welcome to get henna done at this event.",
    borderColor: "border-terracotta",
    titleColor: "text-terracotta",
    dotColor: "bg-terracotta",
  },
  {
    day: "Friday, October 16",
    title: "Welcome Dinner",
    time: "TBD",
    location: "TBD",
    description: "",
    borderColor: "border-forest",
    titleColor: "text-forest",
    dotColor: "bg-forest",
  },
  {
    day: "Saturday, October 17",
    title: "Baraat",
    time: "10:00 AM - 11:00 AM",
    location: "The Bowden - Entrance",
    description:
      "Kick off the wedding with us in style! We'll welcome the groom during Baraat as he rides in with live music and dancing.",
    borderColor: "border-forest",
    titleColor: "text-forest",
    dotColor: "bg-forest",
  },
  {
    day: "Saturday, October 17",
    title: "Hindu Ceremony",
    time: "11:00 AM – 1:00 PM",
    location: "The Bowden - Main Hall",
    description:
      "The Vusirikala family invites you to join as Vishal and Hanna take part in traditional Indian wedding rituals under the Mandaap in the main hall of the Bowden.",
    borderColor: "border-forest",
    titleColor: "text-forest",
    dotColor: "bg-forest",
  },
  {
    day: "Saturday, October 17",
    title: "Lunch",
    time: "1:00 PM - 3:00 PM",
    location: "The Bowden - Main Hall",
    description: "",
    borderColor: "border-taupe",
    titleColor: "text-taupe",
    dotColor: "bg-taupe",
  },
  {
    day: "Saturday, October 17",
    title: "Jewish Ceremony",
    time: "5:00 PM – 6:00 PM",
    location: "The Bowden - Chapel",
    description:
      "The Greenfield family invites you to join Vishal and Hanna for a Jewish wedding ceremony under the chuppah. The ceremony includes the signing of the ketubah (marriage contract), exchange of rings, and the breaking of the glass.",
    borderColor: "border-cerulean",
    titleColor: "text-cerulean",
    dotColor: "bg-cerulean",
  },
  {
    day: "Saturday, October 17",
    title: "Cocktail Hour",
    time: "6:00 PM – 7:00 PM",
    location: "The Bowden - Patio",
    description:
      "Come mingle with us and other guests following the Jewish ceremony! Light snacks and drinks will be provided.",
    borderColor: "border-brick",
    titleColor: "text-brick",
    dotColor: "bg-brick",
  },
  {
    day: "Saturday, October 17",
    title: "Reception",
    time: "7:00 PM – 10:00 PM",
    location: "The Bowden",
    description:
      "Dance and dine with us as we end the night with dinner, speeches, a few performances, and a sendoff for Vishal and Hanna!",
    borderColor: "border-brick",
    titleColor: "text-brick",
    dotColor: "bg-brick",
  },
];

export default function SchedulePage() {
  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>Schedule</h1>
      <div className={styles.divider} />

      <div className="space-y-10">
        {events.map((event, i) => (
          <div key={i} className={`${styles.event} ${event.borderColor}`}>
            <div className={styles.dayRow}>
              <span className={`${styles.dot} ${event.dotColor}`} />
              <p className={styles.day}>{event.day}</p>
            </div>
            <h2 className={`${styles.title} ${event.titleColor}`}>
              {event.title}
            </h2>
            <p className={styles.meta}>
              {event.time} &nbsp;·&nbsp; {event.location}
            </p>
            {event.description && (
              <p className={styles.description}>{event.description}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
