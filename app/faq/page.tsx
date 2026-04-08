const faqs = [
  {
    question: "What is the dress code?",
    answer: (
      <>
        <p>
          We&apos;d love for guests to embrace the festive spirit of our
          cultural celebrations!
        </p>
        <ul className="list-disc list-inside mt-2 space-y-1">
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
    question: "Are kids welcome?",
    answer:
      "As much as we love your little ones, we will not be including them in the ceremony or reception. Please make arrangements for childcare if necessary.",
  },
  {
    question: "What is the gift policy?",
    answer: (
      <p>
        Your presence is all that we ask for, and as such we do not have a
        registry. For those who still wish to give, please see the{" "}
        <a href="/registry">Registry</a> section.
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
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="font-script text-6xl text-terracotta text-center mb-2">
        Frequently Asked Questions
      </h1>
      <div className="w-16 h-px bg-terracotta mx-auto mb-4" />
      <p className="text-center text-taupe mb-12">
        Read the FAQ so you know what to do!
      </p>

      <div className="space-y-4">
        {faqs.map((faq, i) => (
          <details
            key={i}
            className="group border border-cream rounded-lg overflow-hidden"
          >
            <summary className="cursor-pointer list-none flex justify-between items-center px-6 py-4 hover:bg-cream/40 transition-colors">
              <span className="font-semibold text-foreground pr-4">
                {faq.question}
              </span>
              <span className="text-terracotta text-xl flex-shrink-0 group-open:rotate-45 transition-transform">
                +
              </span>
            </summary>
            <div className="px-6 py-4 border-t border-cream text-foreground/80 leading-relaxed">
              {faq.answer}
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
