import { toast } from "@pheralb/toast";

export const copyToClipboard = async (link: string) => {
  try {
    await navigator.clipboard.writeText(link);
    toast.success({ text: "Link copiado al portapapeles 📋" });
  } catch {
    toast.error({ text: "No se pudo copiar el link" });
  }
};
