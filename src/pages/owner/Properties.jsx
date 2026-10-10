import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getPropertiesByOwner, COLLECTIONS, createDocument } from "../../lib/firestore";
import { PageHeader, Card, Button, ButtonLink, Badge, EmptyState, Spinner, Modal, Input, Textarea, Select } from "../../components/ui";
import { FiPlus, FiMapPin, FiHome, FiEdit, FiTrash2, FiEye } from "react-icons/fi";

const propertyTypes = [
  { value: "apartment_building", label: "Apartment Building" },
  { value: "house", label: "House" },
  { value: "commercial", label: "Commercial" },
  { value: "mixed", label: "Mixed Use" },
];

export default function OwnerProperties() {
  const { user } = useAuth();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    postalCode: "",
    propertyType: "apartment_building",
    description: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProperties();
  }, [user]);

  const fetchProperties = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await getPropertiesByOwner(user.uid);
      setProperties(data);
    } catch (error) {
      console.error("Error fetching properties:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await createDocument(COLLECTIONS.PROPERTIES, {
        ...formData,
        ownerId: user.uid,
        status: "active",
        unitCount: 0,
      });
      setModalOpen(false);
      setFormData({ name: "", address: "", city: "", postalCode: "", propertyType: "apartment_building", description: "" });
      fetchProperties();
    } catch (error) {
      console.error("Error creating property:", error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex min-h-[50vh] items-center justify-center"><Spinner size="lg" /></div>;
  }

  return (
    <div>
      <PageHeader
        title="Properties"
        subtitle="Manage your properties and their units"
        actions={
          <Button onClick={() => setModalOpen(true)} className="gap-2">
            <FiPlus className="h-4 w-4" />
            Add Property
          </Button>
        }
      />

      {properties.length === 0 ? (
        <EmptyState
          icon={FiMapPin}
          title="No properties yet"
          description="Add your first property to start managing units and listings."
          action={<Button onClick={() => setModalOpen(true)}>Add Property</Button>}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((property) => (
            <Card key={property.id} className="card-hover">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <FiMapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{property.name}</h3>
                    <p className="text-sm text-gray-500">{property.city}</p>
                  </div>
                </div>
                <Badge variant="success">Active</Badge>
              </div>
              <p className="mt-4 text-sm text-gray-500">{property.address}</p>
              <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
                <span className="text-sm text-gray-500">{property.unitCount || 0} units</span>
                <div className="flex gap-2">
                  <Link to={`/dashboard/properties/${property.id}`} className="rounded-lg p-2 text-gray-500 hover:bg-gray-100">
                    <FiEye className="h-4 w-4" />
                  </Link>
                  <button className="rounded-lg p-2 text-gray-500 hover:bg-gray-100">
                    <FiEdit className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Add New Property">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Property Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
          <Input label="Address" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} required />
          <div className="grid grid-cols-2 gap-4">
            <Input label="City" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} required />
            <Input label="Postal Code" value={formData.postalCode} onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })} />
          </div>
          <Select label="Property Type" options={propertyTypes} value={formData.propertyType} onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })} />
          <Textarea label="Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} />
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" loading={saving}>Add Property</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
