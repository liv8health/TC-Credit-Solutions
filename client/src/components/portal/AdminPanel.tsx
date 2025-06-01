import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { UserCheck, UserX, Clock, Eye } from "lucide-react";
import type { UserApplication } from "@shared/schema";

export function AdminPanel() {
  const [selectedApplication, setSelectedApplication] = useState<UserApplication | null>(null);
  const [notes, setNotes] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: applications = [], isLoading } = useQuery({
    queryKey: ["/api/admin/applications"],
    retry: false,
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status, notes }: { id: number; status: string; notes?: string }) => {
      return await apiRequest(`/api/admin/applications/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, notes }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/applications"] });
      setSelectedApplication(null);
      setNotes("");
      toast({
        title: "Status updated",
        description: "Application status has been updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Update failed",
        description: error.message || "Failed to update application status.",
        variant: "destructive",
      });
    },
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="text-yellow-600"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case "approved":
        return <Badge variant="default" className="bg-green-600"><UserCheck className="w-3 h-3 mr-1" />Approved</Badge>;
      case "rejected":
        return <Badge variant="destructive"><UserX className="w-3 h-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleStatusUpdate = (status: "approved" | "rejected") => {
    if (!selectedApplication) return;
    
    updateStatusMutation.mutate({
      id: selectedApplication.id,
      status,
      notes: notes.trim() || undefined,
    });
  };

  if (isLoading) {
    return <div className="p-8">Loading applications...</div>;
  }

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            User Applications Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Membership</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No applications found
                    </TableCell>
                  </TableRow>
                ) : (
                  applications.map((application: UserApplication) => (
                    <TableRow key={application.id}>
                      <TableCell className="font-medium">
                        {application.firstName} {application.lastName}
                      </TableCell>
                      <TableCell>{application.email}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {application.membershipTier}
                        </Badge>
                      </TableCell>
                      <TableCell>{getStatusBadge(application.status)}</TableCell>
                      <TableCell>
                        {new Date(application.submittedAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedApplication(application);
                                setNotes(application.notes || "");
                              }}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              Review
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Review Application</DialogTitle>
                            </DialogHeader>
                            {selectedApplication && (
                              <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="text-sm font-medium">Name</label>
                                    <p className="text-sm text-muted-foreground">
                                      {selectedApplication.firstName} {selectedApplication.lastName}
                                    </p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">Email</label>
                                    <p className="text-sm text-muted-foreground">
                                      {selectedApplication.email}
                                    </p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">Phone</label>
                                    <p className="text-sm text-muted-foreground">
                                      {selectedApplication.phone || "Not provided"}
                                    </p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">Membership Tier</label>
                                    <p className="text-sm text-muted-foreground capitalize">
                                      {selectedApplication.membershipTier}
                                    </p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">Current Status</label>
                                    <p className="text-sm">{getStatusBadge(selectedApplication.status)}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">Submitted</label>
                                    <p className="text-sm text-muted-foreground">
                                      {new Date(selectedApplication.submittedAt).toLocaleString()}
                                    </p>
                                  </div>
                                </div>

                                <div>
                                  <label className="text-sm font-medium mb-2 block">Admin Notes</label>
                                  <Textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Add notes about this application..."
                                    rows={3}
                                  />
                                </div>

                                {selectedApplication.status === "pending" && (
                                  <div className="flex gap-3">
                                    <Button
                                      onClick={() => handleStatusUpdate("approved")}
                                      disabled={updateStatusMutation.isPending}
                                      className="bg-green-600 hover:bg-green-700"
                                    >
                                      <UserCheck className="w-4 h-4 mr-2" />
                                      Approve
                                    </Button>
                                    <Button
                                      onClick={() => handleStatusUpdate("rejected")}
                                      disabled={updateStatusMutation.isPending}
                                      variant="destructive"
                                    >
                                      <UserX className="w-4 h-4 mr-2" />
                                      Reject
                                    </Button>
                                  </div>
                                )}
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}