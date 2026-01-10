import { Button } from "@/components/ui/button";
import { Shield, Sparkles, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(192_95%_55%_/_0.08)_0%,transparent_50%)]" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle,hsl(192_95%_55%_/_0.05)_0%,transparent_60%)]" />
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(hsl(222_30%_15%_/_0.3)_1px,transparent_1px),linear-gradient(90deg,hsl(222_30%_15%_/_0.3)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)]" />

      <div className="container relative z-10 px-4 py-20">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="animate-fade-in inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8">
            <Sparkles className="w-4 h-4" />
            <span>AI-Powered Scam Detection</span>
          </div>

          {/* Main Heading */}
          <h1 className="animate-slide-up text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
            <span className="text-foreground">Stop Scams</span>
            <br />
            <span className="gradient-text">Before They Reach You</span>
          </h1>

          {/* Subheadline */}
          <p className="animate-slide-up text-lg md:text-xl text-muted-foreground max-w-2xl mb-10" style={{ animationDelay: '0.1s' }}>
            ScamShield uses intelligent AI to analyze messages and emails, 
            helping you detect threats before you click or respond.
          </p>

          {/* CTA Buttons */}
          <div className="animate-slide-up flex flex-col sm:flex-row gap-4" style={{ animationDelay: '0.2s' }}>
            <Link to="/dashboard">
              <Button variant="hero" size="xl">
                Try ScamShield
                <ArrowRight className="w-5 h-5 ml-1" />
              </Button>
            </Link>
            <Button variant="heroOutline" size="xl">
              See How It Works
            </Button>
          </div>

          {/* Hero Visual */}
          <div className="animate-slide-up mt-16 relative" style={{ animationDelay: '0.3s' }}>
            <div className="relative">
              {/* Glow behind card */}
              <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-75" />
              
              {/* Shield Icon with animation */}
              <div className="relative glass-card p-8 rounded-2xl">
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <Shield className="w-20 h-20 text-primary animate-pulse-glow" />
                    <div className="absolute inset-0 bg-primary/30 blur-xl rounded-full" />
                  </div>
                  <div className="text-left">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-3 h-3 rounded-full bg-success animate-pulse" />
                      <span className="text-success font-medium">Protected</span>
                    </div>
                    <p className="text-muted-foreground text-sm">
                      Your messages are being monitored
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
