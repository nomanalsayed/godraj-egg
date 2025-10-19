<template>
  <ClientOnly>
    <main class="p-4">
      <h1 class="text-lg font-semibold">Edit Standards — Week {{ currentWeek }}</h1>

      <pre class="text-xs text-gray-500 mt-2">routeName: {{ routeName }}</pre>

      <div v-if="loading" class="mt-4">Loading…</div>

      <div v-else-if="errorMsg" class="mt-4 text-red-600">
        {{ errorMsg }}
        <pre class="text-xs mt-2">{{ lastResponseText }}</pre>
        <button class="btn mt-2" @click="retry">Retry</button>
      </div>

      <div v-else-if="form" class="mt-4 space-y-2">
        <label>Male</label><input v-model.number="form.male" type="number" />
        <label>Female</label><input v-model.number="form.female" type="number" />
        <label>Depletion %</label><input v-model.number="form.depletion" type="number" />
        <label>Livability %</label><input v-model.number="form.livability" type="number" />
        <label>Hand Wk HE</label><input v-model.number="form.hand_wk_he" type="number" />
        <label>HE/W/B</label><input v-model.number="form.he_w_b" type="number" />
        <label>HHHE Cumulative</label><input v-model.number="form.hhhe_cumm" type="number" />
        <div class="flex gap-2 pt-2">
          <button class="btn-primary" @click="save">Save</button>
          <button class="btn" @click="goToWeek(currentWeek-1)" :disabled="currentWeek<=1">Prev</button>
          <button class="btn" @click="goToWeek(currentWeek+1)" :disabled="currentWeek>=71">Next</button>
        </div>
      </div>

      <div velse class="mt-4">No data received.</div>
    </main>
  </ClientOnly>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, useRoute, useRouter } from '#imports'
import { useAuth } from '~/composables/auth'

definePageMeta({ name: 'standards-edit-week' })

type WeekData = {
  week: number; male: number; female: number; depletion: number; livability: number;
  hand_wk_he: number; he_w_b: number; hhhe_cumm: number;
}

const route = useRoute()
const router = useRouter()
const auth = useAuth()

const routeName = ref<string>('(unknown)')
onMounted(() => { routeName.value = String(route.name ?? '(no name)') })

const toWeek = (p: unknown) => (Array.isArray(p) ? Number(p[0]) : Number(p)) || 1
const currentWeek = ref<number>(toWeek(route.params.week))
const form = ref<WeekData|null>(null)
const loading = ref(false)
const errorMsg = ref('')
const lastResponseText = ref('')
const isCreateMode = ref(false)

async function loadWeek(w:number) {
  loading.value = true; errorMsg.value = ''; lastResponseText.value = ''; form.value = null; isCreateMode.value = false;
  try {
    const res = await fetch(`/api/standards/week/${w}`, {
      headers: { Authorization: `Bearer ${auth.user.value?.token ?? ''}` },
      cache: 'no-store'
    })
    if (res.status === 404) {
      isCreateMode.value = true;
      // Seed default values (create mode)
      form.value = { week: w, male: 100, female: 100, depletion: 0.5, livability: 99.5,
                     hand_wk_he: 0, he_w_b: 0, hhhe_cumm: 0 }
      return
    }
    if (!res.ok) {
      lastResponseText.value = await res.text().catch(()=>'')
      throw new Error(`GET failed (${res.status})`)
    }
    form.value = await res.json() as WeekData
  } catch (e:any) {
    errorMsg.value = e?.message || 'Load failed'
    console.error('[standards] load error', e)
  } finally {
    loading.value = false
  }
}
function retry(){ loadWeek(currentWeek.value) }
function goToWeek(n:number){ router.push(`/standards/edit/week/${n}`) }

async function save() {
  if (!form.value) return
  try {
    const method = isCreateMode.value ? 'POST' : 'PUT'
    const url = isCreateMode.value ? '/api/standards/week' : `/api/standards/week/${currentWeek.value}`
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type':'application/json', Authorization: `Bearer ${auth.user.value?.token ?? ''}` },
      body: JSON.stringify(form.value)
    })
    if (!res.ok) {
      lastResponseText.value = await res.text().catch(()=>'')
      throw new Error(`Save failed (${res.status})`)
    }
    alert(`Week ${currentWeek.value} saved`)
    if (isCreateMode.value) {
      isCreateMode.value = false;
    }
  } catch (e:any) {
    errorMsg.value = e?.message || 'Save failed'
  }
}

onMounted(() => loadWeek(currentWeek.value))
watch(() => route.params.week, (nw) => {
  currentWeek.value = toWeek(nw); loadWeek(currentWeek.value)
})
</script>