import { Upload, Scan, ShieldCheck } from "lucide-react";

const steps = [
  {
    icon: Upload,
    title: "Upload",
    description: "Paste text or upload a screenshot of the suspicious message",
    step: "01",
  },
  {
    icon: Scan,
    title: "Analyze",
    description: "Our AI scans for phishing patterns, suspicious links, and scam indicators",
    step: "02",
  },
  {
    icon: ShieldCheck,
    title: "Act",
    description: "Get a clear risk assessment with actionable recommendations",
    step: "03",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-24 relative">
      <div className="container px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            How It <span className="gradient-text">Works</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Three simple steps to protect yourself from online scams
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="relative group"
            >
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 left-[60%] w-full h-[2px] bg-gradient-to-r from-primary/50 to-transparent" />
              )}

              <div className="glass-card p-8 rounded-2xl transition-all duration-300 hover:border-primary/50 group-hover:shadow-[0_0_30px_hsl(192_95%_55%_/_0.1)]">
                {/* Step Number */}
                <span className="absolute -top-3 -right-3 text-6xl font-bold text-primary/10">
                  {step.step}
                </span>

                {/* Icon */}
                <div className="relative mb-6">
                  <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <step.icon className="w-8 h-8 text-primary" />
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
