import type { UserDetailsDto } from "../../types/user";
import EditNameCard from "./EditNameCard";
import EditPasswordCard from "./EditPasswordCard";

interface Props {
    user: UserDetailsDto;
    apiUrl: string;
}

function getInitials(name: string) {
    return name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();
}

export default function ProfileDetails({ user, apiUrl }: Props) {
    return (
        <section className="page-shell">
            <div className="flex items-center gap-4 pb-5 border-b border-slate-200">
                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-medium text-base flex-shrink-0">
                    {getInitials(user.name)}
                </div>
                <div>
                    <p className="font-medium text-slate-900">{user.name}</p>
                </div>
            </div>

            <div className="flex flex-col gap-3">
                <div className="page-card space-y-1">
                    <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400 mb-3">
                        Información de cuenta
                    </p>
                    <InfoRow icon="ti-mail" label="Correo" value={<span className="break-all">{user.email}</span>} />
                    <InfoRow icon="ti-shield" label="Rol" value={<span className="inline-flex text-xs font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">{user.role}</span>} />
                    <InfoRow icon="ti-home" label="Redil" value={user.redilName ?? "—"} />
                </div>

                <EditNameCard user={user} apiUrl={apiUrl} />
                <EditPasswordCard apiUrl={apiUrl} />
            </div>
        </section>
    );
}

function InfoRow({ icon, label, value }: { icon: string; label: string; value: React.ReactNode }) {
    return (
        <div className="flex items-center gap-3 py-2 border-b border-slate-100 last:border-0">
            <i className={`ti ${icon} text-base text-slate-400 w-5 flex-shrink-0`} aria-hidden="true" />
            <span className="text-sm text-slate-500 w-20 flex-shrink-0">{label}</span>
            <span className="text-sm font-medium text-slate-900">{value}</span>
        </div>
    );
}