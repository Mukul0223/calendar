import { useAuth } from "@/context/AuthContext";

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className="container mx-auto">
      <p className="font-bold">Name: {user.name}</p>
      <p className="font-semibold"> Email:{user.email}</p>
      <p className="font-normal">ID: {user.id}</p>
    </div>
  );
}
