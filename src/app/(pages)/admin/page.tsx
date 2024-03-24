import Link from "next/link";

const AdminHomePage = () => {
  return (
    <div>
      <ul>
        <li>
          <Link href="/admin/bookings">Bookings</Link>
        </li>
        <li>
          <Link href="/admin/hotels">Hotels</Link>
        </li>
        <li>
          <Link href="/admin/hotel-chains">Hotel Chains</Link>
        </li>
        <li>
          <Link href="/admin/hotel-rooms">Hotel Rooms</Link>
        </li>
        <li>
          <Link href="/employees">Employees</Link>
        </li>
        <li>
          <Link href="/customers">Customers</Link>
        </li>
      </ul>
    </div>
  );
};

export default AdminHomePage;
