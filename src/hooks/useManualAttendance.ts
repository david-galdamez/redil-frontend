import { useState } from "react";
import { toast } from "@pheralb/toast";
import { apiClient } from "../lib/api/client";

type RowState = "idle" | "loading" | "attended" | "absent" | "error";

export function useManualAttendance(attendanceToken: string) {
  const [rowStates, setRowStates] = useState<Record<string, RowState>>({});

  const setState = (phone: string, state: RowState) =>
    setRowStates((prev) => ({ ...prev, [phone]: state }));

  const register = async (phone: string, attended: boolean) => {
    setState(phone, "loading");
    const result = await apiClient.put(`api/class/assist/manual/${attendanceToken}`, {
      phone,
      attended,
    });

    if (result.error) {
      setState(phone, "error");
      toast.error({ text: result.error });
      setTimeout(() => setState(phone, "idle"), 3000);
    } else {
      setState(phone, attended ? "attended" : "absent");
      toast.success({ text: attended ? "Asistencia registrada" : "Ausencia registrada" });
    }
  };

  const rowState = (phone: string): RowState => rowStates[phone] ?? "idle";

  return { register, rowState };
}
