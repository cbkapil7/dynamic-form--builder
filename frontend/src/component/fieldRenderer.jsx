export default function FieldRenderer({
  field,
  value,
  onChange,
  error 
}) {
  const baseClasses =
    "w-full px-4 py-2 border rounded-lg focus:outline-none transition";

  const errorClasses = error
    ? "border-red-500 focus:ring-2 focus:ring-red-400"
    : "border-gray-300 focus:ring-2 focus:ring-black";

  const handleChange = (e) => {
    const val =
      field.type === "CHECKBOX"
        ? e.target.checked
        : e.target.value;

    onChange(field.id, val);
  };

  return (
    <div className="mb-4">

    
      <label className="block text-sm font-medium mb-1 text-gray-700">
        {field.label}
      </label>

     
      {field.type === "TEXT" && (
        <input
          type="text"
          className={`${baseClasses} ${errorClasses}`}
          placeholder={`Enter ${field.label}`}
          value={value || ""}
          onChange={handleChange}
        />
      )}

   
      {field.type === "NUMBER" && (
        <input
          type="number"
          className={`${baseClasses} ${errorClasses}`}
          placeholder={`Enter ${field.label}`}
          value={value || ""}
          onChange={handleChange}
        />
      )}

    
      {field.type === "DATE" && (
        <input
          type="date"
          className={`${baseClasses} ${errorClasses}`}
          value={value || ""}
          onChange={handleChange}
        />
      )}

    
      {field.type === "DROPDOWN" && (
        <select
          className={`${baseClasses} ${errorClasses}`}
          value={value || ""}
          onChange={handleChange}
        >
          <option value="">Select {field.label}</option>

          {field.options?.map((opt, index) => (
            <option key={index} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      )}

     
      {field.type === "CHECKBOX" && (
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            className={`w-4 h-4 ${error ? "outline-red-500" : ""}`}
            checked={!!value}
            onChange={handleChange}
          />
          <span className="text-sm">{field.label}</span>
        </div>
      )}

     
      {error && (
        <p className="text-red-500 text-sm mt-1">
          {error}
        </p>
      )}
    </div>
  );
}