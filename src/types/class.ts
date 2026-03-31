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
}