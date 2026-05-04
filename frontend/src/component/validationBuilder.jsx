export default function ValidationBuilder({ value = {}, onChange }) {
  const v = value || {};

  const update = (patch) => {
    onChange({ ...v, ...patch });
  };

  return (
    <div className="mt-3 p-3 border rounded-lg bg-gray-50 space-y-3">

      <p className="text-sm font-semibold">Validation</p>

    
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={v.required || false}
          onChange={(e) => update({ required: e.target.checked })}
        />
        <label className="text-sm">Required</label>
      </div>

     
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={v.onlyText || false}
          onChange={(e) => update({ onlyText: e.target.checked })}
        />
        <label className="text-sm">Only alphabets</label>
      </div>

     
      <div className="flex items-center gap-2">
        <label className="text-sm w-24">Min Length</label>
        <input
          type="number"
          value={v.minLength || ""}
          onChange={(e) =>
            update({ minLength: Number(e.target.value) || undefined })
          }
          className="border px-2 py-1 rounded w-24"
        />
      </div>

    
      <div className="flex items-center gap-2">
        <label className="text-sm w-24">Max Length</label>
        <input
          type="number"
          value={v.maxLength || ""}
          onChange={(e) =>
            update({ maxLength: Number(e.target.value) || undefined })
          }
          className="border px-2 py-1 rounded w-24"
        />
      </div>

     
      <div className="flex items-center gap-2">
        <label className="text-sm w-24">Min</label>
        <input
          type="number"
          value={v.min || ""}
          onChange={(e) =>
            update({ min: Number(e.target.value) || undefined })
          }
          className="border px-2 py-1 rounded w-24"
        />
      </div>

    
      <div className="flex items-center gap-2">
        <label className="text-sm w-24">Max</label>
        <input
          type="number"
          value={v.max || ""}
          onChange={(e) =>
            update({ max: Number(e.target.value) || undefined })
          }
          className="border px-2 py-1 rounded w-24"
        />
      </div>

    
      <div className="flex items-center gap-2">
        <label className="text-sm w-24">Pattern</label>
        <input
          type="text"
          placeholder="e.g. ^[A-Za-z ]+$"
          value={v.pattern || ""}
          onChange={(e) =>
            update({ pattern: e.target.value || undefined })
          }
          className="border px-2 py-1 rounded w-full"
        />
      </div>

    </div>
  );
}