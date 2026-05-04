import { useForm } from "../hooks/useForm";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import FieldRenderer from "../component/fieldRenderer";
import FormBuilder from "./FormBuilder";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { useSubmitForm } from "../hooks/useSubmitForm";
import { useMyResponse } from "../hooks/useMyResponse";

export default function FormViewer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data, isLoading } = useForm(id);
  const { data: existingValues } = useMyResponse(id);

  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});
  const [submittedData, setSubmittedData] = useState(null);

  const { mutate, isPending } = useSubmitForm();

  
  useEffect(() => {
    if (existingValues && typeof existingValues === "object") {
      const normalized = {};

      Object.entries(existingValues).forEach(([k, v]) => {
        normalized[String(k)] = v;
      });

      setValues(normalized);
    }
  }, [existingValues]);

  
  const isEditMode =
    existingValues && Object.keys(existingValues).length > 0;


  const handleChange = (fieldId, value) => {
    setValues((prev) => ({
      ...prev,
      [String(fieldId)]: value,
    }));

    // remove error when user types
    setErrors((prev) => ({
      ...prev,
      [fieldId]: "",
    }));
  };

  //  CONDITION CHECK
  const shouldShow = (field) => {
    if (!field.condition) return true;

    const { fieldId, operator = "EQUALS", value } = field.condition;
    const parentVal = values[fieldId];

    switch (operator) {
      case "EQUALS":
        return parentVal === value;
      case "NOT_EQUALS":
        return parentVal !== value;
      case "GT":
        return Number(parentVal) > Number(value);
      case "LT":
        return Number(parentVal) < Number(value);
      default:
        return true;
    }
  };

  
  const sortedFields =
    data?.Fields?.slice().sort((a, b) => (a.order || 0) - (b.order || 0)) || [];

  //  VALIDATION
  const validate = () => {
    const newErrors = {};

    sortedFields.forEach((field) => {
      if (!shouldShow(field)) return;

      const key = String(field.id);
      const val = values[key];
      const rules = field.validations || {};

      if (rules.required && (!val || val === "")) {
        newErrors[key] = "Required";
        return;
      }

      if (!val) return;

      if (rules.onlyText && /\d/.test(val)) {
        newErrors[key] = "Only alphabets allowed";
      }

      if (field.type === "NUMBER" && isNaN(Number(val))) {
        newErrors[key] = "Must be a number";
      }

      if (rules.min !== undefined && Number(val) < rules.min) {
        newErrors[key] = `Min ${rules.min}`;
      }

      if (rules.max !== undefined && Number(val) > rules.max) {
        newErrors[key] = `Max ${rules.max}`;
      }

      if (rules.minLength && val.length < rules.minLength) {
        newErrors[key] = `Min length ${rules.minLength}`;
      }

      if (rules.maxLength && val.length > rules.maxLength) {
        newErrors[key] = `Max length ${rules.maxLength}`;
      }

      if (rules.pattern) {
        const regex = new RegExp(rules.pattern);
        if (!regex.test(val)) {
          newErrors[key] = "Invalid format";
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  //  SUBMIT / UPDATE
  const handleSubmit = () => {
    if (!validate()) {
      toast.error("Fix validation errors");
      return;
    }

    mutate(
      { formId: id, values },
      {
        onSuccess: () => {
          toast.success(
            isEditMode
              ? "Form updated successfully"
              : "Form submitted successfully"
          );

          setSubmittedData(values);
        },
        onError: (err) => {
          toast.error(
            err?.response?.data?.message || "Submission failed"
          );
        },
      }
    );
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow">

     
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-sm text-gray-600"
      >
        ← Back
      </button>

      {isLoading && <p>Loading...</p>}

      {!isLoading && data && (
        <>
         
          {user?.role === "ADMIN" ? (
            <FormBuilder initialData={data} isEdit />
          ) : (
            <>
              {/* AFTER SUBMIT */}
              {submittedData ? (
                <div className="text-center">
                  <h3 className="text-xl font-bold mb-4">
                    Form Submitted Successfully 🎉
                  </h3>

                  <div className="text-left bg-gray-50 p-4 rounded-lg space-y-2">
                    {sortedFields.map((field) => (
                      <div key={field.id}>
                        <span className="font-semibold">
                          {field.label}:
                        </span>{" "}
                        {String(
                          submittedData[String(field.id)] ?? "-"
                        )}
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => setSubmittedData(null)}
                    className="mt-6 bg-black text-white px-4 py-2 rounded"
                  >
                    Fill Again
                  </button>
                </div>
              ) : (
                <>
                 
                  <h3 className="text-xl font-bold mb-6 text-center">
                    {data.title}
                  </h3>

                  <div className="space-y-4">
                    {sortedFields.map((field) => {
                      if (!shouldShow(field)) return null;

                      const key = String(field.id);

                      return (
                        <div
                          key={field.id}
                          className="p-4 border rounded-lg bg-gray-50"
                        >
                          <FieldRenderer
                            field={field}
                            value={values[key] ?? ""}
                            onChange={handleChange}
                            error={errors[String(field.id)]} 
                          />

                          {/* ERROR */}
                        
                        </div>
                      );
                    })}
                  </div>

                
                  <button
                    onClick={handleSubmit}
                    disabled={isPending}
                    className="w-full mt-6 bg-black text-white py-2 rounded-lg disabled:opacity-50"
                  >
                    {isPending
                      ? isEditMode
                        ? "Updating..."
                        : "Submitting..."
                      : isEditMode
                        ? "Update"
                        : "Submit"}
                  </button>
                </>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}