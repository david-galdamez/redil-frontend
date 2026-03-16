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
    teacherList: RedilTeacherList[];
}

interface RedilTeacherList {
    id: number;
    name: string;
    email: string;
}