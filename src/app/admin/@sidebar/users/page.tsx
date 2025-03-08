interface User {
  id: number;
  name: string;
}

async function fetchUsers(): Promise<User[]> {
  return [
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" },
  ];
}

export default async function UsersPage() {
  const users = await fetchUsers();

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">User Management</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
}
