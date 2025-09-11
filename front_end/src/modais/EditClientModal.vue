<template>
    <v-dialog v-model="localDialog" max-width="840">
        <v-card>
            <v-progress-linear v-if="submitting" indeterminate absolute color="primary" />
            <v-card-title class="text-h6">
                Editar Cliente – {{ form.Nome }} (ID: {{ form.ID }})
            </v-card-title>

            <v-card-text>
                <v-form ref="form" @submit.prevent="submit">
                    <v-row>
                        <v-col cols="12" md="4">
                            <v-text-field v-model="form.Codigo" label="Código" :rules="[rules.req, rules.max15]" />
                        </v-col>

                        <v-col cols="12" md="6">
                            <v-text-field v-model.number="form.idUsuario" label="idUsuario" type="number"
                                :rules="[rules.reqNum]" />
                        </v-col>

                        <v-col cols="12" md="8">
                            <v-text-field v-model="form.Nome" label="Nome" :rules="[rules.req, rules.max150]" />
                        </v-col>

                        <v-col cols="12" md="4">
                            <v-text-field v-model="form.CPF_CNPJ" label="CPF/CNPJ" :rules="[rules.req, rules.max20]" />
                        </v-col>

                        <v-col cols="12" md="3">
                            <v-text-field v-model.number="form.CEP" label="CEP" type="number" />
                        </v-col>
                        <v-col cols="12" md="9">
                            <v-text-field v-model="form.Logradouro" label="Logradouro" :rules="[rules.max100]" />
                        </v-col>

                        <v-col cols="12" md="6">
                            <v-text-field v-model="form.Endereco" label="Endereço" :rules="[rules.max120]" />
                        </v-col>
                        <v-col cols="12" md="3">
                            <v-text-field v-model="form.Numero" label="Número" :rules="[rules.max20]" />
                        </v-col>
                        <v-col cols="12" md="3">
                            <v-text-field v-model="form.Bairro" label="Bairro" :rules="[rules.max50]" />
                        </v-col>

                        <v-col cols="12" md="4">
                            <v-text-field v-model="form.Cidade" label="Cidade" :rules="[rules.max60]" />
                        </v-col>
                        <v-col cols="12" md="2">
                            <v-text-field v-model="form.UF" label="UF" maxlength="2" :rules="[rules.uf]" />
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-text-field v-model="form.Complemento" label="Complemento" :rules="[rules.max150]" />
                        </v-col>

                        <v-col cols="12" md="6">
                            <v-text-field v-model="form.Fone" label="Telefone" :rules="[rules.max20]" />
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-text-field v-model.number="form.LimiteCredito" label="Limite de Crédito" type="number" />
                        </v-col>

                        <v-col cols="12" md="6">
                            <v-text-field v-model="form.Validade" label="Validade (YYYY-MM-DD)" :rules="[rules.date]" />
                        </v-col>
                    </v-row>

                    <div class="text-caption mt-2">
                        <strong>Cadastro:</strong> {{ formatDate(form.DataHoraCadastro) }}
                    </div>
                </v-form>
            </v-card-text>

            <v-card-actions>
                <v-spacer />
                <v-btn variant="text" @click="$emit('close')" :disabled="submitting">Cancelar</v-btn>
                <v-btn color="primary" @click="submit" :loading="submitting">Salvar</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import { updateCliente } from '@/services/clientsService'
import { formatDate } from '@/utils'

export default {
    name: 'EditClientModal',
    props: {
        dialog: Boolean,
        client: { type: Object, default: () => ({}) }
    },
    emits: ['close', 'save', 'notify'],
    data() {
        return {
            localDialog: this.dialog,
            form: { ...this.client },
            submitting: false,
            rules: {
                req: v => !!String(v || '').trim() || 'Obrigatório',
                reqNum: v => (!!v && Number(v) > 0) || 'Obrigatório (número positivo)',
                uf: v => !v || v.length === 2 || 'UF deve ter 2 caracteres',
                date: v => !v || /^\d{4}-\d{2}-\d{2}$/.test(v) || 'Formato esperado: YYYY-MM-DD',
                max15: v => !v || String(v).length <= 15 || 'Máximo 15 caracteres',
                max20: v => !v || String(v).length <= 20 || 'Máximo 20 caracteres',
                max50: v => !v || String(v).length <= 50 || 'Máximo 50 caracteres',
                max60: v => !v || String(v).length <= 60 || 'Máximo 60 caracteres',
                max100: v => !v || String(v).length <= 100 || 'Máximo 100 caracteres',
                max120: v => !v || String(v).length <= 120 || 'Máximo 120 caracteres',
                max150: v => !v || String(v).length <= 150 || 'Máximo 150 caracteres'
            }
        }
    },
    watch: {
        dialog(v) { this.localDialog = v },
        client: {
            immediate: true,
            handler(v) {
                this.form = v ? JSON.parse(JSON.stringify(v)) : {}
            }
        }
    },
    methods: {
        formatDate,
        async submit() {
            const trySubmit = async () => {
                try {
                    this.submitting = true
                    if (this.form.UF) this.form.UF = this.form.UF.toUpperCase()

                    const updated = await updateCliente(this.form.ID, { ...this.form })
                    this.$emit('save', updated)
                    this.$emit('notify', { color: 'success', msg: 'Cliente atualizado com sucesso!' })
                    this.$emit('close')
                } catch (e) {
                    const msg = e?.data?.error || e?.message || 'Erro ao atualizar cliente.'
                    this.$emit('notify', { color: 'error', msg })
                } finally {
                    this.submitting = false
                }
            }

            const f = this.$refs.form
            if (f?.validate) {
                const { valid } = await f.validate()
                if (valid) await trySubmit()
            } else {
                await trySubmit()
            }
        }
    }
}
</script>
