<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { createBillInputSchema, BADGE_KEYS } from '~~/shared/schemas'
import type { Bill, ParticipantInput } from '~~/shared/types'

const { handleSubmit, errors } = useForm({
  validationSchema: toTypedSchema(createBillInputSchema),
  initialValues: { title: '', participants: [] as ParticipantInput[] },
})
const { value: title } = useField<string>('title')
const { fields, push, remove } = useFieldArray<ParticipantInput>('participants')

// preview badges follow the same order the server auto-assigns (BADGE_KEYS[i])
const previewBadge = (i: number) => BADGE_KEYS[i % BADGE_KEYS.length]

const newName = ref('')
const addError = ref('')
function addParticipant() {
  const name = newName.value.trim()
  if (!name) return
  if (fields.value.some((f) => f.value.name.toLowerCase() === name.toLowerCase())) {
    addError.value = 'That name is already on the trip'
    return
  }
  push({ name })
  newName.value = ''
  addError.value = ''
}

const submitting = ref(false)
const onSubmit = handleSubmit(async (values) => {
  submitting.value = true
  try {
    const bill = await $fetch<Bill>('/api/bills', { method: 'POST', body: values })
    await navigateTo(`/bill/${bill.id}`)
  } finally {
    submitting.value = false
  }
})
</script>

<template>
  <ScreenHeader back title="New bill" @back="navigateTo('/')" />

  <main class="flex-1 overflow-y-auto px-5 pb-28 pt-4">
    <form @submit.prevent="onSubmit">
      <label class="block">
        <span class="eyebrow">Bill title</span>
        <input
          v-model="title"
          placeholder="Argopuro"
          class="mt-1.5 w-full rounded-control border border-line-light bg-surface-input px-3 py-2.5 text-ink focus:border-forest focus:outline-none"
        />
        <span v-if="errors.title" class="mt-1 block text-xs text-terracotta">{{ errors.title }}</span>
      </label>

      <div class="mt-6">
        <span class="eyebrow">Participants ({{ fields.length }})</span>
        <div class="mt-2 flex flex-col gap-2">
          <div
            v-for="(f, i) in fields"
            :key="f.key"
            class="flex items-center gap-3 rounded-card border border-line-light bg-surface-card px-3 py-2"
          >
            <AvatarBadge :badge-key="previewBadge(i)" :size="34" />
            <span class="flex-1 text-sm font-600 text-ink">{{ f.value.name }}</span>
            <button type="button" aria-label="Remove" class="text-terracotta" @click="remove(i)">
              <span class="i-tabler-x" />
            </button>
          </div>

          <!-- dashed add row -->
          <div
            class="flex items-center gap-2 rounded-card border border-dashed border-line-medium bg-surface-subtle px-3 py-2"
          >
            <span class="i-tabler-plus text-muted" />
            <input
              v-model="newName"
              placeholder="Add participant"
              class="flex-1 bg-transparent text-sm text-ink placeholder-muted focus:outline-none"
              @keydown.enter.prevent="addParticipant"
            />
            <button type="button" class="text-sm font-600 text-forest" @click="addParticipant">
              Add
            </button>
          </div>
          <span v-if="addError" class="text-xs text-terracotta">{{ addError }}</span>
        </div>
      </div>

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

  <div class="border-t border-line-light bg-surface-card px-5 py-3">
    <button class="btn-forest w-full" :disabled="submitting" @click="onSubmit">
      Create &amp; add expense
      <span class="i-tabler-arrow-right" />
    </button>
  </div>
</template>
