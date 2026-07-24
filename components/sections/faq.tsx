const faqs = [
  {
    question: "Is the Free plan really free?",
    answer:
      "Yes — the basic macro calculator is free forever, no credit card required. It just doesn't include sport-specific personalization, which is what Starter and Pro unlock.",
  },
  {
    question: "What's the difference between Starter and Pro?",
    answer:
      "Starter covers ongoing fueling guidance for one sport — macros, workout guides, and 7-day plans. Pro adds the full Race Day Protocol, periodization across your training block, and priority support.",
  },
  {
    question: "I'm not racing right now, is this still for me?",
    answer:
      "Starter works for any training block. The Race Day Kit and Pro's Race Day Protocol are built around a specific race, so they're most valuable once you have one on the calendar.",
  },
  {
    question: "Can I cancel my subscription anytime?",
    answer:
      "Yes. Starter and Pro are billed monthly or annually with no lock-in — cancel anytime and keep access until the end of your billing period.",
  },
  {
    question: "How is this different from a generic macro calculator?",
    answer:
      "Generic calculators ignore training load, sport-specific fueling demands, and race-day logistics. Your plan accounts for all three.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="border-t border-border bg-card/30">
      <div className="mx-auto max-w-3xl px-6 py-24">
        <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
          Frequently asked questions
        </h2>

        <div className="mt-12 divide-y divide-border">
          {faqs.map((faq) => (
            <div key={faq.question} className="py-6">
              <h3 className="font-semibold">{faq.question}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
