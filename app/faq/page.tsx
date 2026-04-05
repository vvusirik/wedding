const faqs = [
  {
    question: "What is the dress code?",
    answer:
      "We'd love for guests to embrace the festive spirit of our celebration! For the Mehendi and Sangeet: colorful semi-formal attire is encouraged — think bright salwar kameez, lehengas, sarees, or cocktail dresses in jewel tones. For the ceremonies and reception: formal attire is requested. Guests are welcome to wear Indian, Western, or fusion formal wear. Please avoid white (reserved for Jewish ceremony traditions) and black if possible.",
  },
  {
    question: "Will there be food for dietary restrictions?",
    answer:
      "Absolutely! Our reception menu will include vegetarian, vegan, and gluten-free options. The caterers are aware of common allergens. Please note any dietary restrictions in your RSVP so we can accommodate you fully. The menu will be a fusion of Indian and Jewish cuisines.",
  },
  {
    question: "When is the RSVP deadline?",
    answer:
      "Please RSVP by [Date]. We'd love to have an accurate headcount as early as possible to ensure everything goes smoothly. If you have any trouble submitting your RSVP, feel free to reach out to us directly.",
  },
  {
    question: "Are kids welcome?",
    answer:
      "We love your little ones! Children are welcome at all events. Please indicate the number of children attending in your RSVP so we can plan accordingly.",
  },
  {
    question: "What is the gift policy?",
    answer:
      "Your presence truly is our greatest gift. For those who wish to give, we have a registry linked on this site. We are also happy to accept contributions to our honeymoon fund.",
  },
  {
    question: "Can I take photos during the ceremonies?",
    answer:
      "We'll have a professional photographer capturing every moment, but we also love candid shots! During the Hindu ceremony, please feel free to take photos. During the Jewish ceremony, we ask that guests remain unplugged so everyone can be fully present. Details will be shared in the ceremony program.",
  },
  {
    question: "What are the ceremony traditions I should know about?",
    answer:
      "We're blending two beautiful traditions! The Hindu ceremony includes rituals like the Ganesh Puja, Kanyadaan (giving away of the bride), and Saptapadi (seven vows around the sacred fire). The Jewish ceremony includes the signing of the Ketubah (marriage contract), circling under the Chuppah, and the breaking of the glass. Programs will be provided at both ceremonies to guide guests through the rituals.",
  },
  {
    question: "Who should I contact if I have questions?",
    answer:
      "Feel free to reach out to [Contact Name] at [email@example.com] for any questions not answered here. We're happy to help!",
  },
];

export default function FAQPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="font-script text-6xl text-terracotta text-center mb-2">FAQ</h1>
      <div className="w-16 h-px bg-terracotta mx-auto mb-4" />
      <p className="text-center text-taupe mb-12">
        Have questions? We&rsquo;ve got answers.
      </p>

      <div className="space-y-4">
        {faqs.map((faq, i) => (
          <details
            key={i}
            className="group border border-cream rounded-lg overflow-hidden"
          >
            <summary className="cursor-pointer list-none flex justify-between items-center px-6 py-4 hover:bg-cream/40 transition-colors">
              <span className="font-semibold text-foreground pr-4">{faq.question}</span>
              <span className="text-terracotta text-xl flex-shrink-0 group-open:rotate-45 transition-transform">+</span>
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
