import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, ArrowRight, CheckCircle, Users, Award } from "lucide-react";

export default function BrandedLogin() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="mx-auto h-20 w-20 bg-gradient-to-r from-teal-600 to-emerald-600 rounded-full flex items-center justify-center shadow-lg mb-6">
              <Shield className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              TC Credit Solutions
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Professional Credit Repair Services
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Benefits Section */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Access Your Member Portal
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Take control of your credit journey with our comprehensive member portal featuring real-time progress tracking, document management, and expert support.
              </p>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-teal-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Real-time Credit Monitoring</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Track your credit score improvements and receive instant updates</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Users className="h-5 w-5 text-teal-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Expert Support Team</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Direct access to certified credit repair specialists via live chat</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Award className="h-5 w-5 text-teal-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Proven Results</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Join thousands of satisfied clients who improved their credit</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Login Card */}
            <div>
              <Card className="shadow-2xl border-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-2xl">Welcome Back</CardTitle>
                  <CardDescription className="text-base">
                    Sign in to access your personalized credit repair dashboard
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Button 
                    onClick={handleLogin}
                    className="w-full h-12 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-lg font-semibold"
                  >
                    Access Member Portal
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>

                  <div className="text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Secure login powered by advanced encryption
                    </p>
                  </div>

                  <div className="border-t pt-6">
                    <div className="text-center space-y-2">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        New to TC Credit Solutions?
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Contact us at <span className="font-semibold">(555) 123-4567</span> to get started
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Trust Indicators */}
              <div className="mt-6 text-center space-y-2">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  ✓ SSL Secured • ✓ FCRA Compliant • ✓ BBB Accredited
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  © 2024 TC Credit Solutions. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}