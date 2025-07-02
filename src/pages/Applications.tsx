import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Plus, Search, Filter, Download, Eye } from 'lucide-react';
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

const Applications = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState<Application[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<Application[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | 'all'>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Mock data for development
    const mockApplications: Application[] = [
      {
        id: '1',
        userId: user.id,
        documentTypeId: '1',
        purpose: 'Employment requirements for new job application',
        status: 'completed',
        submittedAt: new Date('2024-01-15'),
        processedAt: new Date('2024-01-16'),
        completedAt: new Date('2024-01-17'),
        trackingNumber: 'BA202401001',
        attachments: [],
        documentType: {
          id: '1',
          name: 'Barangay Clearance',
          description: 'Certificate of good standing',
          requirements: [],
          fee: 50,
          processingTime: '1-2 days',
          isActive: true
        }
      },
      {
        id: '2',
        userId: user.id,
        documentTypeId: '2',
        purpose: 'School enrollment for my child',
        status: 'pending',
        submittedAt: new Date('2024-01-20'),
        trackingNumber: 'BA202401002',
        attachments: [],
        documentType: {
          id: '2',
          name: 'Certificate of Residency',
          description: 'Proof of residence',
          requirements: [],
          fee: 30,
          processingTime: '1-2 days',
          isActive: true
        }
      },
      {
        id: '3',
        userId: user.id,
        documentTypeId: '3',
        purpose: 'Business permit application',
        status: 'under_review',
        submittedAt: new Date('2024-01-18'),
        processedAt: new Date('2024-01-19'),
        trackingNumber: 'BA202401003',
        attachments: [],
        documentType: {
          id: '3',
          name: 'Business Permit',
          description: 'Permit to operate business',
          requirements: [],
          fee: 500,
          processingTime: '5-7 days',
          isActive: true
        }
      },
      {
        id: '4',
        userId: user.id,
        documentTypeId: '4',
        purpose: 'Medical assistance application',
        status: 'approved',
        submittedAt: new Date('2024-01-12'),
        processedAt: new Date('2024-01-14'),
        trackingNumber: 'BA202401004',
        attachments: [],
        documentType: {
          id: '4',
          name: 'Certificate of Indigency',
          description: 'Certificate for low-income families',
          requirements: [],
          fee: 0,
          processingTime: '2-3 days',
          isActive: true
        }
      }
    ];

    setApplications(mockApplications);
    setFilteredApplications(mockApplications);
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
                              onClick={() => navigate(`/applications/${application.id}`)}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </Button>
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