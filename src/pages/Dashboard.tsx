import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Clock, CheckCircle, XCircle, Plus, User, LogOut, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Application, DashboardStats } from '@/types';
import { formatDate, formatCurrency, getStatusColor, getStatusLabel } from '@/utils/helpers';

import { supabase } from '@/lib/supabaseClient';

const Dashboard = () => {
  const { user, logout } = useAuth();
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

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    let subscription: any;

    async function fetchStats() {
      // Fetch applications for the user
      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          document_types:document_type_id (
            id, name, description, requirements, fee, processing_time, is_active
          )
        `)
        .eq('user_id', user.id)
        .order('submitted_at', { ascending: false });

      if (error) {
        setStats({
          totalApplications: 0,
          pendingApplications: 0,
          approvedApplications: 0,
          completedApplications: 0,
          totalUsers: 0,
          recentApplications: []
        });
        return;
      }

      // Map document_types to documentType for compatibility
      const apps = (data || []).map((app: any) => ({
        ...app,
        documentType: app.document_types,
        submittedAt: app.submitted_at ? new Date(app.submitted_at) : undefined,
        processedAt: app.processed_at ? new Date(app.processed_at) : undefined,
        completedAt: app.completed_at ? new Date(app.completed_at) : undefined,
        attachments: app.attachments || [],
      }));

      // Calculate stats
      const totalApplications = apps.length;
      const pendingApplications = apps.filter((a) => a.status === 'pending').length;
      const approvedApplications = apps.filter((a) => a.status === 'approved').length;
      const completedApplications = apps.filter((a) => a.status === 'completed').length;
      // Show up to 5 most recent applications
      const recentApplications = apps.slice(0, 5);

      setStats({
        totalApplications,
        pendingApplications,
        approvedApplications,
        completedApplications,
        totalUsers: user.role === 'admin' ? 0 : 0, // You can implement admin stats separately
        recentApplications
      });
    }

    fetchStats();

    // Real-time subscription
    subscription = supabase
      .channel('dashboard-applications')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'applications', filter: `user_id=eq.${user.id}` },
        (payload) => {
          fetchStats();
        }
      )
      .subscribe();

    return () => {
      if (subscription) supabase.removeChannel(subscription);
    };
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    toast({
      title: 'Logged out successfully',
      description: 'Thank you for using our service!'
    });
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-primary">
                Barangay Almanza Dos
              </h1>
              <p className="text-sm text-muted-foreground">
                Document Management System
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="font-medium">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-sm text-muted-foreground capitalize">
                  {user.role}
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">
            Welcome back, {user.firstName}!
          </h2>
          <p className="text-muted-foreground">
            Here's an overview of your document applications and account status.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Button
            onClick={() => navigate('/applications/new')}
            className="h-auto p-6 flex-col space-y-2"
            variant="civic"
          >
            <Plus className="w-8 h-8" />
            <span className="text-lg font-semibold">Apply for Document</span>
            <span className="text-sm opacity-90">Submit a new application</span>
          </Button>

          <Button
            onClick={() => navigate('/applications')}
            className="h-auto p-6 flex-col space-y-2"
            variant="outline"
          >
            <FileText className="w-8 h-8" />
            <span className="text-lg font-semibold">My Applications</span>
            <span className="text-sm opacity-90">Track your submissions</span>
          </Button>

          <Button
            onClick={() => navigate('/profile')}
            className="h-auto p-6 flex-col space-y-2"
            variant="outline"
          >
            <User className="w-8 h-8" />
            <span className="text-lg font-semibold">My Profile</span>
            <span className="text-sm opacity-90">Update your information</span>
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalApplications}</div>
              <p className="text-xs text-muted-foreground">
                All time submissions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {stats.pendingApplications}
              </div>
              <p className="text-xs text-muted-foreground">
                Awaiting review
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {stats.approvedApplications}
              </div>
              <p className="text-xs text-muted-foreground">
                Ready for processing
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {stats.completedApplications}
              </div>
              <p className="text-xs text-muted-foreground">
                Documents ready
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Applications */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Applications</CardTitle>
            <CardDescription>
              Your latest document requests and their current status
            </CardDescription>
          </CardHeader>
          <CardContent>
            {stats.recentApplications.length > 0 ? (
              <div className="space-y-4">
                {stats.recentApplications.map((application) => (
                  <div
                    key={application.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold">
                          {application.documentType?.name}
                        </h4>
                        <Badge className={getStatusColor(application.status)}>
                          {getStatusLabel(application.status)}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Purpose: {application.purpose}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Submitted: {formatDate(application.submittedAt)}</span>
                        <span>Tracking: {application.trackingNumber}</span>
                        {application.documentType && (
                          <span>Fee: {formatCurrency(application.documentType.fee)}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/applications/${application.id}`)}
                      >
                        View Details
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
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold mb-2">No applications yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start by applying for your first document
                </p>
                <Button onClick={() => navigate('/applications/new')}>
                  <Plus className="w-4 h-4 mr-2" />
                  Apply Now
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Admin Panel Access */}
        {user.role === 'admin' && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Admin Panel</CardTitle>
              <CardDescription>
                Manage applications, users, and system settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate('/admin')} variant="civic">
                <FileText className="w-4 h-4 mr-2" />
                Go to Admin Panel
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Dashboard;