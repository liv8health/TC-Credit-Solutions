import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ConsultationForm } from "@/components/ConsultationForm";
import { PublicNavigation } from "@/components/PublicNavigation";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  CheckCircle, 
  Star, 
  TrendingUp, 
  Target, 
  Wrench, 
  Phone, 
  Mail, 
  MapPin, 
  Clock,
  Facebook,
  Twitter,
  Linkedin
} from "lucide-react";

const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(1, "Message is required"),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function Landing() {
  const { toast } = useToast();
  
  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
  });

  const contactMutation = useMutation({
    mutationFn: async (data: ContactFormData) => {
      const response = await apiRequest("POST", "/api/contact", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Message Sent!",
        description: "Thank you for your message! We will get back to you within 24 hours.",
      });
      form.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmitContact = (data: ContactFormData) => {
    contactMutation.mutate(data);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.querySelector(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <PublicNavigation />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary to-primary/90 text-primary-foreground overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        {/* Background Image */}
        <div className="absolute inset-0 opacity-10">
          <img 
            src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" 
            alt="Financial Success" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl lg:text-6xl font-bold mb-6">Fix Your Credit Now</h1>
              <p className="text-xl lg:text-2xl mb-8">
                Schedule Your FREE Consultation Call Below{" "}
                <span className="line-through opacity-70">($99.95 value)</span>
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button 
                  size="lg" 
                  className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-lg px-8"
                  onClick={() => scrollToSection('#consultation')}
                >
                  Schedule Free Consultation
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="lg" 
                      className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary font-bold text-lg px-8"
                    >
                      Learn More
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl">
                    <DialogHeader>
                      <DialogTitle>See How TC Credit Solutions Works</DialogTitle>
                    </DialogHeader>
                    <div className="aspect-video">
                      <iframe 
                        width="100%" 
                        height="100%" 
                        src="https://www.youtube.com/embed/zADj6VxsTWI?si=3voLQVscHQk0ghoM" 
                        title="YouTube video player" 
                        frameBorder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                        referrerPolicy="strict-origin-when-cross-origin" 
                        allowFullScreen
                        className="rounded-lg"
                      />
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg shadow-2xl p-8 text-white">
                <div className="text-center">
                  <TrendingUp className="h-16 w-16 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Credit Score Improvement</h3>
                  <p className="text-lg">Professional credit repair services with proven results</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3-Step Process */}
      <section id="services" className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-4">
              Our 3-Step Process for Saving is Very Simple!
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="mb-6">
                <div className="bg-gradient-to-br from-teal-100 to-teal-200 dark:from-teal-800 dark:to-teal-900 w-32 h-32 rounded-lg mx-auto mb-4 shadow-lg flex items-center justify-center">
                  <Target className="h-12 w-12 text-teal-600 dark:text-teal-300" />
                </div>
                <div className="bg-primary text-primary-foreground rounded-full w-16 h-16 flex items-center justify-center mx-auto -mt-8 relative z-10 shadow-lg">
                  <Target className="h-6 w-6" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-4 text-primary">STEP 1 - GET PLAN</h3>
              <p className="text-muted-foreground">
                Take a couple minutes to answer our questions and we'll send you a free credit blueprint. From here you have a plan.
              </p>
            </div>
            <div className="text-center">
              <div className="mb-6">
                <div className="bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-800 dark:to-amber-900 w-32 h-32 rounded-lg mx-auto mb-4 shadow-lg flex items-center justify-center">
                  <Wrench className="h-12 w-12 text-amber-600 dark:text-amber-300" />
                </div>
                <div className="bg-accent text-accent-foreground rounded-full w-16 h-16 flex items-center justify-center mx-auto -mt-8 relative z-10 shadow-lg">
                  <Wrench className="h-6 w-6" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-4 text-accent">STEP 2 - TAKE ACTION</h3>
              <p className="text-muted-foreground">
                Once you have a plan, you can start to fix your credit!
              </p>
            </div>
            <div className="text-center">
              <div className="mb-6">
                <div className="bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-800 dark:to-emerald-900 w-32 h-32 rounded-lg mx-auto mb-4 shadow-lg flex items-center justify-center">
                  <TrendingUp className="h-12 w-12 text-emerald-600 dark:text-emerald-300" />
                </div>
                <div className="bg-emerald-500 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto -mt-8 relative z-10 shadow-lg">
                  <TrendingUp className="h-6 w-6" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-4 text-emerald-600 dark:text-emerald-400">STEP 3 - GET RESULTS</h3>
              <p className="text-muted-foreground">
                After repairing your credit you will see the financial savings INSTANTLY!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">We Are Awesome At Our Work</h2>
            <p className="text-xl text-muted-foreground">
              You're approved. After our award-winning service, our customers were more eligible for the credit they deserved.
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-bold text-primary mb-2">73%</div>
              <div className="text-lg font-medium text-muted-foreground">Approved Home Loans</div>
            </div>
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-bold text-accent mb-2">78%</div>
              <div className="text-lg font-medium text-muted-foreground">Approved Auto Loans</div>
            </div>
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">88%</div>
              <div className="text-lg font-medium text-muted-foreground">Approved New Credit</div>
            </div>
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-bold text-purple-600 dark:text-purple-400 mb-2">76%</div>
              <div className="text-lg font-medium text-muted-foreground">Approved Refinance</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Testimonials</h2>
            <p className="text-xl text-muted-foreground">
              Our members tell the story for us! Read below as some of our members share their experience with us!
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Damieon",
                role: "Client",
                content: "I'm beyond thankful for my Mother's Prayers & that have kept me safe until this day! Thanks to my lady that has kept me focused whenever I wanted to derail from the mission! Tiffany @tccreditsolutions has taught me everything I know about credit... When we began our journey my fico credit score was 545 now my score is at 770!!!",
                initials: "D"
              },
              {
                name: "Brittney",
                role: "Homeowner", 
                content: "January of 2023 I reached out to Tiffany to help me get my credit together. I had 3 goals 1. Buy a house 2. A travel card with a high limit and 3. A regular card with a high limit. I stayed consistent, I got rid of debt, I kept my balances below 10%... on March 4, 2025 I checked that first goal off of my to do list!!! When we started this I had 6-7 collections on my credit, today I have 0! She has removed over 60 accounts, inquiries included. Thank you so much Tiff!!!!",
                initials: "B"
              },
              {
                name: "David Smith",
                role: "Contractor",
                content: "I was skeptical at first, only because I've paid for services in the past and they were a total rip off! In the first 45 days I had things falling off! They are the real deal! Thanks TC Credit!",
                initials: "DS"
              }
            ].map((testimonial, index) => (
              <Card key={index} className="bg-card">
                <CardContent className="p-6">
                  <div className="flex text-accent mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-6">"{testimonial.content}"</p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full mr-4 bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white font-bold">
                      {testimonial.initials}
                    </div>
                    <div>
                      <div className="font-bold">{testimonial.name}</div>
                      <div className="text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Pricing</h2>
            <p className="text-xl text-muted-foreground">
              Choose the plan that works best for your credit repair needs
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Single",
                price: 999,
                monthly: 150,
                features: [
                  "Full Credit Repair DFY by our team",
                  "Results typically within 30-60 days", 
                  "Access to TC Credit Membership",
                  "Access to Member Benefits"
                ],
                popular: false
              },
              {
                name: "Couples",
                price: 1499,
                monthly: 225,
                features: [
                  "Full Credit Repair DFY by our team",
                  "Results typically within 30-60 days",
                  "Access to TC Credit Membership", 
                  "Access to Member Benefits"
                ],
                popular: true
              },
              {
                name: "VIP",
                price: 2999,
                monthly: 325,
                features: [
                  "Full Credit Repair DFY by our team",
                  "Results typically within 30-60 days",
                  "Access to Owner",
                  "Access to Member Benefits",
                  "Credit Education"
                ],
                popular: false
              }
            ].map((plan, index) => (
              <Card key={index} className={`relative ${plan.popular ? 'border-accent' : 'border-border'}`}>
                {plan.popular && (
                  <Badge className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-accent text-accent-foreground">
                    POPULAR
                  </Badge>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <p className="text-muted-foreground">To Get Started</p>
                  <div className="text-4xl font-bold text-primary">${plan.price.toLocaleString()}</div>
                  <p className="text-muted-foreground">Then ${plan.monthly} a month</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-emerald-500 mr-3 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <Button 
                    className={`w-full ${plan.popular ? 'bg-accent hover:bg-accent/90' : ''}`}
                    onClick={() => window.open('https://sqr.co/TCCreditCall/', '_blank')}
                  >
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Free Consultation */}
      <section id="consultation" className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Schedule Your FREE Consultation</h2>
            <p className="text-xl text-muted-foreground">
              Take the first step towards improving your credit score
            </p>
            <p className="text-lg text-muted-foreground mt-2">
              <span className="line-through opacity-70">$99.95 value</span> - Completely FREE
            </p>
          </div>
          
          <div className="text-center">
            <Button 
              size="lg" 
              className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-xl px-12 py-6"
              onClick={() => window.open('https://sqr.co/TCCreditCall/', '_blank')}
            >
              Schedule Call
            </Button>
            <p className="text-sm text-muted-foreground mt-4">
              Click to open our scheduling form with calendar availability
            </p>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Contact Us</h2>
            <p className="text-xl text-muted-foreground">
              Have a question or concern? We're here to help!
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div className="flex items-start">
                <Mail className="h-6 w-6 text-primary mr-4 mt-1" />
                <div>
                  <h3 className="font-bold mb-1">Email</h3>
                  <p className="text-muted-foreground">info@tccreditsolutions.com</p>
                </div>
              </div>
              <div className="flex items-start">
                <Phone className="h-6 w-6 text-primary mr-4 mt-1" />
                <div>
                  <h3 className="font-bold mb-1">Phone</h3>
                  <p className="text-muted-foreground">1-800-674-8508</p>
                </div>
              </div>
              <div className="flex items-start">
                <MapPin className="h-6 w-6 text-primary mr-4 mt-1" />
                <div>
                  <h3 className="font-bold mb-1">Address</h3>
                  <p className="text-muted-foreground">
                    364 E. Main Street Suite 1651<br />
                    Middletown, DE 19709
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <Clock className="h-6 w-6 text-primary mr-4 mt-1" />
                <div>
                  <h3 className="font-bold mb-1">Hours of Operation</h3>
                  <p className="text-muted-foreground">
                    Monday-Friday: 10:00-7:00 PM EST<br />
                    Saturday: 10:00-2:00 PM EST<br />
                    Sunday: Closed
                  </p>
                </div>
              </div>
            </div>
            
            <Card>
              <CardContent className="p-6">
                <form onSubmit={form.handleSubmit(onSubmitContact)} className="space-y-6">
                  <div>
                    <Input
                      placeholder="Name"
                      {...form.register("name")}
                    />
                    {form.formState.errors.name && (
                      <p className="text-sm text-destructive mt-1">
                        {form.formState.errors.name.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Input
                      type="email"
                      placeholder="Email"
                      {...form.register("email")}
                    />
                    {form.formState.errors.email && (
                      <p className="text-sm text-destructive mt-1">
                        {form.formState.errors.email.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Input
                      type="tel"
                      placeholder="Phone"
                      {...form.register("phone")}
                    />
                  </div>
                  <div>
                    <Input
                      placeholder="Subject"
                      {...form.register("subject")}
                    />
                  </div>
                  <div>
                    <Textarea
                      placeholder="Your Message"
                      rows={4}
                      {...form.register("message")}
                    />
                    {form.formState.errors.message && (
                      <p className="text-sm text-destructive mt-1">
                        {form.formState.errors.message.message}
                      </p>
                    )}
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={contactMutation.isPending}
                  >
                    {contactMutation.isPending ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="bg-primary text-primary-foreground rounded-lg p-2 mr-3">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <span className="text-xl font-bold">TC Credit Solutions</span>
              </div>
              <p className="text-slate-400 mb-4">
                Professional credit repair services helping you achieve financial freedom.
              </p>
              <div className="flex space-x-4">
                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                  <Facebook className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                  <Twitter className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                  <Linkedin className="h-5 w-5" />
                </Button>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Services</h3>
              <ul className="space-y-2 text-slate-400">
                <li><button className="hover:text-white transition-colors">Credit Repair</button></li>
                <li><button className="hover:text-white transition-colors">Credit Monitoring</button></li>
                <li><button className="hover:text-white transition-colors">Dispute Services</button></li>
                <li><button className="hover:text-white transition-colors">Credit Education</button></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-slate-400">
                <li><button className="hover:text-white transition-colors">About Us</button></li>
                <li><button className="hover:text-white transition-colors">Contact</button></li>
                <li><button className="hover:text-white transition-colors">Privacy Policy</button></li>
                <li><button className="hover:text-white transition-colors">Terms of Service</button></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
              <div className="space-y-2 text-slate-400">
                <p className="flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  1-800-674-8508
                </p>
                <p className="flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  info@tccreditsolutions.com
                </p>
                <p className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  Middletown, DE 19709
                </p>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 mt-8 text-center text-slate-400">
            <p>&copy; 2024 TC Credit Solutions. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
