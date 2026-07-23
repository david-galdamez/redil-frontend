interface RedilDto {
    id: number;
    name: string;
    description: string;
}

interface RedilListDto {
    id: number;
    name: string;
}

interface RedilDetailsDto {
    id: number;
    name: string;
    description: string;
    redilCode: string;
    teacherList: RedilTeacherList[];
}

interface RedilTeacherList {
    id: number;
    name: string;
    email: string;
}

interface RedilClassStatDto {
    name: string;
    groupName: string;
    redilName: string;
    isServer: boolean;
    attendancePercentage: number;
}