interface ApiResponse<T> {
    success: boolean,
    message?: string,
    data?: T,
    errors?: Error[]
}

interface Error {
    field: string,
    message: string,
}

interface User {
    id: number,
    name: string,
    email: string,
    role: number,
    redilId: number
}