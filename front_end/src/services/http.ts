import axios from 'axios'

export const http = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
    timeout: 10000
})

export type HttpError = Error & { status?: number; data?: any }

function normalizeAxiosError(e: any): HttpError {
    const err: HttpError = new Error(
        e?.response?.data?.error || e?.message || 'Erro na requisição'
    )
    err.status = e?.response?.status
    err.data = e?.response?.data
    return err
}

http.interceptors.response.use(
    (r) => r,
    (e) => Promise.reject(normalizeAxiosError(e))
)
