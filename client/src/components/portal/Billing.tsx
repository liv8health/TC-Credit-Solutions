import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, CreditCard } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export function Billing() {
  const { user } = useAuth();

  // Mock data - in a real app this would come from the API
  const currentPlan = {
    name: "Single Plan",
    price: 150,
    startDate: "January 15, 2024",
    status: "active",
  };

  const paymentHistory = [
    { month: "February 2024", date: "Feb 1, 2024", amount: 150.00, status: "paid" },
    { month: "January 2024", date: "Jan 1, 2024", amount: 150.00, status: "paid" },
    { month: "December 2023", date: "Dec 1, 2023", amount: 999.00, status: "paid", note: "Initial setup fee" },
  ];

  const planTiers = [
    {
      name: "Single",
      price: 999,
      monthly: 150,
      features: ["Full Credit Repair DFY", "Results typically within 30-60 days", "Member portal access"],
      current: user?.membershipTier === "single",
    },
    {
      name: "Couples", 
      price: 1499,
      monthly: 225,
      features: ["Full Credit Repair DFY", "Results typically within 30-60 days", "Member portal access", "Two person coverage"],
      current: user?.membershipTier === "couples",
      popular: true,
    },
    {
      name: "VIP",
      price: 2999,
      monthly: 325, 
      features: ["Full Credit Repair DFY", "Results typically within 30-60 days", "Direct owner access", "Premium support"],
      current: user?.membershipTier === "vip",
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Billing & Payments</h1>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Current Plan */}
        <Card>
          <CardHeader>
            <CardTitle>Current Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-primary/10 p-4 rounded-lg">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="font-semibold text-primary text-lg">{currentPlan.name}</p>
                  <p className="text-sm text-muted-foreground">Started {currentPlan.startDate}</p>
                </div>
                <Badge variant={currentPlan.status === 'active' ? 'default' : 'secondary'}>
                  {currentPlan.status}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-2xl font-bold text-primary">${currentPlan.price}</p>
                  <p className="text-sm text-muted-foreground">per month</p>
                </div>
                <CreditCard className="h-8 w-8 text-primary" />
              </div>
            </div>
            <Button className="w-full mt-4" variant="outline">
              Update Payment Method
            </Button>
          </CardContent>
        </Card>

        {/* Payment History */}
        <Card>
          <CardHeader>
            <CardTitle>Payment History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {paymentHistory.map((payment, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                  <div>
                    <p className="font-medium">{payment.month}</p>
                    <p className="text-sm text-muted-foreground">
                      Paid {payment.date}
                      {payment.note && ` • ${payment.note}`}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold text-emerald-600">
                      ${payment.amount.toFixed(2)}
                    </span>
                    <Badge variant="outline" className="ml-2 text-xs">
                      {payment.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              View Full History
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Plan Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Available Plans</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {planTiers.map((plan) => (
              <div
                key={plan.name}
                className={`relative p-6 rounded-lg border-2 transition-colors ${
                  plan.current
                    ? 'border-primary bg-primary/5'
                    : 'border-muted hover:border-primary/50'
                }`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                    Most Popular
                  </Badge>
                )}
                {plan.current && (
                  <Badge variant="outline" className="absolute -top-2 right-4">
                    Current Plan
                  </Badge>
                )}
                
                <div className="text-center mb-4">
                  <h3 className="text-xl font-bold">{plan.name}</h3>
                  <div className="mt-2">
                    <span className="text-3xl font-bold">${plan.price}</span>
                    <p className="text-sm text-muted-foreground">
                      Then ${plan.monthly}/month
                    </p>
                  </div>
                </div>

                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button 
                  className="w-full" 
                  variant={plan.current ? "outline" : "default"}
                  disabled={plan.current}
                >
                  {plan.current ? "Current Plan" : "Upgrade"}
                  {!plan.current && <ArrowUpRight className="ml-2 h-4 w-4" />}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
