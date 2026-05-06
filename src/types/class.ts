interface RegisterClassResponse {
    id: number;
    redilId: number;
    teacherId: number;
    date: string;
    description: string;
}

interface ClassStatsRequestDto {
    redilId?: string;
    fromDate: string;
    toDate: string;
    groupId?: number;
    search?: string;
}

interface ClassDto {
    id: number;
    redilName: string;
    description: string;
    classDate: string;
}

interface ClassDetailsDto {
    classId: number;
    classDescription: string;
    classDate: string;
    attendanceToken?: string;
    expired: boolean;
}

interface AssisClassDetailDto {
    redilName: string;
    classDescription: string;
    classDate: string;
    emails: string[];
}