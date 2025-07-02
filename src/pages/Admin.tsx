import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, FileText, Settings, BarChart3, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Application, User, DashboardStats } from '@/types';
import { formatDate, formatCurrency, getStatusColor, getStatusLabel } from '@/utils/helpers';
import { supabase } from '@/lib/supabaseClient';

const Admin = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
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

  // Fetch data from Supabase
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (user.role !== 'admin') {
      navigate('/dashboard');
      return;
    }

    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch applications with user and document type data
        const { data: applicationsData, error: applicationsError } = await supabase
          .from('applications')
          .select(`
            *,
            users:user_id (id, email, first_name, last_name, contact_number, address, role, is_active, created_at, updated_at),
            document_types:document_type_id (id, name, description, requirements, fee, processing_time, is_active)
          `)
          .order('submitted_at', { ascending: false });

        if (applicationsError) {
          throw new Error(applicationsError.message);
        }

        // Fetch users
        const { data: usersData, error: usersError } = await supabase
          .from('users')
          .select('*')
          .order('created_at', { ascending: false });

        if (usersError) {
          throw new Error(usersError.message);
        }

        // Transform data to match our types
        const transformedApplications: Application[] = applicationsData.map(app => ({
          id: app.id,
          userId: app.user_id,
          documentTypeId: app.document_type_id,
          purpose: app.purpose,
          status: app.status,
          submittedAt: new Date(app.submitted_at),
          processedAt: app.processed_at ? new Date(app.processed_at) : undefined,
          processedBy: app.processed_by,
          completedAt: app.completed_at ? new Date(app.completed_at) : undefined,
          rejectionReason: app.rejection_reason,
          trackingNumber: app.tracking_number,
          attachments: app.attachments || [],
          user: app.users ? {
            id: app.users.id,
            email: app.users.email,
            firstName: app.users.first_name,
            lastName: app.users.last_name,
            contactNumber: app.users.contact_number,
            address: app.users.address,
            role: app.users.role,
            isActive: app.users.is_active,
            createdAt: new Date(app.users.created_at),
            updatedAt: new Date(app.users.updated_at)
          } : undefined,
          documentType: app.document_types ? {
            id: app.document_types.id,
            name: app.document_types.name,
            description: app.document_types.description,
            requirements: app.document_types.requirements,
            fee: app.document_types.fee,
            processingTime: app.document_types.processing_time,
            isActive: app.document_types.is_active
          } : undefined
        }));

        const transformedUsers: User[] = usersData.map(u => ({
          id: u.id,
          email: u.email,
          firstName: u.first_name,
          lastName: u.last_name,
          middleName: u.middle_name,
          contactNumber: u.contact_number,
          address: u.address,
          role: u.role,
          isActive: u.is_active,
          createdAt: new Date(u.created_at),
          updatedAt: new Date(u.updated_at)
        }));

        // Calculate stats
        const stats: DashboardStats = {
          totalApplications: transformedApplications.length,
          pendingApplications: transformedApplications.filter(app => app.status === 'pending').length,
          approvedApplications: transformedApplications.filter(app => app.status === 'approved').length,
          completedApplications: transformedApplications.filter(app => app.status === 'completed').length,
          totalUsers: transformedUsers.length,
          recentApplications: transformedApplications.slice(0, 5)
        };

        setApplications(transformedApplications);
        setUsers(transformedUsers);
        setStats(stats);
      } catch (error) {
        console.error('Error fetching admin data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load admin data. Please try again.',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    // Set up real-time subscription for applications
    const applicationsSubscription = supabase
      .channel('admin-applications-changes')
      .on('postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'applications'
        },
        () => {
          // Refresh data when changes occur
          fetchData();
        }
      )
      .subscribe();

    // Set up real-time subscription for users
    const usersSubscription = supabase
      .channel('admin-users-changes')
      .on('postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'users'
        },
        () => {
          // Refresh data when changes occur
          fetchData();
        }
      )
      .subscribe();

    // Cleanup subscriptions
    return () => {
      supabase.removeChannel(applicationsSubscription);
      supabase.removeChannel(usersSubscription);
    };
  }, [user, navigate, toast]);

  const handleProcessApplication = async (applicationId: string, action: 'approve' | 'reject') => {
    try {
      const newStatus = action === 'approve' ? 'approved' : 'rejected';
      const now = new Date().toISOString();

      // Update the application in Supabase
      const { error } = await supabase
        .from('applications')
        .update({
          status: newStatus,
          processed_at: now,
          processed_by: user?.id
        })
        .eq('id', applicationId);

      if (error) {
        throw new Error(error.message);
      }

      // No need to update local state; real-time subscription will refresh data
      toast({
        title: `Application ${action === 'approve' ? 'Approved' : 'Rejected'}`,
        description: `The application has been successfully ${action === 'approve' ? 'approved' : 'rejected'}.`,
        variant: 'default'
      });
    } catch (error) {
      console.error(`Error ${action}ing application:`, error);
      toast({
        title: 'Error',
        description: `Failed to ${action} the application. Please try again.`,
        variant: 'destructive'
      });
    }
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