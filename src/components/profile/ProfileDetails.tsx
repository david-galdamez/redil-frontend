import type { UserDetailsDto } from "../../types/user";
import EditNameCard from "./EditNameCard";
import EditPasswordCard from "./EditPasswordCard";

interface Props {
  user: UserDetailsDto;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function ProfileDetails({ user }: Props) {
  return (
    <div className="space-y-6">
      {/* Cabecera del Perfil con degradado inspirado en la app */}
      <div className="relative flex items-center gap-5 overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="pointer-events-none absolute top-0 right-0 bottom-0 w-1/2 rounded-r-2xl bg-gradient-to-l from-[#FFF1E0]/50 to-transparent"></div>

        <div className="z-10 flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-full border-4 border-white bg-[#003366] text-2xl font-bold text-white shadow-inner ring-1 ring-gray-100">
          {getInitials(user.name)}
        </div>
        <div className="z-10">
          <h1 className="text-2xl font-bold text-[#003366]">{user.name}</h1>
          <div className="mt-1 flex items-center gap-2">
            <span className="inline-flex rounded-full border border-blue-100 bg-blue-50 px-2 py-0.5 text-[10px] font-bold tracking-wider text-blue-700 uppercase">
              {user.role}
            </span>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-12">
        {/* Columna Izquierda: Info General */}
        <div className="space-y-6 md:col-span-5">
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-[#003366]">Información personal</h2>
            <div className="space-y-4">
              <InfoRow
                icon="ti-mail"
                label="Correo electrónico"
                value={<span className="break-all">{user.email}</span>}
              />
              <InfoRow icon="ti-home" label="Redil asignado" value={user.redilName ?? "Ninguno"} />
            </div>
          </div>
        </div>

        {/* Columna Derecha: Edición */}
        <div className="space-y-6 md:col-span-7">
          <EditNameCard user={user} />
          <EditPasswordCard />
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: string; label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 border-b border-gray-50 py-3 last:border-0 last:pb-0">
      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gray-50 text-gray-400">
        <i className={`ti ${icon} text-lg`} aria-hidden="true" />
      </div>
      <div className="flex flex-col">
        <span className="text-xs font-semibold text-gray-500">{label}</span>
        <span className="mt-0.5 text-sm font-medium text-gray-900">{value}</span>
      </div>
    </div>
  );
}
