import { Link } from "react-router-dom";
import { FileText, Search, Shield, Zap, CheckCircle, BarChart3, Clock, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const Index = () => {
  const features = [
    {
      icon: FileText,
      title: "Smart Document Analysis",
      description: "AI-powered analysis extracts key information and validates compliance automatically"
    },
    {
      icon: Search,
      title: "Intelligent Q&A",
      description: "Ask questions about any document and get instant, accurate answers"
    },
    {
      icon: Shield,
      title: "Compliance Validation",
      description: "Automated checking against government standards and regulations"
    },
    {
      icon: Zap,
      title: "Fast Evaluation",
      description: "Score and rank proposals with AI-assisted evaluation criteria"
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description: "Comprehensive insights and metrics for informed decision-making"
    },
    {
      icon: Globe,
      title: "Multilingual Support",
      description: "Support for multiple languages including RTL scripts"
    }
  ];

  const benefits = [
    "Reduce document processing time by 80%",
    "Ensure 100% compliance validation",
    "Eliminate manual errors and bias",
    "Complete audit trail for transparency",
    "Secure and encrypted data handling",
    "Scalable for any procurement size"
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero py-12 sm:py-20 md:py-32 min-h-[60vh] flex items-center">
        <div className="container px-4 relative z-10 w-full">
          <div className="max-w-3xl mx-auto text-center text-primary-foreground">
            <div className="inline-flex items-center gap-2 bg-primary-foreground/10 backdrop-blur-sm px-3 sm:px-4 py-2 rounded-full mb-4 sm:mb-6">
              <Shield className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
              <span className="text-xs sm:text-sm font-medium whitespace-nowrap">Government of Andhra Pradesh</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight px-2">
              AI-Powered Bid Document Analysis Platform
            </h1>
            <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 text-primary-foreground/90 px-4">
              Transform your procurement process with intelligent document analysis, automated validation, and transparent evaluation
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
              <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-xl w-full sm:w-auto">
                <Link to="/dashboard">Get Started</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-primary-foreground/10 backdrop-blur-sm border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/20 w-full sm:w-auto">
                <Link to="/documents">View Demo</Link>
              </Button>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none"></div>
      </section>

      {/* Features Grid */}
      <section className="py-12 sm:py-16 md:py-20 bg-background">
        <div className="container px-4">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 px-2">Powerful Features for Modern Procurement</h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
              Everything you need to streamline your bid document processing
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="p-4 sm:p-6 hover:shadow-xl transition-all duration-300 border-border">
                <div className="mb-3 sm:mb-4 p-2 sm:p-3 rounded-lg bg-primary/10 w-fit">
                  <feature.icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm sm:text-base text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-muted/30">
        <div className="container px-4">
          <div className="grid md:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 px-2">Why Choose BidAnalyzer?</h2>
              <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8 px-2">
                Built specifically for government procurement with security, compliance, and efficiency at its core
              </p>
              <div className="space-y-3 sm:space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-2 sm:gap-3 px-2">
                    <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-success flex-shrink-0 mt-0.5" />
                    <span className="text-sm sm:text-base text-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <Card className="p-4 sm:p-6 text-center">
                <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-primary mx-auto mb-2 sm:mb-3" />
                <div className="text-2xl sm:text-3xl font-bold text-foreground mb-1">80%</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Time Saved</div>
              </Card>
              <Card className="p-4 sm:p-6 text-center">
                <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-secondary mx-auto mb-2 sm:mb-3" />
                <div className="text-2xl sm:text-3xl font-bold text-foreground mb-1">100%</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Compliant</div>
              </Card>
              <Card className="p-4 sm:p-6 text-center">
                <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-accent mx-auto mb-2 sm:mb-3" />
                <div className="text-2xl sm:text-3xl font-bold text-foreground mb-1">10K+</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Documents</div>
              </Card>
              <Card className="p-4 sm:p-6 text-center">
                <BarChart3 className="h-6 w-6 sm:h-8 sm:w-8 text-success mx-auto mb-2 sm:mb-3" />
                <div className="text-2xl sm:text-3xl font-bold text-foreground mb-1">50+</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Departments</div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-gradient-primary">
        <div className="container px-4">
          <div className="max-w-3xl mx-auto text-center text-primary-foreground">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 px-2">Ready to Transform Your Procurement?</h2>
            <p className="text-base sm:text-lg mb-6 sm:mb-8 text-primary-foreground/90 px-4">
              Join government departments already using BidAnalyzer for smarter, faster procurement
            </p>
            <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-xl w-full sm:w-auto">
              <Link to="/dashboard">Start Free Trial</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
