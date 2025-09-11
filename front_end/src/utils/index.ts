export function formatDate(val?: string | Date | null) {
    if (!val) return '-'
    const d = typeof val === 'string' ? new Date(val) : val
    if (isNaN(d.getTime())) return '-'
    return d.toLocaleDateString('pt-BR', { timeZone: 'UTC' })
}

export function maskCpfCnpj(v: string) {
    const s = (v || '').replace(/\D/g, '')
    if (s.length <= 11) {
        return s
            .replace(/^(\d{3})(\d)/, '$1.$2')
            .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
            .replace(/\.(\d{3})(\d)/, '.$1-$2')
    }
    return s
        .replace(/^(\d{2})(\d)/, '$1.$2')
        .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
        .replace(/\.(\d{3})(\d)/, '.$1/$2')
        .replace(/(\d{4})(\d)/, '$1-$2')
}

export function maskPhone(v: string) {
    const s = (v || '').replace(/\D/g, '')
    if (!s) return ''
    if (s.length <= 10) return s.replace(/^(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3').trim()
    return s.replace(/^(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3').trim()
}
