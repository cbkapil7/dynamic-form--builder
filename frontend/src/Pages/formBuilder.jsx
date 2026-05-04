import { useState, useEffect } from "react";
import { useCreateForm } from "../hooks/useCreateForm";
import { useUpdateForm } from "../hooks/useUpdateForm";
import toast from "react-hot-toast";
import ValidationBuilder from "../component/ValidationBuilder";

export default function FormBuilder({ initialData = null, isEdit = false }) {

  const [fields, setFields] = useState([
    {
      label: "",
      type: "TEXT",
      validations: {},
      showValidation: false 
    }
  ]);

  const [title, setTitle] = useState("");

  const { mutate: createForm, isPending: creating } = useCreateForm();
  const { mutate: updateForm, isPending: updating } = useUpdateForm();

  
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);

      setFields(
        initialData.Fields.map((f) => ({
          id: f.id,
          label: f.label,
          type: f.type,
          options: f.options || [],
          validations: f.validations || {},
          showValidation: !!f.validations && Object.keys(f.validations).length > 0
        }))
      );
    }
  }, [initialData]);

  
  const addField = () => {
    setFields([
      ...fields,
      {
        label: "",
        type: "TEXT",
        validations: {},
        showValidation: false
      }
    ]);
  };

  
  const updateField = (index, key, value) => {
    const updated = [...fields];
    updated[index] = {
      ...updated[index],
      [key]: value
    };
    setFields(updated);
  };

  const removeField = (index) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  
  const handleSubmit = () => {
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    const cleanedFields = fields.map((f) => ({
      ...f,
      showValidation: undefined,
    }));

    const payload = {
      title,
      fields: cleanedFields,
    };

    if (isEdit) {
      updateForm(
        { id: initialData.id, ...payload },
        {
          onSuccess: () => toast.success("Form updated"),
        }
      );
    } else {
      createForm(payload, {
        onSuccess: () => {
          toast.success("Form created");
          setTitle("");
          setFields([
            {
              label: "",
              type: "TEXT",
              validations: {},
              showValidation: false
            }
          ]);
        },
      });
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow">

      <h2 className="text-xl font-bold mb-4 text-center">
        {isEdit ? "Update Form" : "Create Form"}
      </h2>

     
      <input
        className="w-full border p-2 mb-4 rounded"
        placeholder="Form Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

    
      {fields.map((field, index) => (
        <div
          key={index}
          className="border p-4 rounded-lg mb-4 bg-gray-50"
        >

         
          <input
            type="text"
            value={field.label}
            onChange={(e) =>
              updateField(index, "label", e.target.value)
            }
            placeholder="Field Label"
            className="border px-3 py-2 w-full mb-2 rounded"
          />

         
          <select
            value={field.type}
            onChange={(e) =>
              updateField(index, "type", e.target.value)
            }
            className="border px-3 py-2 w-full mb-2 rounded"
          >
            <option value="TEXT">Text</option>
            <option value="NUMBER">Number</option>
            <option value="DATE">Date</option>
            <option value="DROPDOWN">Dropdown</option>
            <option value="CHECKBOX">Checkbox</option>
          </select>

        
          <div className="flex items-center gap-2 mt-2">
            <input
              type="checkbox"
              checked={field.showValidation}
              onChange={(e) =>
                updateField(index, "showValidation", e.target.checked)
              }
            />
            <label className="text-sm">Add Validation</label>
          </div>

        
          {field.showValidation && (
            <ValidationBuilder
              type={field.type} 
              value={field.validations}
              onChange={(val) =>
                updateField(index, "validations", val)
              }
            />
          )}

        
          <button
            onClick={() => removeField(index)}
            className="mt-3 text-red-500 text-sm"
          >
            Remove Field
          </button>
        </div>
      ))}

     
      <div className="flex gap-3">
        <button
          onClick={addField}
          className="bg-gray-200 px-4 py-2 rounded"
        >
          + Add Field
        </button>

        <button
          onClick={handleSubmit}
          disabled={creating || updating}
          className="bg-black text-white px-4 py-2 rounded"
        >
          {isEdit ? "Update Form" : "Create Form"}
        </button>
      </div>
    </div>
  );
}