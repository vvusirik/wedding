const sections = [
  {
    title: 'Venue',
    icon: '📍',
    content: (
      <>
        <p className="text-foreground/80 leading-relaxed">
          <strong>Venue Name</strong><br />
          123 Wedding Lane<br />
          City, State, ZIP
        </p>
        <p className="mt-3 text-foreground/70 text-sm">
          Parking is available on site. Valet service will be offered during the reception.
        </p>
      </>
    ),
  },
  {
    title: 'Nearest Airports',
    icon: '✈️',
    content: (
      <ul className="space-y-3 text-foreground/80">
        <li>
          <strong>Airport Name (XYZ)</strong> — [X] miles from venue<br />
          <span className="text-sm text-taupe">Recommended — most direct flights</span>
        </li>
        <li>
          <strong>Alternative Airport (ABC)</strong> — [X] miles from venue<br />
          <span className="text-sm text-taupe">Additional options available</span>
        </li>
      </ul>
    ),
  },
  {
    title: 'Recommended Hotels',
    icon: '🏨',
    content: (
      <div className="space-y-4">
        <div className="border border-cream rounded-lg p-4">
          <h3 className="font-semibold text-foreground">Hotel Name</h3>
          <p className="text-sm text-taupe mt-1">123 Hotel Street · City, State</p>
          <p className="text-sm text-foreground/70 mt-2">
            We have reserved a room block at this hotel. Use code <strong>HANVISHAL</strong> when booking.
            Rate: $XXX/night · Block expires [Date].
          </p>
        </div>
        <div className="border border-cream rounded-lg p-4">
          <h3 className="font-semibold text-foreground">Hotel Name 2</h3>
          <p className="text-sm text-taupe mt-1">456 Other Street · City, State</p>
          <p className="text-sm text-foreground/70 mt-2">
            A more budget-friendly option near the venue. ~[X] minute drive.
          </p>
        </div>
      </div>
    ),
  },
  {
    title: 'Getting Around',
    icon: '🚗',
    content: (
      <ul className="list-disc list-inside space-y-2 text-foreground/80">
        <li>Rideshare services (Uber / Lyft) are available in the area.</li>
        <li>Shuttle service will be provided between the hotel block and venue on the wedding day.</li>
        <li>Rental cars available at the airport — [X] minute drive to venue.</li>
      </ul>
    ),
  },
];

export default function TravelPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="font-script text-6xl text-terracotta text-center mb-2">Travel</h1>
      <div className="w-16 h-px bg-terracotta mx-auto mb-4" />
      <p className="text-center text-taupe mb-12 max-w-xl mx-auto">
        We want to make it as easy as possible for you to join us. Here's everything you need to know to get here.
      </p>

      <div className="space-y-10">
        {sections.map((section) => (
          <div key={section.title}>
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2 mb-3">
              <span>{section.icon}</span>
              {section.title}
            </h2>
            <div className="border-t border-cream pt-4">
              {section.content}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
