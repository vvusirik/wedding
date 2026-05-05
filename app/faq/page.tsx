import styles from "./page.module.css";

const faqs = [
    {
        question: "What is the dress code?",
        answer: (
            <>
                <p>
                    We&apos;d love for guests to embrace the festive spirit of our
                    cultural celebrations!
                </p>
                <ul className={styles.answerList}>
                    <li>
                        For the Mehndi and Sangeet: colorful semi-formal attire is
                        encouraged — think bright salwar kameez, lehengas, sarees, or
                        cocktail dresses in jewel tones.
                    </li>
                    <li>
                        For the ceremonies and reception: formal attire is requested. Guests
                        are welcome to wear Indian, Western, or fusion formal wear.
                    </li>
                    <li>
                        Please avoid white (reserved for Jewish ceremony traditions) and
                        black if possible.
                    </li>
                </ul>
            </>
        ),
    },
    {
        question: "When is the RSVP deadline?",
        answer:
            "Please RSVP by July 1st. We'd love to have an accurate headcount as early as possible to ensure everything goes smoothly. If you have any trouble submitting your RSVP, feel free to reach out to us directly.",
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
                the greater DFW area. We do not have a room block, but we have linked
                some discounted options for nearby hotels when you use the website
                referral link.
            </p>
        ),
    },
    {
        question: "Are kids welcome?",
        answer:
            "As much as we love your little ones, we will not be including them in the ceremony or reception. Please make arrangements for childcare if necessary.",
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
        question: "Can I take photos during the events?",
        answer:
            "Yes! We would love for you to take photos and share them. However, please refrain from taking photos during the Indian and Jewish ceremonies in particular.",
    },
    {
        question: "What are the ceremony traditions I should know about?",
        answer:
            "Programs will be provided at both ceremonies to guide guests through the rituals. The Hindu ceremony includes rituals like the Ganesh Puja and Saptapadi (seven vows around the sacred fire). The Jewish ceremony includes the signing of the Ketubah (marriage contract), circling under the Chuppah, and the breaking of the glass.",
    },
    {
        question: "Will there be food for dietary restrictions?",
        answer:
            "Our reception menu will include buffet style Indian vegetarian and Western vegetarian and non-vegetarian options. Please note any dietary restrictions in your RSVP so we can be sure to accommodate you fully.",
    },
];

export default function FAQPage() {
    return (
        <div className={styles.page}>
            <h1 className={styles.heading}>Frequently Asked Questions</h1>
            <p className={styles.subtitle}>Read the FAQ so you know what to do!</p>

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
