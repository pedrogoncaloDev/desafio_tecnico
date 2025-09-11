export interface Cliente {
    ID: number
    idUsuario: number
    DataHoraCadastro: string | null
    Codigo: string
    Nome: string
    CPF_CNPJ: string
    CEP?: number | null
    Logradouro?: string | null
    Endereco?: string | null
    Numero?: string | null
    Bairro?: string | null
    Cidade?: string | null
    UF?: string | null
    Complemento?: string | null
    Fone?: string | null
    LimiteCredito?: number | null
    Validade?: string | null // YYYY-MM-DD
}

export type CreateCliente = Omit<Cliente, 'ID' | 'DataHoraCadastro'>
export type UpdateCliente = Partial<Omit<Cliente, 'ID' | 'DataHoraCadastro'>> & { ID?: number }

export interface PageParams { search?: string; page?: number; limit?: number }
export interface Page<T> { page: number; limit: number; total: number; rows: T[] }
