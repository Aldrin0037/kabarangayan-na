import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Plus, Search, Filter, Download, Eye } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAuth } from '@/hooks/useAuth';
import { Application, ApplicationStatus } from '@/types';
import { formatDate, formatCurrency, getStatusColor, getStatusLabel } from '@/utils/helpers';
import { APPLICATION_STATUS_CONFIG } from '@/utils/constants';

// import { supabase } from '@/lib/supabaseClient';

const Applications = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState<Application[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<Application[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | 'all'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<any | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Fetch and subscribe to applications from Supabase
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Fetch applications from localStorage (mock)
    setIsLoading(true);
    const mockApplications = JSON.parse(localStorage.getItem('mockApplications') || '[]');
    const userApps = mockApplications.filter((app: any) => app.userId === user.id);
    // Sort by submittedAt descending
    userApps.sort((a: any, b: any) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
    setApplications(userApps);
    setFilteredApplications(userApps);
    setIsLoading(false);
  }, [user, navigate]);

  useEffect(() => {
    let filtered = applications;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(app =>
        app.documentType?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.purpose.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(app => app.status === statusFilter);
    }

    setFilteredApplications(filtered);
  }, [applications, searchTerm, statusFilter]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-primary">My Applications</h1>
              <p className="text-sm text-muted-foreground">
                Track and manage your document requests
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button onClick={() => navigate('/dashboard')} variant="outline">
                Back to Dashboard
              </Button>
              <Button onClick={() => navigate('/applications/new')} variant="civic">
                <Plus className="w-4 h-4 mr-2" />
                New Application
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Filter Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search by document type, purpose, or tracking number..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="w-full md:w-48">
                <Select
                  value={statusFilter}
                  onValueChange={(value) => setStatusFilter(value as ApplicationStatus | 'all')}
                >
                  <SelectTrigger>
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    {Object.entries(APPLICATION_STATUS_CONFIG).map(([status, config]) => (
                      <SelectItem key={status} value={status}>
                        {config.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Applications Table */}
        <Card>
          <CardHeader>
            <CardTitle>Applications ({filteredApplications.length})</CardTitle>
            <CardDescription>
              Your document requests and their current processing status
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Loading applications...</p>
              </div>
            ) : filteredApplications.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Document Type</TableHead>
                      <TableHead>Purpose</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead>Tracking #</TableHead>
                      <TableHead>Fee</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredApplications.map((application) => (
                      <TableRow key={application.id}>
                        <TableCell className="font-medium">
                          {application.documentType?.name}
                        </TableCell>
                        <TableCell className="max-w-xs">
                          <div className="truncate" title={application.purpose}>
                            {application.purpose}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(application.status)}>
                            {getStatusLabel(application.status)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {formatDate(application.submittedAt)}
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {application.trackingNumber}
                        </TableCell>
                        <TableCell>
                          {application.documentType ? 
                            formatCurrency(application.documentType.fee) : 
                            'N/A'
                          }
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedApp(application);
                                setDialogOpen(true);
                              }}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </Button>
      {/* Application Details Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg w-full">
          <DialogHeader>
            <DialogTitle>Application Details</DialogTitle>
            <DialogDescription>
              Review your application information and status.
            </DialogDescription>
          </DialogHeader>
          {selectedApp && (
            <div className="space-y-4">
              <div>
                <span className="font-semibold">Document Type:</span> {selectedApp.documentType?.name}
              </div>
              <div>
                <span className="font-semibold">Purpose:</span> {selectedApp.purpose}
              </div>
              <div>
                <span className="font-semibold">Status:</span> <Badge className={getStatusColor(selectedApp.status)}>{getStatusLabel(selectedApp.status)}</Badge>
              </div>
              <div>
                <span className="font-semibold">Tracking Number:</span> {selectedApp.trackingNumber}
              </div>
              <div>
                <span className="font-semibold">Submitted:</span> {formatDate(selectedApp.submittedAt)}
              </div>
              {selectedApp.attachments && selectedApp.attachments.length > 0 && (
                <div>
                  <span className="font-semibold">Attachments:</span>
                  <ul className="list-disc pl-5 mt-1 text-sm">
                    {selectedApp.attachments.map((file: any, idx: number) => (
                      <li key={idx}>{file.name} ({(file.size / 1024).toFixed(1)} KB)</li>
                    ))}
                  </ul>
                </div>
              )}
              {selectedApp.rejectionReason && (
                <div>
                  <span className="font-semibold text-destructive">Rejection Reason:</span> {selectedApp.rejectionReason}
                </div>
              )}
            </div>
          )}
          <DialogClose asChild>
            <Button className="mt-6 w-full" variant="civic">Close</Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
      {/* Application Details Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg w-full">
          <DialogHeader>
            <DialogTitle>Application Details</DialogTitle>
            <DialogDescription>
              Review your application information and status.
            </DialogDescription>
          </DialogHeader>
          {selectedApp && (
            <div className="space-y-4">
              <div>
                <span className="font-semibold">Document Type:</span> {selectedApp.documentType?.name}
              </div>
              <div>
                <span className="font-semibold">Purpose:</span> {selectedApp.purpose}
              </div>
              <div>
                <span className="font-semibold">Status:</span> <Badge className={getStatusColor(selectedApp.status)}>{getStatusLabel(selectedApp.status)}</Badge>
              </div>
              <div>
                <span className="font-semibold">Tracking Number:</span> {selectedApp.trackingNumber}
              </div>
              <div>
                <span className="font-semibold">Submitted:</span> {formatDate(selectedApp.submittedAt)}
              </div>
              {selectedApp.attachments && selectedApp.attachments.length > 0 && (
                <div>
                  <span className="font-semibold">Attachments:</span>
                  <ul className="list-disc pl-5 mt-1 text-sm">
                    {selectedApp.attachments.map((file: any, idx: number) => (
                      <li key={idx}>{file.name} ({(file.size / 1024).toFixed(1)} KB)</li>
                    ))}
                  </ul>
                </div>
              )}
              {selectedApp.rejectionReason && (
                <div>
                  <span className="font-semibold text-destructive">Rejection Reason:</span> {selectedApp.rejectionReason}
                </div>
              )}
            </div>
          )}
          <DialogClose asChild>
            <Button className="mt-6 w-full" variant="civic">Close</Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
                            {application.status === 'completed' && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  // TODO: Implement download functionality
                                  console.log('Download document:', application.id);
                                }}
                              >
                                <Download className="w-4 h-4 mr-1" />
                                Download
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  {searchTerm || statusFilter !== 'all' 
                    ? 'No applications found' 
                    : 'No applications yet'}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {searchTerm || statusFilter !== 'all'
                    ? 'Try adjusting your search criteria or filters'
                    : 'Start by submitting your first document application'}
                </p>
                {(!searchTerm && statusFilter === 'all') && (
                  <Button onClick={() => navigate('/applications/new')} variant="civic">
                    <Plus className="w-4 h-4 mr-2" />
                    Apply for Document
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Applications;