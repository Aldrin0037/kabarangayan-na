import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, FileText, Settings, BarChart3, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { Application, User, DashboardStats } from '@/types';
import { formatDate, formatCurrency, getStatusColor, getStatusLabel } from '@/utils/helpers';

const Admin = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    totalApplications: 0,
    pendingApplications: 0,
    approvedApplications: 0,
    completedApplications: 0,
    totalUsers: 0,
    recentApplications: []
  });
  const [applications, setApplications] = useState<Application[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (user.role !== 'admin') {
      navigate('/dashboard');
      return;
    }

    // Mock data for development
    const mockStats: DashboardStats = {
      totalApplications: 45,
      pendingApplications: 12,
      approvedApplications: 8,
      completedApplications: 20,
      totalUsers: 150,
      recentApplications: []
    };

    const mockApplications: Application[] = [
      {
        id: '1',
        userId: '1',
        documentTypeId: '1',
        purpose: 'Employment requirements',
        status: 'pending',
        submittedAt: new Date('2024-01-20'),
        trackingNumber: 'BA202401001',
        attachments: [],
        user: {
          id: '1',
          email: 'juan@example.com',
          firstName: 'Juan',
          lastName: 'Dela Cruz',
          contactNumber: '09123456789',
          address: 'Sample Address',
          role: 'resident',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        documentType: {
          id: '1',
          name: 'Barangay Clearance',
          description: '',
          requirements: [],
          fee: 50,
          processingTime: '1-2 days',
          isActive: true
        }
      },
      {
        id: '2',
        userId: '2',
        documentTypeId: '2',
        purpose: 'School enrollment',
        status: 'under_review',
        submittedAt: new Date('2024-01-19'),
        trackingNumber: 'BA202401002',
        attachments: [],
        user: {
          id: '2',
          email: 'maria@example.com',
          firstName: 'Maria',
          lastName: 'Santos',
          contactNumber: '09123456788',
          address: 'Sample Address 2',
          role: 'resident',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        documentType: {
          id: '2',
          name: 'Certificate of Residency',
          description: '',
          requirements: [],
          fee: 30,
          processingTime: '1-2 days',
          isActive: true
        }
      }
    ];

    const mockUsers: User[] = [
      {
        id: '1',
        email: 'juan@example.com',
        firstName: 'Juan',
        lastName: 'Dela Cruz',
        contactNumber: '09123456789',
        address: 'Sample Address, Las Piñas City',
        role: 'resident',
        isActive: true,
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-15')
      },
      {
        id: '2',
        email: 'maria@example.com',
        firstName: 'Maria',
        lastName: 'Santos',
        contactNumber: '09123456788',
        address: 'Sample Address 2, Las Piñas City',
        role: 'resident',
        isActive: true,
        createdAt: new Date('2024-01-12'),
        updatedAt: new Date('2024-01-18')
      }
    ];

    setStats(mockStats);
    setApplications(mockApplications);
    setUsers(mockUsers);
    setIsLoading(false);
  }, [user, navigate]);

  const handleProcessApplication = (applicationId: string, action: 'approve' | 'reject') => {
    setApplications(prev => prev.map(app => 
      app.id === applicationId 
        ? { 
            ...app, 
            status: action === 'approve' ? 'approved' : 'rejected',
            processedAt: new Date(),
            processedBy: user?.id
          }
        : app
    ));
  };

  if (!user || user.role !== 'admin') return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-primary">Admin Panel</h1>
              <p className="text-sm text-muted-foreground">
                Manage applications, users, and system settings
              </p>
            </div>
            <Button onClick={() => navigate('/dashboard')} variant="outline">
              Back to Dashboard
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Statistics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalApplications}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {stats.pendingApplications}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Under Review</CardTitle>
              <AlertCircle className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {applications.filter(app => app.status === 'under_review').length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {stats.approvedApplications}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="applications" className="space-y-6">
          <TabsList className="grid w-full lg:w-auto grid-cols-3">
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          {/* Applications Tab */}
          <TabsContent value="applications">
            <Card>
              <CardHeader>
                <CardTitle>Recent Applications</CardTitle>
                <CardDescription>
                  Manage and process document applications
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Loading applications...</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Applicant</TableHead>
                          <TableHead>Document Type</TableHead>
                          <TableHead>Purpose</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Submitted</TableHead>
                          <TableHead>Fee</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {applications.map((application) => (
                          <TableRow key={application.id}>
                            <TableCell>
                              <div>
                                <div className="font-medium">
                                  {application.user?.firstName} {application.user?.lastName}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {application.user?.email}
                                </div>
                              </div>
                            </TableCell>
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
                            <TableCell>
                              {application.documentType ? 
                                formatCurrency(application.documentType.fee) : 
                                'N/A'
                              }
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {application.status === 'pending' && (
                                  <>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleProcessApplication(application.id, 'approve')}
                                      className="text-green-600 hover:text-green-700"
                                    >
                                      <CheckCircle className="w-4 h-4 mr-1" />
                                      Approve
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleProcessApplication(application.id, 'reject')}
                                      className="text-red-600 hover:text-red-700"
                                    >
                                      <XCircle className="w-4 h-4 mr-1" />
                                      Reject
                                    </Button>
                                  </>
                                )}
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => navigate(`/admin/applications/${application.id}`)}
                                >
                                  View Details
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>Registered Users</CardTitle>
                <CardDescription>
                  Manage user accounts and permissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">
                            {user.firstName} {user.lastName}
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{user.contactNumber}</TableCell>
                          <TableCell>
                            <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                              {user.role}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={user.isActive ? 'default' : 'destructive'}>
                              {user.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </TableCell>
                          <TableCell>{formatDate(user.createdAt)}</TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm">
                              Manage
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Application Reports
                  </CardTitle>
                  <CardDescription>
                    Generate reports for document applications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full justify-start">
                    Monthly Application Summary
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Document Type Analysis
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Processing Time Report
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    System Settings
                  </CardTitle>
                  <CardDescription>
                    Configure system parameters and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full justify-start">
                    Document Types Management
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Fee Configuration
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    System Backup
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;