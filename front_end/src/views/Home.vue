<template>
  <v-container class="py-6">
    <v-row justify="center">
      <v-col cols="12" md="11" lg="10" xl="9">
        <TableClient
          :clients="clients"
          :isLoading="isLoading"
          @OpenAdd="showAdd = true"
          @EditClient="openEdit"
          @DeleteClient="openDelete"
          @Refresh="fetchClientes"
        />
      </v-col>
    </v-row>
  </v-container>

  <!-- Modais -->
  <AddClientModal 
    :dialog="showAdd"
    @close="closeAll"
    @created="onCreated"
    @notify="notify"
  />

  <EditClientModal
    :dialog="showEdit"
    :client="selected"
    @close="closeAll"
    @save="onEdited"
    @notify="notify"
  />

  <DeleteClientModal
    :dialog="showDelete"
    :client="selected"
    @close="closeAll"
    @deleted="onDeleted"
    @notify="notify"
  />

  <v-snackbar v-model="snack.open" :color="snack.color" timeout="4000">
    {{ snack.msg }}
    <template #actions>
      <v-btn variant="text" @click="snack.open = false">Fechar</v-btn>
    </template>
  </v-snackbar>
</template>

<script>
import TableClient from '@/components/TableClient.vue'
import AddClientModal from '@/modais/AddClientModal.vue'
import EditClientModal from '@/modais/EditClientModal.vue'
import DeleteClientModal from '@/modais/DeleteClientModal.vue'
import { listClientes } from '@/services/clientsService'

export default {
  name: 'HomePage',
  components: { TableClient, AddClientModal, EditClientModal, DeleteClientModal },
  data() {
    return {
      isLoading: false,
      clients: [],
      selected: null,
      showAdd: false,
      showEdit: false,
      showDelete: false,
      snack: { open: false, msg: '', color: 'success' }
    }
  },
  created() {
    this.fetchClientes()
  },
  methods: {
    async fetchClientes() {
      this.isLoading = true
      try {
        const res = await listClientes({ page: 1, limit: 25 })
        this.clients = res.rows || []
      } catch (e) {
        this.notify({ color: 'error', msg: e?.data?.error || e?.message || 'Falha ao carregar clientes.' })
        this.clients = []
      } finally {
        this.isLoading = false
      }
    },
    openEdit(c) {
      this.selected = { ...c }
      this.showEdit = true
    },
    openDelete(c) {
      this.selected = { ...c }
      this.showDelete = true
    },
    closeAll() {
      this.showAdd = this.showEdit = this.showDelete = false
      this.selected = null
    },
    async onCreated(){
      await this.fetchClientes()
      this.showAdd = false
      this.notify({ color: 'success', msg: 'Cliente adicionado com sucesso.' })
    },
    onEdited(updated) {
      if (!updated?.ID) return
      const i = this.clients.findIndex(c => c.ID === updated.ID)
      if (i >= 0) this.clients.splice(i, 1, { ...this.clients[i], ...updated })
      this.showEdit = false
      this.notify({ color: 'success', msg: 'Cliente atualizado.' })
    },
    async onDeleted() {
      await this.fetchClientes()
      this.showDelete = false
      this.notify({ color: 'success', msg: 'Cliente removido.' })
    },
    notify({ color = 'success', msg = '' }) {
      this.snack.color = color
      this.snack.msg = msg
      this.snack.open = true
    }
  }
}
</script>
