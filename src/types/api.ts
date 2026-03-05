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