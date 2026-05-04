import { useAuth } from "../context/AuthContext";


export default function Header() {
  const { logout, user } = useAuth();

  return (
    <header className="bg-white shadow-md border-b border-gray-100 sticky top-0 z-50">

      <div className="max-w-5xl mx-auto flex items-center justify-between px-6 py-4">


        <h1 className="text-xl font-bold text-gray-800">
          Form Builder
        </h1>


        <div className="flex items-center gap-3">

         
          <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center font-semibold">
            {user?.email?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <span className="text-gray-700 font-medium">
            {user?.role }
          </span>
         
          <span className="text-gray-700 font-medium">
            {user?.name || user?.email || "User"}
          </span>



          <button
            onClick={logout}
            className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
          >
            Logout
          </button>

        </div>

      </div>
    </header>
  );
}