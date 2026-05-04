import { useForms } from "../hooks/useForms";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function FormsList() {
  const navigate = useNavigate();

  //  pagination
  const [page, setPage] = useState(1);
  const limit = 5;

  const { data, isLoading } = useForms(page, limit);

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
      
      <h2 className="text-2xl font-bold mb-6 text-center">
         Forms
      </h2>

      {isLoading && (
        <p className="text-center text-gray-500">Loading...</p>
      )}

      {!isLoading && data?.forms?.length === 0 && (
        <p className="text-center text-gray-500">
          No forms available
        </p>
      )}

     
      <div className="space-y-3">
        {data?.forms?.map((form) => (
          <div
            key={form.id}
            onClick={() => navigate(`/forms/${form.id}`)} 
            className="p-4 border rounded-xl cursor-pointer flex justify-between items-center hover:bg-gray-50"
          >
            <h3 className="font-semibold">{form.title}</h3>
            <span>→</span>
          </div>
        ))}
      </div>

    
      <div className="flex justify-between mt-6">
        
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Previous
        </button>

        <span>Page {page}</span>

        <button
          disabled={!data?.hasMore}
          onClick={() => setPage((p) => p + 1)}
          className="px-4 py-2 bg-black text-white rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}