interface Props {
    teachers: RedilDetailsDto["teacherList"];
}

export default function TeachersTab({ teachers }: Props) {
    if (teachers.length === 0) {
        return (
            <div className="py-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
                <p className="text-sm text-gray-500">No hay profesores asignados a este redil.</p>
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-xl border border-gray-100 shadow-sm bg-white">
            <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-left">
                    <thead className="bg-gray-50 border-b border-gray-100 text-gray-700 font-semibold uppercase text-xs tracking-wider">
                        <tr>
                            <th className="px-6 py-3.5">Nombre</th>
                            <th className="px-6 py-3.5">Email</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-gray-600">
                        {teachers.map(t => (
                            <tr key={t.id} className="hover:bg-gray-50/70 transition-colors">
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