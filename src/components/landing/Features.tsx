import { Brain, Building2, Zap, Lock, Eye, Globe } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "Explainable AI",
    description: "Understand exactly why a message is flagged as suspicious with detailed explanations",
  },
  {
    icon: Building2,
    title: "Enterprise Ready",
    description: "Built for scale with robust APIs and team management capabilities",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Get instant results with our optimized AI pipeline",
  },
  {
    icon: Lock,
    title: "Privacy First",
    description: "Your data is encrypted and never stored without your consent",
  },
  {
    icon: Eye,
    title: "OCR Powered",
    description: "Extract and analyze text from screenshots automatically",
  },
  {
    icon: Globe,
    title: "Multi-Language",
    description: "Detect scams in multiple languages with high accuracy",
  },
];

const Features = () => {
  return (
    <section className="py-24 relative bg-card/30">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,hsl(192_95%_55%_/_0.05)_0%,transparent_50%)]" />
      
      <div className="container px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Why Choose <span className="gradient-text">ScamShield</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Advanced protection powered by cutting-edge technology
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="glass-card p-6 rounded-xl group hover:border-primary/30 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
