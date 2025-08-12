import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-8">Welcome to FitFlow Pro</h1>
      <div className="flex gap-4">
        <Link href="/auth/login">
          <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Login
          </button>
        </Link>
        <Link href="/auth/register">
          <button className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
            Register
          </button>
        </Link>
      </div>
    </div>
  );
}
