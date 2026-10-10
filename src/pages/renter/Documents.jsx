import { PageHeader, Card, EmptyState, Badge, Button } from "../../components/ui";
import { FiFileText, FiUpload } from "react-icons/fi";

export default function RenterDocuments() {
  const documents = [];
  
  return (
    <div>
      <PageHeader title="Documents" subtitle="Upload and manage your verification documents" />
      {documents.length === 0 ? (
        <EmptyState 
          icon={FiFileText} 
          title="No documents yet" 
          description="When a landlord requests documents, you can upload them here."
        />
      ) : (
        <div className="space-y-4">
          {documents.map((doc) => (
            <Card key={doc.id}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{doc.name}</p>
                  <p className="text-sm text-gray-500">Uploaded {doc.date}</p>
                </div>
                <Badge>{doc.status}</Badge>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
