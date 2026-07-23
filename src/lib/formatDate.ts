export const formatDateLocal = (date: string) => {
    const d = new Date(date);

    const pad = (n: number) => n.toString().padStart(2, "0");

    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

export const formatDateReadable = (date: string) => {
    const d = new Date(date);

    return d.toLocaleString("es-CO", {
        year: "numeric",
        month: "long",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    });
};