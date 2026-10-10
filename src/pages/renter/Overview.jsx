import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Card, StatsCard, Badge, ButtonLink } from "../../components/ui";
import { FiHome, FiHeart, FiFileText, FiDollarSign, FiCalendar, FiArrowRight } from "react-icons/fi";

export default function RenterOverview() {
  const { userProfile } = useAuth();
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {userProfile?.displayName?.split(" ")[0] || "Renter"}!</h1>
        <p className="mt-1 text-gray-500">Here's an overview of your rental journey.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard label="Saved Homes" value="5" icon={FiHeart} />
        <StatsCard label="Applications" value="2" icon={FiFileText} />
        <StatsCard label="Next Rent Due" value="€850" icon={FiDollarSign} change="Due Nov 1" trend="neutral" />
        <StatsCard label="Open Requests" value="1" icon={FiCalendar} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">My Tenancy</h2>
            <Link to="/my-home/tenancy" className="text-sm text-primary hover:text-primary-dark">View details</Link>
          </div>
          <div className="rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <FiHome className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Modern 2BR Apartment</p>
                <p className="text-sm text-gray-500">Mitte, Berlin</p>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="text-gray-500">Since Jan 2024</span>
              <Badge variant="success">Active</Badge>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Upcoming Payments</h2>
            <Link to="/my-home/rent" className="text-sm text-primary hover:text-primary-dark">View all</Link>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-lg border border-gray-200 p-3">
              <div>
                <p className="font-medium text-gray-900">November Rent</p>
                <p className="text-sm text-gray-500">Due Nov 1, 2024</p>
              </div>
              <p className="font-semibold text-gray-900">€850</p>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Applications</h2>
          <Link to="/my-home/applications" className="text-sm text-primary hover:text-primary-dark">View all</Link>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
            <div>
              <p className="font-medium text-gray-900">Studio in Kreuzberg</p>
              <p className="text-sm text-gray-500">Applied Oct 15, 2024</p>
            </div>
            <Badge variant="warning">In Review</Badge>
          </div>
        </div>
      </Card>
    </div>
  );
}
