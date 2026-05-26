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
        <div className="space-y-6">
            {/* Cabecera del Perfil con degradado inspirado en la app */}
            <div className="relative overflow-hidden bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center gap-5">
                <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-[#FFF1E0]/50 to-transparent pointer-events-none rounded-r-2xl"></div>

                <div className="w-20 h-20 rounded-full bg-[#003366] flex items-center justify-center text-white font-bold text-2xl flex-shrink-0 shadow-inner z-10 border-4 border-white ring-1 ring-gray-100">
                    {getInitials(user.name)}
                </div>
                <div className="z-10">
                    <h1 className="text-2xl font-bold text-[#003366]">{user.name}</h1>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="inline-flex text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                            {user.role}
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-12">
                {/* Columna Izquierda: Info General */}
                <div className="md:col-span-5 space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-lg font-bold text-[#003366] mb-4">Información personal</h2>
                        <div className="space-y-4">
                            <InfoRow icon="ti-mail" label="Correo electrónico" value={<span className="break-all">{user.email}</span>} />
                            <InfoRow icon="ti-home" label="Redil asignado" value={user.redilName ?? "Ninguno"} />
                        </div>
                    </div>
                </div>

                {/* Columna Derecha: Edición */}
                <div className="md:col-span-7 space-y-6">
                    <EditNameCard user={user} apiUrl={apiUrl} />
                    <EditPasswordCard apiUrl={apiUrl} />
                </div>
            </div>
        </div>
    );
}

function InfoRow({ icon, label, value }: { icon: string; label: string; value: React.ReactNode }) {
    return (
        <div className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0 last:pb-0">
            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 flex-shrink-0">
                <i className={`ti ${icon} text-lg`} aria-hidden="true" />
            </div>
            <div className="flex flex-col">
                <span className="text-xs font-semibold text-gray-500">{label}</span>
                <span className="text-sm font-medium text-gray-900 mt-0.5">{value}</span>
            </div>
        </div>
    );
}