<template>
  <v-card class="grid-card mx-auto" max-width="1600"> <!-- largura maior -->
    <v-toolbar flat>
      <v-toolbar-title>Clientes</v-toolbar-title>
      <v-spacer />

      <!-- Filtros -->
      <v-text-field
        v-model="filters.Codigo"
        label="Filtrar Código"
        density="compact"
        variant="outlined"
        hide-details
        class="filter-field"
      />
      <v-text-field
        v-model="filters.Nome"
        label="Filtrar Nome"
        density="compact"
        variant="outlined"
        hide-details
        class="filter-field"
      />
      <v-text-field
        v-model="filters.CPF_CNPJ"
        label="Filtrar CPF/CNPJ"
        density="compact"
        variant="outlined"
        hide-details
        class="filter-field"
      />
      <v-text-field
        v-model="filters.Cidade"
        label="Filtrar Cidade"
        density="compact"
        variant="outlined"
        hide-details
        class="filter-field"
      />

      <!-- Botões -->
      <v-btn class="ml-2" color="primary" @click="$emit('OpenAdd')">
        <v-icon start>mdi-plus</v-icon> Novo
      </v-btn>
      <v-btn icon class="ml-1" @click="$emit('Refresh')">
        <v-icon>mdi-reload</v-icon>
      </v-btn>
    </v-toolbar>

    <v-divider />

    <div class="table-scroll">
      <v-data-table
        :headers="headers"
        :items="computedItems"
        :loading="isLoading"
        :items-per-page="25"
        :sort-by="[{ key: 'ID', order: 'desc' }]"
        item-key="ID"
        hover
        class="rounded-b-xl"
        density="comfortable"
      >
        <template #loading>
          <v-skeleton-loader type="table-row@5" />
        </template>

        <template #item.DataHoraCadastro="{ value }">
          {{ formatDate(value) }}
        </template>
        <template #item.Validade="{ value }">
          {{ value ? formatDate(value) : '-' }}
        </template>

        <template #item.actions="{ item }">
          <div class="action-buttons">
            <v-btn
              size="small"
              color="primary"
              variant="tonal"
              class="action-btn"
              @click="$emit('EditClient', item)"
            >
              <v-icon>mdi-file-edit-outline</v-icon>
            </v-btn>
            <v-btn
              size="small"
              color="error"
              variant="tonal"
              class="action-btn"
              @click="$emit('DeleteClient', item)"
            >
              <v-icon>mdi-delete-outline</v-icon>
            </v-btn>
          </div>
        </template>

        <template #no-data>
          <v-card-text>Nenhum cliente encontrado</v-card-text>
        </template>
      </v-data-table>
    </div>
  </v-card>
</template>

<script>
import { format } from 'date-fns'

export default {
  name: 'TableClient',
  props: {
    clients: { type: Array, default: () => [] },
    isLoading: { type: Boolean, default: false }
  },
  emits: ['OpenAdd', 'EditClient', 'DeleteClient', 'Refresh'],
  data() {
    return {
      filters: {
        Codigo: '',
        Nome: '',
        CPF_CNPJ: '',
        Cidade: ''
      },
      headers: [
        { title: 'ID', key: 'ID', sortable: true },
        { title: 'Código', key: 'Codigo', sortable: true },
        { title: 'Nome', key: 'Nome', sortable: true },
        { title: 'CPF/CNPJ', key: 'CPF_CNPJ' },
        { title: 'Telefone', key: 'Fone' },
        { title: 'Cidade', key: 'Cidade' },
        { title: 'UF', key: 'UF' },
        { title: 'Limite Crédito', key: 'LimiteCredito' },
        { title: 'Cadastro', key: 'DataHoraCadastro' },
        { title: 'Validade', key: 'Validade' },
        { title: 'Ações', key: 'actions', sortable: false }
      ]
    }
  },
  computed: {
    computedItems() {
      return this.clients.filter(c => {
        return (
          (!this.filters.Codigo ||
            String(c.Codigo || '').toLowerCase().includes(this.filters.Codigo.toLowerCase())) &&
          (!this.filters.Nome ||
            String(c.Nome || '').toLowerCase().includes(this.filters.Nome.toLowerCase())) &&
          (!this.filters.CPF_CNPJ ||
            String(c.CPF_CNPJ || '').toLowerCase().includes(this.filters.CPF_CNPJ.toLowerCase())) &&
          (!this.filters.Cidade ||
            String(c.Cidade || '').toLowerCase().includes(this.filters.Cidade.toLowerCase()))
        )
      })
    }
  },
  methods: {
    formatDate(value) {
      if (!value) return '-'
      try {
        return format(new Date(value), 'dd/MM/yyyy')
      } catch {
        return value
      }
    }
  }
}
</script>

<style scoped>
.action-buttons {
  display: flex;
  gap: 6px;
}

.action-btn {
  min-width: 36px;
  height: 36px;
  border-radius: 8px;
  padding: 0;
  justify-content: center;
  align-items: center;
}

.grid-card {
  border-radius: 12px;
}

.table-scroll {
  max-height: 65vh;
  overflow: auto;
}

.filter-field {
  margin-right: 12px;
  max-width: 200px;
}

@media (max-width: 960px) {
  .table-scroll {
    max-height: 55vh;
  }
}
</style>
