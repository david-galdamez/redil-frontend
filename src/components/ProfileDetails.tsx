import { toast } from "@pheralb/toast";
import { useEffect, useState } from "react";
import type { UserDetailsDto } from "../types/user";

interface Props {
    user: UserDetailsDto;
    apiUrl: string;
}

export default function ProfileDetails({ user, apiUrl }: Props) {
    const [editingName, setEditingName] = useState(false);
    const [editingPassword, setEditingPassword] = useState(false);

    const [nameForm, setNameForm] = useState({ name: user.name });
    const [nameErrors, setNameErrors] = useState({ name: "", general: "" });
    const [nameLoading, setNameLoading] = useState(false);

    const [passwordForm, setPasswordForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [passwordErrors, setPasswordErrors] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
        general: "",
    });
    const [passwordLoading, setPasswordLoading] = useState(false);

    useEffect(() => {
        setNameForm({ name: user.name });
        setNameErrors({ name: "", general: "" });
    }, [user]);

    // ── Handlers nombre ──
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNameForm({ name: e.target.value });
    };

    const handleNameCancel = () => {
        setNameForm({ name: user.name });
        setNameErrors({ name: "", general: "" });
        setEditingName(false);
    };

    const handleNameSubmit = async () => {
        setNameErrors({ name: "", general: "" });

        if (nameForm.name.trim().length < 2) {
            setNameErrors(prev => ({ ...prev, name: "El nombre debe tener al menos 2 caracteres." }));
            return;
        }

        setNameLoading(true);
        try {
            const res = await fetch(`${apiUrl}/api/auth/me`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ name: nameForm.name.trim() }),
            });

            const resData = (await res.json()) as ApiResponse<UserDetailsDto>;

            if (res.status === 400 && resData.errors) {
                resData.errors.forEach((err: Error) => {
                    if (err.field.toLowerCase() === "name") {
                        setNameErrors(prev => ({ ...prev, name: err.message }));
                    }
                });
                return;
            }

            if (!res.ok || !resData.success) {
                setNameErrors(prev => ({
                    ...prev,
                    general: resData.message || "Ocurrió un error inesperado.",
                }));
                return;
            }

            toast.success({ text: resData.message || "Nombre actualizado exitosamente." });
            setEditingName(false);
            window.location.reload();
        } catch (err) {
            console.error(err);
            toast.error({ text: "Ocurrió un error de red." });
        } finally {
            setNameLoading(false);
        }
    };

    // ── Handlers contraseña ──
    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPasswordForm(prev => ({ ...prev, [name]: value }));
    };

    const handlePasswordCancel = () => {
        setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
        setPasswordErrors({ currentPassword: "", newPassword: "", confirmPassword: "", general: "" });
        setEditingPassword(false);
    };

    const handlePasswordSubmit = async () => {
        setPasswordErrors({ currentPassword: "", newPassword: "", confirmPassword: "", general: "" });

        let valid = true;

        if (!passwordForm.currentPassword) {
            setPasswordErrors(prev => ({ ...prev, currentPassword: "Ingresa tu contraseña actual." }));
            valid = false;
        }
        if (passwordForm.newPassword.length < 8) {
            setPasswordErrors(prev => ({ ...prev, newPassword: "La nueva contraseña debe tener al menos 8 caracteres." }));
            valid = false;
        }
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            setPasswordErrors(prev => ({ ...prev, confirmPassword: "Las contraseñas no coinciden." }));
            valid = false;
        }
        if (!valid) return;

        setPasswordLoading(true);
        try {
            const res = await fetch(`${apiUrl}/api/auth/me/password`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    currentPassword: passwordForm.currentPassword,
                    newPassword: passwordForm.newPassword,
                }),
            });

            const resData = (await res.json()) as ApiResponse<null>;

            if (res.status === 400 && resData.errors) {
                resData.errors.forEach((err: Error) => {
                    if (err.field.toLowerCase() === "currentpassword") {
                        setPasswordErrors(prev => ({ ...prev, currentPassword: err.message }));
                    }
                    if (err.field.toLowerCase() === "newpassword") {
                        setPasswordErrors(prev => ({ ...prev, newPassword: err.message }));
                    }
                });
                return;
            }

            if (!res.ok || !resData.success) {
                setPasswordErrors(prev => ({
                    ...prev,
                    general: resData.message || "Ocurrió un error inesperado.",
                }));
                return;
            }

            toast.success({ text: resData.message || "Contraseña actualizada exitosamente." });
            handlePasswordCancel();
        } catch (err) {
            console.error(err);
            toast.error({ text: "Ocurrió un error de red." });
        } finally {
            setPasswordLoading(false);
        }
    };

    return (
        <section className="page-shell">
            <header className="page-header">
                <h1 className="page-title">Perfil</h1>
                <p className="page-subtitle">Información de tu cuenta actual.</p>
            </header>

            {/* ── Datos de solo lectura ── */}
            <div className="page-card space-y-3">
                <div className="grid gap-3 sm:grid-cols-2">
                    <p className="text-sm sm:text-base">
                        <strong>Correo:</strong>{" "}
                        <span className="break-all">{user.email}</span>
                    </p>
                    <p className="text-sm sm:text-base">
                        <strong>Rol:</strong> <span>{user.role}</span>
                    </p>
                    <p className="text-sm sm:text-base">
                        <strong>Redil:</strong>{" "}
                        <span>{user.redilName ?? "—"}</span>
                    </p>
                </div>
            </div>

            {/* ── Editar nombre ── */}
            <div className="page-card space-y-4">
                <h2 className="font-semibold text-base">Cambiar nombre</h2>
                <div className="field-group">
                    <label className="label-base">Nombre</label>
                    <input
                        className="input-base"
                        name="name"
                        value={nameForm.name}
                        onChange={handleNameChange}
                        disabled={!editingName}
                        placeholder="Tu nombre completo"
                    />
                    {nameErrors.name && <p className="error-text">{nameErrors.name}</p>}
                    {nameErrors.general && <p className="error-text">{nameErrors.general}</p>}
                </div>
                <div className="actions-row">
                    {!editingName && (
                        <button className="btn-primary" onClick={() => setEditingName(true)}>
                            Editar
                        </button>
                    )}
                    {editingName && (
                        <>
                            <button className="btn-primary" onClick={handleNameSubmit} disabled={nameLoading}>
                                {nameLoading ? "Guardando..." : "Guardar"}
                            </button>
                            <button className="btn-secondary" onClick={handleNameCancel}>
                                Cancelar
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* ── Cambiar contraseña ── */}
            <div className="page-card space-y-4">
                <h2 className="font-semibold text-base">Cambiar contraseña</h2>
                <div className="field-group">
                    <label className="label-base">Contraseña actual</label>
                    <input
                        className="input-base"
                        name="currentPassword"
                        type="password"
                        value={passwordForm.currentPassword}
                        onChange={handlePasswordChange}
                        disabled={!editingPassword}
                        placeholder="••••••••"
                        autoComplete="current-password"
                    />
                    {passwordErrors.currentPassword && (
                        <p className="error-text">{passwordErrors.currentPassword}</p>
                    )}
                </div>
                <div className="field-group">
                    <label className="label-base">Nueva contraseña</label>
                    <input
                        className="input-base"
                        name="newPassword"
                        type="password"
                        value={passwordForm.newPassword}
                        onChange={handlePasswordChange}
                        disabled={!editingPassword}
                        placeholder="Mínimo 8 caracteres"
                        autoComplete="new-password"
                    />
                    {passwordErrors.newPassword && (
                        <p className="error-text">{passwordErrors.newPassword}</p>
                    )}
                </div>
                <div className="field-group">
                    <label className="label-base">Confirmar contraseña</label>
                    <input
                        className="input-base"
                        name="confirmPassword"
                        type="password"
                        value={passwordForm.confirmPassword}
                        onChange={handlePasswordChange}
                        disabled={!editingPassword}
                        placeholder="Repite la nueva contraseña"
                        autoComplete="new-password"
                    />
                    {passwordErrors.confirmPassword && (
                        <p className="error-text">{passwordErrors.confirmPassword}</p>
                    )}
                    {passwordErrors.general && (
                        <p className="error-text">{passwordErrors.general}</p>
                    )}
                </div>
                <div className="actions-row">
                    {!editingPassword && (
                        <button className="btn-primary" onClick={() => setEditingPassword(true)}>
                            Editar
                        </button>
                    )}
                    {editingPassword && (
                        <>
                            <button className="btn-primary" onClick={handlePasswordSubmit} disabled={passwordLoading}>
                                {passwordLoading ? "Guardando..." : "Guardar"}
                            </button>
                            <button className="btn-secondary" onClick={handlePasswordCancel}>
                                Cancelar
                            </button>
                        </>
                    )}
                </div>
            </div>
        </section>
    );
}