import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

export default function UnauthorizedPage() {
  return (
    <div className="h-screen bg-gray-100 flex justify-center items-center">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full text-center">
        <div className="flex justify-center mb-4">
          <ExclamationTriangleIcon className="h-12 w-12 text-red-500" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Unauthorized Access
        </h1>
        <p className="text-gray-600 mb-6">
          You do not have permission to view this page. Please log in to
          continue.
        </p>
        <a
          href="/"
          className="inline-block px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
        >
          Go to Login
        </a>
      </div>
    </div>
  );
}
