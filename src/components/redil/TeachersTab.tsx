interface Props {
    teachers: RedilDetailsDto["teacherList"];
}

export default function TeachersTab({ teachers }: Props) {
    if (teachers.length === 0) {
        return <p className="text-sm text-slate-600">No hay profesores asignados a esta redil.</p>;
    }

    return (
        <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-100">
                    <tr>
                        <th className="px-4 py-2 text-left font-medium text-slate-700">Nombre</th>
                        <th className="px-4 py-2 text-left font-medium text-slate-700">Email</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                    {teachers.map(t => (
                        <tr key={t.id}>
                            <td className="px-4 py-2">{t.name}</td>
                            <td className="px-4 py-2 break-all">{t.email}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}