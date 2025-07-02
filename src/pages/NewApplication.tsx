import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FileUp, ArrowLeft, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { applicationSchema, ApplicationFormData } from '@/lib/validations';
import { formatCurrency } from '@/utils/helpers';
import { supabase } from '@/lib/supabaseClient';

interface DocumentType {
  id: string;
  name: string;
  description: string;
  requirements: string[];
  fee: number;
  processingTime: string;
  isActive: boolean;
}

const NewApplication = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([]);
  const [selectedDocumentType, setSelectedDocumentType] = useState<DocumentType | null>(null);
  const [files, setFiles] = useState<File[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      documentTypeId: '',
      purpose: '',
      attachments: []
    }
  });

  const documentTypeId = watch('documentTypeId');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    async function fetchDocumentTypes() {
      const { data, error } = await supabase
        .from('document_types')
        .select('*')
        .eq('is_active', true)
        .order('name', { ascending: true });

      if (error) {
        setDocumentTypes([]);
        return;
      }
      setDocumentTypes(data || []);
    }

    fetchDocumentTypes();
  }, [user, navigate]);

  useEffect(() => {
    if (documentTypeId) {
      const docType = documentTypes.find(dt => dt.id === documentTypeId);
      setSelectedDocumentType(docType || null);
    } else {
      setSelectedDocumentType(null);
    }
  }, [documentTypeId, documentTypes]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileList = Array.from(e.target.files);
      setFiles(fileList);
      setValue('attachments', fileList);
    }
  };

  const onSubmit = async (data: ApplicationFormData) => {
    if (!user) return;
    setIsLoading(true);
    try {
      // TODO: Handle file uploads to Supabase Storage and store metadata in attachments table
      // For now, just store file names in attachments field
      const attachmentsMeta = files.map(file => ({
        name: file.name,
        size: file.size,
        type: file.type
      }));

      // Generate a tracking number (simple example)
      const trackingNumber = `BA${Date.now()}`;

      const { error } = await supabase.from('applications').insert([
        {
          user_id: user.id,
          document_type_id: data.documentTypeId,
          purpose: data.purpose,
          status: 'pending',
          tracking_number: trackingNumber,
          attachments: attachmentsMeta
        }
      ]);

      if (error) throw error;

      toast({
        title: 'Application submitted',
        description: 'Your document application has been submitted successfully.'
      });
      navigate('/applications');
    } catch (error) {
      toast({
        title: 'Submission failed',
        description: error instanceof Error ? error.message : 'Failed to submit application',
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
              <h1 className="text-2xl font-bold text-primary">New Application</h1>
              <p className="text-sm text-muted-foreground">
                Apply for a new document
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button onClick={() => navigate('/applications')} variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Applications
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Document Application Form</CardTitle>
                <CardDescription>
                  Fill in the required information to apply for your document
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form id="application-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="documentTypeId">Document Type</Label>
                    <Select
                      onValueChange={(value) => setValue('documentTypeId', value)}
                      defaultValue={documentTypeId}
                    >
                      <SelectTrigger className={errors.documentTypeId ? 'border-destructive' : ''}>
                        <SelectValue placeholder="Select document type" />
                      </SelectTrigger>
                      <SelectContent>
                        {documentTypes.map((docType) => (
                          <SelectItem key={docType.id} value={docType.id}>
                            {docType.name} ({formatCurrency(docType.fee)})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.documentTypeId && (
                      <p className="text-sm text-destructive">{errors.documentTypeId.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="purpose">Purpose</Label>
                    <Textarea
                      id="purpose"
                      placeholder="Explain why you need this document..."
                      {...register('purpose')}
                      className={errors.purpose ? 'border-destructive' : ''}
                    />
                    {errors.purpose && (
                      <p className="text-sm text-destructive">{errors.purpose.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="attachments">Attachments</Label>
                    <div className="border border-input rounded-md p-4">
                      <div className="flex items-center justify-center w-full">
                        <label
                          htmlFor="file-upload"
                          className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted transition-colors"
                        >
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <FileUp className="w-8 h-8 mb-2 text-muted-foreground" />
                            <p className="mb-2 text-sm text-muted-foreground">
                              <span className="font-semibold">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-xs text-muted-foreground">
                              PDF, JPG, PNG or DOC (MAX. 5MB)
                            </p>
                          </div>
                          <input
                            id="file-upload"
                            type="file"
                            multiple
                            className="hidden"
                            onChange={handleFileChange}
                          />
                        </label>
                      </div>
                      {files.length > 0 && (
                        <div className="mt-4 space-y-2">
                          <p className="text-sm font-medium">Selected Files:</p>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            {files.map((file, index) => (
                              <li key={index} className="flex items-center">
                                <FileUp className="w-4 h-4 mr-2" />
                                {file.name} ({(file.size / 1024).toFixed(1)} KB)
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {errors.attachments && (
                        <p className="text-sm text-destructive mt-2">{errors.attachments.message}</p>
                      )}
                    </div>
                  </div>
                </form>
              </CardContent>
              <CardFooter>
                <Button 
                  type="submit" 
                  form="application-form" 
                  disabled={isLoading}
                  className="ml-auto"
                  variant="civic"
                >
                  <Send className="w-4 h-4 mr-2" />
                  {isLoading ? 'Submitting...' : 'Submit Application'}
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div>
            {selectedDocumentType ? (
              <Card>
                <CardHeader>
                  <CardTitle>{selectedDocumentType.name}</CardTitle>
                  <CardDescription>
                    {selectedDocumentType.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Fee</h3>
                    <p className="text-xl font-bold">{formatCurrency(selectedDocumentType.fee)}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Processing Time</h3>
                    <p className="font-medium">{selectedDocumentType.processingTime}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Requirements</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      {selectedDocumentType.requirements.map((req, index) => (
                        <li key={index}>{req}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Document Information</CardTitle>
                  <CardDescription>
                    Select a document type to see details
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center py-12 text-muted-foreground">
                  <FileUp className="w-12 h-12 mx-auto mb-4" />
                  <p>Please select a document type to view its requirements and details</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewApplication;