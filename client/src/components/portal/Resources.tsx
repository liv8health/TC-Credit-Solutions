import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlayCircle, FileText, Shield, Plane, Phone, GraduationCap } from "lucide-react";

const educationalResources = [
  {
    title: "Understanding Credit Scores",
    type: "video",
    icon: PlayCircle,
    description: "Learn how credit scores are calculated and what affects them",
  },
  {
    title: "Credit Repair Guide (PDF)",
    type: "pdf",
    icon: FileText,
    description: "Comprehensive guide to understanding the credit repair process",
  },
  {
    title: "Building Good Credit Habits",
    type: "video", 
    icon: PlayCircle,
    description: "Essential habits for maintaining excellent credit long-term",
  },
  {
    title: "Debt Management Strategies",
    type: "pdf",
    icon: FileText,
    description: "Proven strategies for managing and paying down debt effectively",
  },
];

const memberBenefits = [
  {
    title: "Identity Protection",
    icon: Shield,
    description: "24/7 monitoring and alerts for identity theft protection",
  },
  {
    title: "Travel Deals",
    icon: Plane,
    description: "Exclusive discounts on hotels, flights, and vacation packages",
  },
  {
    title: "Bill Negotiator",
    icon: Phone,
    description: "Professional service to negotiate lower rates on your bills",
  },
  {
    title: "Credit Education Portal",
    icon: GraduationCap,
    description: "Access to webinars, courses, and credit education materials",
  },
];

export function Resources() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Educational Resources</h1>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Educational Content */}
        <Card>
          <CardHeader>
            <CardTitle>Credit Education</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {educationalResources.map((resource, index) => {
                const Icon = resource.icon;
                return (
                  <Button
                    key={index}
                    variant="ghost"
                    className="w-full justify-start h-auto p-3"
                  >
                    <div className="flex items-start space-x-3 text-left">
                      <Icon className={`h-5 w-5 mt-0.5 ${
                        resource.type === 'video' ? 'text-primary' : 'text-red-500'
                      }`} />
                      <div>
                        <p className="font-medium">{resource.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {resource.description}
                        </p>
                      </div>
                    </div>
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Member Benefits */}
        <Card>
          <CardHeader>
            <CardTitle>Member Benefits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {memberBenefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <div
                    key={index}
                    className="flex items-start space-x-3 p-3 bg-muted/30 rounded-lg"
                  >
                    <Icon className="h-5 w-5 mt-0.5 text-primary" />
                    <div>
                      <p className="font-medium">{benefit.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Resources */}
      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">How long does the credit repair process take?</h4>
              <p className="text-sm text-muted-foreground">
                Most clients see results within 30-60 days, though the complete process can take 3-6 months depending on the complexity of your credit report.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">What types of items can be removed from my credit report?</h4>
              <p className="text-sm text-muted-foreground">
                We can dispute inaccurate, outdated, or unverifiable items including late payments, collections, charge-offs, bankruptcies, and more.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">How will I know about progress on my credit repair?</h4>
              <p className="text-sm text-muted-foreground">
                You'll receive regular updates through this portal, including when disputes are filed and when negative items are removed.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
