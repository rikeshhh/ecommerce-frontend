import Link from "next/link";

export default function Stats() {
  return (
    <div>
      <ul className="space-y-2">
        <li>Total Users: 1,234</li>
        <li>Active Sessions: 567</li>
        <li>
          <Link href="/admin/reports" className="text-blue-500 hover:underline">
            View Detailed Reports
          </Link>
        </li>
      </ul>
    </div>
  );
}
