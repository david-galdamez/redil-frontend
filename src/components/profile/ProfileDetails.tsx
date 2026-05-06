import type { UserDetailsDto } from "../../types/user";
import EditNameCard from "./EditNameCard";
import EditPasswordCard from "./EditPasswordCard";

interface Props {
    user: UserDetailsDto;
    apiUrl: string;
}

export default function ProfileDetails({ user, apiUrl }: Props) {
    return (
        <section className="page-shell">
            <header className="page-header">
                <h1 className="page-title">Perfil</h1>
                <p className="page-subtitle">Información de tu cuenta actual.</p>
            </header>

            <div className="page-card space-y-3">
                <div className="grid gap-3 sm:grid-cols-2">
                    <p className="text-sm sm:text-base">
                        <strong>Correo:</strong> <span className="break-all">{user.email}</span>
                    </p>
                    <p className="text-sm sm:text-base">
                        <strong>Rol:</strong> <span>{user.role}</span>
                    </p>
                    <p className="text-sm sm:text-base">
                        <strong>Redil:</strong> <span>{user.redilName ?? "—"}</span>
                    </p>
                </div>
            </div>

            <EditNameCard user={user} apiUrl={apiUrl} />
            <EditPasswordCard apiUrl={apiUrl} />
        </section>
    );
}