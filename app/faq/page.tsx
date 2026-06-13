import styles from "./page.module.css";

const faqs = [
    {
        question: "When is the RSVP deadline?",
        answer: (
            <p>
                Please{" "}
                <a href="/rsvp" className={styles.answerLink}>
                    RSVP
                </a>{" "}
                by August 1st. We&apos;d love to have an accurate headcount as early as
                possible to ensure everything goes smoothly. If you have any trouble
                submitting your RSVP, feel free to reach out to us directly.
            </p>
        ),
    },
    {
        question: "Will there be parking available or a shuttle to the venue?",
        answer:
            "The Bowden has ample free parking available. We will not be providing a shuttle, but The Bowden is also easily accessible via rideshare.",
    },
    {
        question: "Are there hotels nearby or any room blocks?",
        answer: (
            <p>
                Please see the{" "}
                <a href="/travel" className={styles.answerLink}>
                    Travel
                </a>{" "}
                section. There are several hotels and Airbnb options in Southlake and
                the greater DFW area. For your convenience, we have room blocks at a
                discounted rate at two of the nearby hotels and have also linked some
                discounted options for other nearby hotels.
            </p>
        ),
    },
    {
        question: "Are kids welcome?",
        answer:
            "As much as we love your little ones, we will not be including them in the ceremony or reception. Please plan accordingly.",
    },
    {
        question: "What is the gift policy?",
        answer: (
            <p>
                We do not have a registry. All we ask is that you come and have a good
                time! For those who still wish to give, please see the note in the{" "}
                <a href="/gifting" className={styles.answerLink}>
                    Gifting
                </a>{" "}
                section.
            </p>
        ),
    },
    {
        question: "What are the ceremony traditions I should know about?",
        answer: (
            <>
                <p>
                    Program handouts will be provided at both ceremonies with an outline
                    of the rituals.
                </p>
                <br />
                <p>
                    The Hindu ceremony will be performed in traditional South Indian style
                    under the auspices of a purohit (priest). Rituals include mangalsutram
                    (tying the knot) and Arundhathi darshanam (the symbol of marital
                    harmony), etc.
                </p>
                <br />
                <p>
                    The Jewish ceremony includes the signing of the Ketubah (marriage
                    contract), circling under the Chuppah, and the breaking of the glass.
                </p>
            </>
        ),
    },
    {
        question: "Will there be food for dietary restrictions?",
        answer:
            "Our reception menu will include buffet style Indian vegetarian and Western vegetarian and non-vegetarian options. Please note any dietary restrictions in your RSVP so we can try to accomodate you.",
    },
];

export default function FAQPage() {
    return (
        <div className={styles.page}>
            <h1 className={styles.heading}>Helpful Info</h1>

            <div className={styles.faqList}>
                {faqs.map((faq, i) => (
                    <details key={i} className={styles.accordion}>
                        <summary className={styles.summary}>
                            <span className={styles.question}>{faq.question}</span>
                            <span className={styles.expandIcon}>+</span>
                        </summary>
                        <div className={styles.answer}>{faq.answer}</div>
                    </details>
                ))}
            </div>
        </div>
    );
}
