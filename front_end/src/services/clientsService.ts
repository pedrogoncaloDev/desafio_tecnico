import { http, type HttpError } from './http'
import type { Cliente, CreateCliente, UpdateCliente, Page, PageParams } from '@/types/clientes'

export async function listClientes(params: PageParams = {}): Promise<Page<Cliente>> {
    const { search = '', page = 1, limit = 20 } = params
    const { data } = await http.get<Page<Cliente>>('/clientes', { params: { search, page, limit } })
    return data
}

export async function getCliente(id: number): Promise<Cliente> {
    const { data } = await http.get<Cliente>(`/clientes/${id}`)
    return data
}

export async function createCliente(payload: CreateCliente): Promise<Cliente> {
    const sane = {
        ...payload,
        Codigo: String(payload.Codigo),
        Validade: toDateString(payload.Validade)
    }
    const { data } = await http.post<Cliente>('/clientes', sane)
    return data
}

export async function updateCliente(id: number, payload: UpdateCliente): Promise<Cliente> {
    const { DataHoraCadastro, ID, ...rest } = payload as any

    const body = {
        ...rest,
        Validade: toDateString(rest.Validade)
    }

    const { data } = await http.put<Cliente>(`/clientes/${id}`, body)
    return data
}

export async function deleteCliente(id: number): Promise<void> {
    await http.delete(`/clientes/${id}`)
}

export async function health(): Promise<boolean> {
    try {
        const { data } = await http.get<{ ok: boolean }>('/health')
        return !!data?.ok
    } catch {
        return false
    }
}

function toDateString(v: unknown): string | null | undefined {
    if (v == null || v === '') return v as any
    if (typeof v === 'string') return v // espera 'YYYY-MM-DD'
    if (v instanceof Date && !isNaN(v.getTime())) return v.toISOString().slice(0, 10)
    return undefined
}

export type { HttpError }
