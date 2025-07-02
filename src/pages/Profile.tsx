import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save, User, Eye, EyeOff, KeyRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { updateUserSchema, UpdateUserFormData, changePasswordSchema, ChangePasswordFormData } from '@/lib/validations';

const Profile = () => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { user, updateUser, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
    reset: resetProfile
  } = useForm<UpdateUserFormData>({
    resolver: zodResolver(updateUserSchema)
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
    reset: resetPassword
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema)
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Pre-fill the form with user data
    resetProfile({
      firstName: user.firstName,
      lastName: user.lastName,
      middleName: user.middleName || '',
      contactNumber: user.contactNumber || '',
      address: user.address || ''
    });
  }, [user, navigate, resetProfile]);

  const onProfileSubmit = async (data: UpdateUserFormData) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Update user profile
      updateUser(data);
      toast({
        title: 'Profile updated',
        description: 'Your profile information has been updated successfully.'
      });
    } catch (error) {
      toast({
        title: 'Update failed',
        description: error instanceof Error ? error.message : 'Failed to update profile',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onPasswordSubmit = async (data: ChangePasswordFormData) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // In a real app, this would call an API to change the password
      // For now, we'll just simulate success
      setTimeout(() => {
        toast({
          title: 'Password changed',
          description: 'Your password has been changed successfully.'
        });
        resetPassword();
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      toast({
        title: 'Password change failed',
        description: error instanceof Error ? error.message : 'Failed to change password',
        variant: 'destructive'
      });
      setIsLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-primary">My Profile</h1>
              <p className="text-sm text-muted-foreground">
                View and update your account information
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button onClick={() => navigate('/dashboard')} variant="outline">
                Back to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full md:w-[400px] grid-cols-2">
            <TabsTrigger value="profile">Profile Information</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your personal information and contact details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form id="profile-form" onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        placeholder="Juan"
                        {...registerProfile('firstName')}
                        className={profileErrors.firstName ? 'border-destructive' : ''}
                      />
                      {profileErrors.firstName && (
                        <p className="text-sm text-destructive">{profileErrors.firstName.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        placeholder="Dela Cruz"
                        {...registerProfile('lastName')}
                        className={profileErrors.lastName ? 'border-destructive' : ''}
                      />
                      {profileErrors.lastName && (
                        <p className="text-sm text-destructive">{profileErrors.lastName.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="middleName">Middle Name (Optional)</Label>
                    <Input
                      id="middleName"
                      placeholder="Santos"
                      {...registerProfile('middleName')}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={user.email}
                      disabled
                      className="bg-muted"
                    />
                    <p className="text-xs text-muted-foreground">Email address cannot be changed</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactNumber">Contact Number</Label>
                    <Input
                      id="contactNumber"
                      placeholder="09123456789"
                      {...registerProfile('contactNumber')}
                      className={profileErrors.contactNumber ? 'border-destructive' : ''}
                    />
                    {profileErrors.contactNumber && (
                      <p className="text-sm text-destructive">{profileErrors.contactNumber.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Complete Address</Label>
                    <Textarea
                      id="address"
                      placeholder="House No., Street, Subdivision, Las Piñas City"
                      {...registerProfile('address')}
                      className={profileErrors.address ? 'border-destructive' : ''}
                    />
                    {profileErrors.address && (
                      <p className="text-sm text-destructive">{profileErrors.address.message}</p>
                    )}
                  </div>
                </form>
              </CardContent>
              <CardFooter>
                <Button 
                  type="submit" 
                  form="profile-form" 
                  disabled={isLoading}
                  className="ml-auto"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>
                  Update your password to keep your account secure
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form id="password-form" onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        type={showCurrentPassword ? 'text' : 'password'}
                        placeholder="Enter your current password"
                        {...registerPassword('currentPassword')}
                        className={passwordErrors.currentPassword ? 'border-destructive pr-10' : 'pr-10'}
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                    {passwordErrors.currentPassword && (
                      <p className="text-sm text-destructive">{passwordErrors.currentPassword.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={showNewPassword ? 'text' : 'password'}
                        placeholder="Enter your new password"
                        {...registerPassword('newPassword')}
                        className={passwordErrors.newPassword ? 'border-destructive pr-10' : 'pr-10'}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                    {passwordErrors.newPassword && (
                      <p className="text-sm text-destructive">{passwordErrors.newPassword.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
                    <div className="relative">
                      <Input
                        id="confirmNewPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Confirm your new password"
                        {...registerPassword('confirmNewPassword')}
                        className={passwordErrors.confirmNewPassword ? 'border-destructive pr-10' : 'pr-10'}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                    {passwordErrors.confirmNewPassword && (
                      <p className="text-sm text-destructive">{passwordErrors.confirmNewPassword.message}</p>
                    )}
                  </div>
                </form>
              </CardContent>
              <CardFooter>
                <Button 
                  type="submit" 
                  form="password-form" 
                  disabled={isLoading}
                  className="ml-auto"
                >
                  <KeyRound className="w-4 h-4 mr-2" />
                  {isLoading ? 'Updating...' : 'Change Password'}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Account Information Card */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>
              Details about your account status and role
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Account Status</h3>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                  <p className="font-medium">Active</p>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Account Type</h3>
                <p className="font-medium capitalize">{user.role}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Member Since</h3>
                <p className="font-medium">January 2024</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">User ID</h3>
                <p className="font-medium font-mono text-sm">{user.id}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;