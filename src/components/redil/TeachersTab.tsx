interface Props {
  teachers: RedilDetailsDto["teacherList"];
}

export default function TeachersTab({ teachers }: Props) {
  if (teachers.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 py-8 text-center">
        <p className="text-sm text-gray-500">No hay profesores asignados a este redil.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-gray-100 bg-gray-50 text-xs font-semibold tracking-wider text-gray-700 uppercase">
            <tr>
              <th className="px-6 py-3.5">Nombre</th>
              <th className="px-6 py-3.5">Email</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-gray-600">
            {teachers.map((t) => (
              <tr key={t.id} className="transition-colors hover:bg-gray-50/70">
                <td className="px-6 py-3.5 font-medium text-gray-900">{t.name}</td>
                <td className="px-6 py-3.5 break-all">{t.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
