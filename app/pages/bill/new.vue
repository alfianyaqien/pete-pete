<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { createBillInputSchema, BADGE_KEYS } from '~~/shared/schemas'
import type { Bill, ParticipantInput } from '~~/shared/types'

// Whole form (title + participants array) is owned by VeeValidate + Zod.
const { handleSubmit, isSubmitting } = useForm({
  validationSchema: toTypedSchema(createBillInputSchema),
  initialValues: { title: '', participants: [] as ParticipantInput[] },
})
const { fields, push, remove } = useFieldArray<ParticipantInput>('participants')

// preview badges follow the same order the server auto-assigns (BADGE_KEYS[i])
const previewBadge = (i: number) => BADGE_KEYS[i % BADGE_KEYS.length]!

const serverError = ref('')
const onSubmit = handleSubmit(async (values) => {
  serverError.value = ''
  try {
    const bill = await $fetch<Bill>('/api/bills', { method: 'POST', body: values })
    await navigateTo(`/bill/${bill.id}`)
  } catch (e: any) {
    serverError.value = e?.data?.statusMessage || 'Could not create bill'
  }
})
</script>

<template>
  <screen-header back title="New bill" @back="navigateTo('/')" />

  <main class="app-col flex-1 overflow-y-auto px-5 pb-28 pt-4">
    <form @submit.prevent="onSubmit">
      <core-input name="title" label="Bill title" placeholder="Argopuro" />

      <div class="mt-6">
        <span class="eyebrow">Participants ({{ fields.length }})</span>
        <div class="mt-2 flex flex-col gap-2">
          <div
            v-for="(field, i) in fields"
            :key="field.key"
            class="flex items-center gap-3 rounded-card border border-line-light bg-surface-card px-3 py-2"
          >
            <avatar-badge :badge-key="previewBadge(i)" :size="34" />
            <div class="flex-1">
              <core-input :name="`participants[${i}].name`" variant="bare" placeholder="Name" />
            </div>
            <button type="button" aria-label="Remove" class="btn-remove" @click="remove(i)">
              <span class="i-tabler-x" />
            </button>
          </div>

          <!-- dashed add row -->
          <button
            type="button"
            class="flex items-center justify-center gap-2 rounded-card border border-dashed border-line-medium bg-surface-subtle py-2.5 text-sm font-600 text-forest"
            @click="push({ name: '' })"
          >
            <span class="i-tabler-plus" /> Add participant
          </button>
        </div>
      </div>

      <p v-if="serverError" class="chip-neg mt-3">{{ serverError }}</p>

      <div
        class="mt-4 flex items-start gap-2 rounded-control border border-line-light bg-surface-subtle px-3 py-3 text-xs leading-relaxed text-body"
      >
        <span class="i-tabler-info-circle mt-0.5 text-ochre" />
        <span>
          No login needed. The share link is the key — anyone with it can view &amp; edit. Names must
          be unique; each gets a trail badge.
        </span>
      </div>
    </form>
  </main>

  <div class="flex-none border-t border-line-light bg-surface-card px-5 py-3">
    <div class="app-col">
      <core-button block :loading="isSubmitting" @click="onSubmit">
        Create &amp; add expense
        <span class="i-tabler-arrow-right" />
      </core-button>
    </div>
  </div>
</template>
