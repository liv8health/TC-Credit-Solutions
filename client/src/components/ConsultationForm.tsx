import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { X } from "lucide-react";

const consultationSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(10, "Phone number is required"),
  bestTimeToCall: z.string().optional(),
  currentCreditScore: z.string().optional(),
  primaryGoal: z.string().optional(),
  timeline: z.string().optional(),
  negativeItems: z.array(z.string()).optional(),
  additionalComments: z.string().optional(),
  consent: z.boolean().refine(val => val === true, "You must agree to receive communication"),
});

type ConsultationFormData = z.infer<typeof consultationSchema>;

const negativeItemOptions = [
  "Late payments",
  "Collections",
  "Charge-offs",
  "Bankruptcy",
  "Foreclosure",
  "Repossession",
  "Tax liens",
  "Student loan defaults",
];

interface ConsultationFormProps {
  trigger?: React.ReactNode;
}

export function ConsultationForm({ trigger }: ConsultationFormProps) {
  const [open, setOpen] = useState(false);
  const [selectedNegativeItems, setSelectedNegativeItems] = useState<string[]>([]);
  const { toast } = useToast();

  const form = useForm<ConsultationFormData>({
    resolver: zodResolver(consultationSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      bestTimeToCall: "Morning (9AM - 12PM)",
      currentCreditScore: "I don't know",
      primaryGoal: "General credit improvement",
      timeline: "3-6 months",
      negativeItems: [],
      additionalComments: "",
      consent: false,
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: ConsultationFormData) => {
      const response = await apiRequest("POST", "/api/consultations", {
        ...data,
        negativeItems: selectedNegativeItems,
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Consultation Scheduled!",
        description: "Thank you! We will contact you shortly to schedule your free consultation.",
      });
      setOpen(false);
      form.reset();
      setSelectedNegativeItems([]);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to submit consultation request. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ConsultationFormData) => {
    mutation.mutate(data);
  };

  const handleNegativeItemChange = (item: string, checked: boolean) => {
    if (checked) {
      setSelectedNegativeItems([...selectedNegativeItems, item]);
    } else {
      setSelectedNegativeItems(selectedNegativeItems.filter(i => i !== item));
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold">
            Schedule Free Consultation
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Free Credit Consultation</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-primary">Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    {...form.register("firstName")}
                    className="mt-1"
                  />
                  {form.formState.errors.firstName && (
                    <p className="text-sm text-destructive mt-1">
                      {form.formState.errors.firstName.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    {...form.register("lastName")}
                    className="mt-1"
                  />
                  {form.formState.errors.lastName && (
                    <p className="text-sm text-destructive mt-1">
                      {form.formState.errors.lastName.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    {...form.register("email")}
                    className="mt-1"
                  />
                  {form.formState.errors.email && (
                    <p className="text-sm text-destructive mt-1">
                      {form.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    {...form.register("phone")}
                    className="mt-1"
                  />
                  {form.formState.errors.phone && (
                    <p className="text-sm text-destructive mt-1">
                      {form.formState.errors.phone.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="bestTimeToCall">Best Time to Call</Label>
                  <Select
                    value={form.watch("bestTimeToCall")}
                    onValueChange={(value) => form.setValue("bestTimeToCall", value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Morning (9AM - 12PM)">Morning (9AM - 12PM)</SelectItem>
                      <SelectItem value="Afternoon (12PM - 5PM)">Afternoon (12PM - 5PM)</SelectItem>
                      <SelectItem value="Evening (5PM - 8PM)">Evening (5PM - 8PM)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Credit Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-primary">Credit Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="currentCreditScore">Current Credit Score (if known)</Label>
                  <Select
                    value={form.watch("currentCreditScore")}
                    onValueChange={(value) => form.setValue("currentCreditScore", value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="I don't know">I don't know</SelectItem>
                      <SelectItem value="Below 500">Below 500</SelectItem>
                      <SelectItem value="500-549">500-549</SelectItem>
                      <SelectItem value="550-599">550-599</SelectItem>
                      <SelectItem value="600-649">600-649</SelectItem>
                      <SelectItem value="650-699">650-699</SelectItem>
                      <SelectItem value="700-749">700-749</SelectItem>
                      <SelectItem value="750-799">750-799</SelectItem>
                      <SelectItem value="800+">800+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="primaryGoal">Primary Goal</Label>
                  <Select
                    value={form.watch("primaryGoal")}
                    onValueChange={(value) => form.setValue("primaryGoal", value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Buy a home">Buy a home</SelectItem>
                      <SelectItem value="Buy a car">Buy a car</SelectItem>
                      <SelectItem value="Get a credit card">Get a credit card</SelectItem>
                      <SelectItem value="Lower interest rates">Lower interest rates</SelectItem>
                      <SelectItem value="General credit improvement">General credit improvement</SelectItem>
                      <SelectItem value="Remove negative items">Remove negative items</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="timeline">Timeline for Goal</Label>
                  <Select
                    value={form.watch("timeline")}
                    onValueChange={(value) => form.setValue("timeline", value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Within 30 days">Within 30 days</SelectItem>
                      <SelectItem value="1-3 months">1-3 months</SelectItem>
                      <SelectItem value="3-6 months">3-6 months</SelectItem>
                      <SelectItem value="6-12 months">6-12 months</SelectItem>
                      <SelectItem value="No rush">No rush</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Which negative items do you have? (Select all that apply)</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {negativeItemOptions.map((item) => (
                      <div key={item} className="flex items-center space-x-2">
                        <Checkbox
                          id={item}
                          checked={selectedNegativeItems.includes(item)}
                          onCheckedChange={(checked) => handleNegativeItemChange(item, checked as boolean)}
                        />
                        <Label htmlFor={item} className="text-sm">
                          {item}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="additionalComments">Additional Comments</Label>
              <Textarea
                id="additionalComments"
                {...form.register("additionalComments")}
                placeholder="Tell us more about your credit situation and goals..."
                className="mt-1"
                rows={3}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="consent"
                {...form.register("consent")}
              />
              <Label htmlFor="consent" className="text-sm">
                I agree to receive communication from TC Credit Solutions regarding my credit repair consultation.
              </Label>
            </div>
            {form.formState.errors.consent && (
              <p className="text-sm text-destructive">
                {form.formState.errors.consent.message}
              </p>
            )}
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "Submitting..." : "Schedule My Free Consultation"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
