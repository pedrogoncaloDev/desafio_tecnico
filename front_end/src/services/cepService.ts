import axios from 'axios'

export interface ViaCepResponse {
    cep: string
    logradouro: string
    complemento: string
    bairro: string
    localidade: string
    uf: string
    ibge: string
    gia: string
    ddd: string
    siafi: string
}

export async function getEnderecoByCep(cep: string): Promise<ViaCepResponse | null> {
    try {
        const cleanCep = cep.replace(/\D/g, '') // remove não numéricos
        if (cleanCep.length !== 8) return null

        const { data } = await axios.get<ViaCepResponse>(`https://viacep.com.br/ws/${cleanCep}/json/`)

        if ((data as any).erro) return null
        return data
    } catch {
        return null
    }
}
