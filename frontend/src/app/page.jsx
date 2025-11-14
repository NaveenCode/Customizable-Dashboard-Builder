import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full text-center px-6">
        <h1 className="text-5xl font-bold mb-4 text-gray-900">
          Customizable Dashboard
        </h1>
        <p className="text-gray-600 mb-8 text-lg">
          Create your perfect workspace with customizable widgets. Track time,
          take notes, and manage todos all in one place.
        </p>
        <div className="space-x-4">
          <Link
            href="/login"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="inline-block bg-gray-200 text-gray-800 px-8 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
