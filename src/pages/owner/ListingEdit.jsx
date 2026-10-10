import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PageHeader, Card, Input, Textarea, Select, Button, Checkbox } from "../../components/ui";

const propertyTypes = [
  { value: "apartment", label: "Apartment" },
  { value: "house", label: "House" },
  { value: "room", label: "Room" },
  { value: "studio", label: "Studio" },
];

export default function OwnerListingEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    propertyType: "apartment",
    city: "",
    address: "",
    area: "",
    rentAmount: "",
    depositAmount: "",
    bedrooms: "1",
    bathrooms: "1",
    sqm: "",
    furnished: false,
    anmeldung: true,
    availableFrom: "",
    amenities: [],
    rules: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    // TODO: Save to Firestore
    setTimeout(() => {
      setSaving(false);
      navigate("/dashboard/listings");
    }, 1000);
  };

  return (
    <div>
      <PageHeader title={isEditing ? "Edit Listing" : "Create New Listing"} />
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Listing Title" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} placeholder="Modern 2BR Apartment in Mitte" required className="sm:col-span-2" />
            <Select label="Property Type" options={propertyTypes} value={formData.propertyType} onChange={(e) => setFormData({...formData, propertyType: e.target.value})} />
            <Input label="City" value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} required />
            <Input label="Address" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} required className="sm:col-span-2" />
            <Input label="Area/Neighborhood" value={formData.area} onChange={(e) => setFormData({...formData, area: e.target.value})} />
            <Textarea label="Description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} rows={4} className="sm:col-span-2" />
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Pricing & Details</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <Input label="Monthly Rent (€)" type="number" value={formData.rentAmount} onChange={(e) => setFormData({...formData, rentAmount: e.target.value})} required />
            <Input label="Deposit (€)" type="number" value={formData.depositAmount} onChange={(e) => setFormData({...formData, depositAmount: e.target.value})} />
            <Input label="Size (m²)" type="number" value={formData.sqm} onChange={(e) => setFormData({...formData, sqm: e.target.value})} />
            <Input label="Bedrooms" type="number" value={formData.bedrooms} onChange={(e) => setFormData({...formData, bedrooms: e.target.value})} />
            <Input label="Bathrooms" type="number" value={formData.bathrooms} onChange={(e) => setFormData({...formData, bathrooms: e.target.value})} />
            <Input label="Available From" type="date" value={formData.availableFrom} onChange={(e) => setFormData({...formData, availableFrom: e.target.value})} />
          </div>
          <div className="mt-4 flex flex-wrap gap-6">
            <Checkbox label="Furnished" checked={formData.furnished} onChange={(e) => setFormData({...formData, furnished: e.target.checked})} />
            <Checkbox label="Anmeldung Possible" checked={formData.anmeldung} onChange={(e) => setFormData({...formData, anmeldung: e.target.checked})} />
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">House Rules</h2>
          <Textarea label="Rules & Requirements" value={formData.rules} onChange={(e) => setFormData({...formData, rules: e.target.value})} placeholder="No smoking, no pets, quiet hours after 10pm..." rows={3} />
        </Card>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="ghost" onClick={() => navigate("/dashboard/listings")}>Cancel</Button>
          <Button type="submit" loading={saving}>{isEditing ? "Update Listing" : "Create Listing"}</Button>
        </div>
      </form>
    </div>
  );
}
