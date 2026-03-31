import React, { useState } from "react";
import { toast } from "@pheralb/toast";

interface Props {
  redilCode: string;
  apiUrl: string;
  groups: GroupDto[];
}

export default function RedilRegisterForm({
  redilCode,
  apiUrl,
  groups,
}: Props) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    isServer: false,
    groupId: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    groupId: "",
    general: "",
  });
  const [loading, setLoading] = useState(false);

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;
    const isCheckbox =
      type === "checkbox" && e.target instanceof HTMLInputElement;
    const checkedValue = isCheckbox
      ? (e.target as HTMLInputElement).checked
      : false;
    setForm((prev) => ({
      ...prev,
      [name]: isCheckbox ? checkedValue : value,
    }));
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    let shouldReset = false;
    setErrors({
      name: "",
      email: "",
      groupId: "",
      general: "",
    });

    if (!form.groupId) {
      setErrors((prev) => ({
        ...prev,
        groupId: "Debes seleccionar un grupo",
      }));
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/api/student/register/${redilCode}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = (await res.json()) as ApiResponse<number>;

      if (res.status === 400 && data.errors) {
        data.errors.forEach((err: Error) => {
          if (err.field.toLowerCase() === "name") {
            setErrors((prev) => ({
              ...prev,
              name: err.message,
            }));
          }
          if (err.field.toLowerCase() === "email") {
            setErrors((prev) => ({
              ...prev,
              email: err.message,
            }));
          }
          if (err.field.toLowerCase() === "groupid") {
            setErrors((prev) => ({
              ...prev,
              groupId: err.message,
            }));
          }
        });
        return;
      }

      if (!res.ok || !data.success) {
        setErrors((prev) => ({
          ...prev,
          general: data.message || "Ocurrió un error desconocido",
        }));
        return;
      }

      toast.success({
        text: data.message || "Inscripción exitosa",
      });
      shouldReset = true;
    } catch (e) {
      console.error("Error submitting form:", e);
      toast.error({
        text: "Ocurrió un error de conexión",
      });
    } finally {
      if (shouldReset) {
        setForm({
          name: "",
          email: "",
          isServer: false,
          groupId: "",
        });
      }
      setLoading(false);
    }
  };

  return (
    <form className="form-card form-card-compact form-grid" onSubmit={handleSubmit}>
      <div className="field-group">
        <label className="label-base" htmlFor="name">Nombre completo</label>
        <input className="input-base" type="text" id="name" name="name" value={form.name} onChange={onChange} required />
        {errors.name && <p className="error-text">{errors.name}</p>}
      </div>

      <div className="field-group">
        <label className="label-base" htmlFor="email">Correo electrónico</label>
        <input className="input-base" type="email" id="email" name="email" value={form.email} onChange={onChange} required />
        {errors.email && <p className="error-text">{errors.email}</p>}
      </div>

      <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
        <div className="field-group">
          <label className="label-base" htmlFor="groupId">Grupo al que asiste</label>
          <select className="input-base" id="groupId" name="groupId" value={form.groupId} onChange={onChange} required>
            <option value="">Selecciona un grupo</option>
            {groups?.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
          {errors.groupId && <p className="error-text">{errors.groupId}</p>}
        </div>

        <label className="inline-flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700" htmlFor="isServer">
          <input className="checkbox-base" type="checkbox" id="isServer" name="isServer" checked={form.isServer} onChange={onChange} />
          Es servidor
        </label>
      </div>

      {errors.general && <p className="error-text">{errors.general}</p>}

      <button className="btn-primary w-full sm:w-fit" type="submit" disabled={loading}>
        {loading ? "Inscribiendose..." : "Inscribirse"}
      </button>
    </form>
  );
}
