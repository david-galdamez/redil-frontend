interface TeacherDto {
    id: number,
    name: string,
    redilName: string,
    isActive: boolean,
}

interface TeacherDetailsDto {
    name: string,
    email: string,
    redilId: number | null,
    active: boolean,
}