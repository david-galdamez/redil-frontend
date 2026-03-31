import { toast } from "@pheralb/toast";
import { useEffect, useState } from "react";
import { formatDateLocal } from "../lib/formatDate";

interface Props {
    apiUrl: string;
    classDetails: ClassDetailsDto
}

export default function ClassDetails({ apiUrl, classDetails }: Props) {

    const [details, setDetails] = useState(classDetails)

    const assistLink = `${window.location.origin}/assist/${details.attendanceToken}`
    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(assistLink)
            toast.success({ text: "Link copiado al portapapeles 📋" })
        } catch (e) {
            toast.error({ text: "No se pudo copiar el link" })
        }
    }

    const passAssist = async () => {
        try {
            const res = await fetch(`${apiUrl}/api/class/assist/${classDetails.classId}`, {
                method: 'PUT',
                credentials: 'include'
            })

            const data = (await res.json()) as ApiResponse<string>

            if (!res.ok) {
                toast.error({
                    text: data.message || "Ocurrio un error al pasar asistencia."
                })
            }

            toast.success({
                text: data.message || "Asistencia iniciada con exito."
            })
            window.location.reload()
        } catch (e) {
            console.error("Error passing assist: ", e)
            toast.error({
                text: "Error al pasar asistencia, intentalo mas tarde"
            })
        }
    }

    useEffect(() => {
        setDetails(classDetails)
    }, [classDetails])

    return (
        <section className="page-shell">
            <header className="page-header">
                <h1 className="page-title">Detalles de clase</h1>
                <p className="page-subtitle">Informacion general y control de asistencia.</p>
            </header>

            <div className="page-card space-y-4">
                <div className="field-group">
                    <label className="label-base" htmlFor="description">Descripcion de la clase</label>
                    <textarea className="input-base min-h-24" name="description" id="description" defaultValue={details.classDescription} disabled />
                </div>

                <div className="field-group">
                    <label className="label-base" htmlFor="date">Fecha de la clase</label>
                    <input className="input-base" type="datetime-local" name="date" id="date" required defaultValue={formatDateLocal(details.classDate)} disabled />
                </div>

                {
                    details.attendanceToken && !details.expired && (
                        <div className="space-y-3 rounded-lg border border-blue-200 bg-blue-50 p-4">
                            <p><strong>Link de asistencia:</strong></p>

                            <input
                                className="input-base"
                                type="text"
                                value={assistLink}
                                readOnly
                            />

                            <div className="actions-row pt-0!">
                                <button className="btn-secondary" onClick={() => window.open(assistLink, "_blank")}>
                                    Abrir
                                </button>

                                <button className="btn-primary" onClick={copyToClipboard}>
                                    Copiar link
                                </button>
                            </div>
                        </div>
                    )
                }

                {
                    details.attendanceToken && details.expired && (
                        <p className="error-text">
                            El tiempo para pasar asistencia ya ha expirado
                        </p>
                    )
                }

                <button className="btn-primary w-full sm:w-fit" onClick={passAssist} disabled={details.attendanceToken !== null || details.expired}>
                    Iniciar asistencia
                </button>
            </div>
        </section>
    )
}