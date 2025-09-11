<template>
    <v-dialog v-model="localDialog" max-width="520">
        <v-card>
            <v-progress-linear v-if="submitting" indeterminate absolute color="primary" />

            <v-card-title class="text-h6">Confirmar Exclusão</v-card-title>
            <v-card-text>
                Tem certeza que deseja deletar
                <strong>{{ client?.Nome }}</strong> (ID: {{ client?.ID }})?
            </v-card-text>

            <v-card-actions>
                <v-spacer />
                <v-btn variant="text" @click="$emit('close')" :disabled="submitting">Cancelar</v-btn>
                <v-btn color="error" @click="submit" :loading="submitting">Deletar</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import { deleteCliente } from '@/services/clientsService'

export default {
    name: 'DeleteClientModal',
    props: { dialog: Boolean, client: Object },
    emits: ['close', 'notify', 'deleted'],
    data() {
        return {
            localDialog: this.dialog,
            submitting: false
        }
    },
    watch: { dialog(v) { this.localDialog = v } },
    methods: {
        async submit() {
            if (!this.client?.ID) return
            try {
                this.submitting = true
                await deleteCliente(this.client.ID)

                // avisa o Home.vue para atualizar lista
                this.$emit('deleted', this.client.ID)
                this.$emit('notify', { color: 'success', msg: 'Cliente removido com sucesso!' })
                this.$emit('close')
            } catch (e) {
                const msg = e?.data?.error || e?.message || 'Erro ao remover cliente.'
                this.$emit('notify', { color: 'error', msg })
            } finally {
                this.submitting = false
            }
        }
    }
}
</script>
