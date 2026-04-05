const events = [
  {
    day: 'Friday, [Month] [Day]',
    title: 'Mehendi Night',
    time: '6:00 PM – 10:00 PM',
    location: 'Venue Name, City',
    description:
      'Join us for an evening of henna, music, and celebration as we kick off the wedding festivities. Traditional Indian mehndi designs, live dhol music, and delicious snacks await.',
    palette: 'border-terracotta',
  },
  {
    day: 'Saturday, [Month] [Day]',
    title: 'Sangeet',
    time: '7:00 PM – 11:00 PM',
    location: 'Venue Name, City',
    description:
      'A night of song and dance! Families and friends from both sides come together to perform, celebrate, and fill the evening with joy. Dinner and dancing to follow.',
    palette: 'border-brick',
  },
  {
    day: 'Sunday, [Month] [Day]',
    title: 'Hindu Ceremony',
    time: '10:00 AM – 12:00 PM',
    location: 'Venue Name, City',
    description:
      'The traditional Hindu wedding ceremony (Vivah). Guests are welcome to attend and witness the sacred rituals including the Saptapadi (seven steps) and the tying of the sacred thread.',
    palette: 'border-forest',
  },
  {
    day: 'Sunday, [Month] [Day]',
    title: 'Jewish Ceremony',
    time: '3:00 PM – 4:00 PM',
    location: 'Venue Name, City',
    description:
      'The traditional Jewish wedding ceremony under the chuppah. The ceremony includes the signing of the ketubah (marriage contract), exchange of rings, and the breaking of the glass.',
    palette: 'border-taupe',
  },
  {
    day: 'Sunday, [Month] [Day]',
    title: 'Reception',
    time: '5:00 PM – 10:00 PM',
    location: 'Venue Name, City',
    description:
      'Celebrate with us at the wedding reception! Cocktail hour, dinner, toasts, and dancing. A fusion menu reflecting both our cultures will be served.',
    palette: 'border-terracotta',
  },
];

export default function SchedulePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="font-script text-6xl text-terracotta text-center mb-2">Schedule</h1>
      <div className="w-16 h-px bg-terracotta mx-auto mb-12" />

      <div className="space-y-10">
        {events.map((event, i) => (
          <div key={i} className={`border-l-4 ${event.palette} pl-6`}>
            <p className="text-xs uppercase tracking-widest text-taupe mb-1">{event.day}</p>
            <h2 className="text-2xl font-bold text-foreground mb-1">{event.title}</h2>
            <p className="text-sm text-taupe mb-3">
              {event.time} &nbsp;·&nbsp; {event.location}
            </p>
            <p className="text-foreground/80 leading-relaxed">{event.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
