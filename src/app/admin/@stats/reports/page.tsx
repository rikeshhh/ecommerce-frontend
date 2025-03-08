import Link from "next/link";

export default function Reports() {
  return (
    <div>
      <h4 className="text-sm font-medium mb-2">Detailed Reports</h4>
      <ul className="space-y-2">
        <li>Revenue: $12,345</li>
        <li>Signups: 89</li>
        <li>
          <Link
            href="/admin/dashboard"
            className="text-blue-500 hover:underline"
          >
            Back to Quick Stats
          </Link>
        </li>
      </ul>
    </div>
  );
}
