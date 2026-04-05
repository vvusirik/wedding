const registries = [
  {
    name: 'Zola',
    description: 'Our main registry with home goods, kitchen items, and experiences.',
    url: '#',
    icon: '🎁',
  },
  {
    name: 'Amazon',
    description: 'A curated selection of everyday essentials and fun additions.',
    url: '#',
    icon: '📦',
  },
  {
    name: 'Honeymoon Fund',
    description: 'Help us create unforgettable memories on our honeymoon adventure.',
    url: '#',
    icon: '🌍',
  },
];

export default function RegistryPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="font-script text-6xl text-terracotta text-center mb-2">Registry</h1>
      <div className="w-16 h-px bg-terracotta mx-auto mb-4" />
      <p className="text-center text-taupe mb-12 max-w-xl mx-auto">
        Your presence at our wedding is the greatest gift of all. For those who wish to celebrate with a gift, we&rsquo;ve registered at a few places below.
      </p>

      <div className="grid gap-6 sm:grid-cols-3">
        {registries.map((reg) => (
          <a
            key={reg.name}
            href={reg.url}
            className="flex flex-col items-center text-center p-8 border border-cream rounded-xl hover:border-terracotta hover:shadow-md transition-all group"
          >
            <span className="text-4xl mb-4">{reg.icon}</span>
            <h2 className="text-lg font-bold text-foreground group-hover:text-terracotta transition-colors mb-2">
              {reg.name}
            </h2>
            <p className="text-sm text-taupe leading-relaxed">{reg.description}</p>
            <span className="mt-4 text-xs uppercase tracking-widest text-terracotta">
              View Registry →
            </span>
          </a>
        ))}
      </div>

      <p className="mt-12 text-center text-sm text-taupe">
        Registry links will be updated closer to the wedding date.
      </p>
    </div>
  );
}
