<template>
  <div class="quick-stats q-pa-sm bg-grey-1 text-grey-8" style="border-top: 1px solid rgba(0,0,0,0.05)">
    <q-expansion-item
      dense
      dense-toggle
      expand-separator
      icon="bar_chart"
      label="Quick Stats"
      header-class="text-weight-bold text-caption text-uppercase q-px-sm"
      toggle-color="primary"
    >
      <div class="row q-col-gutter-xs q-mt-xs text-center q-pb-sm">
        <div class="col-6">
          <div class="bg-white rounded-borders q-pa-xs border-light">
            <div class="text-h6 text-primary line-height-tight text-weight-bold">{{ stats.monthlyIncome }}</div>
            <div class="text-caption-xs text-grey-6">Income</div>
          </div>
        </div>
        <div class="col-6">
          <div class="bg-white rounded-borders q-pa-xs border-light">
            <div class="text-h6 text-green line-height-tight text-weight-bold">{{ stats.attendanceRate }}%</div>
            <div class="text-caption-xs text-grey-6">Attnd.</div>
          </div>
        </div>
        <div class="col-6">
          <div class="bg-white rounded-borders q-pa-xs border-light">
            <div class="text-h6 text-orange line-height-tight text-weight-bold">{{ stats.totalDue }}</div>
            <div class="text-caption-xs text-grey-6">Due</div>
          </div>
        </div>
        <div class="col-6">
          <div class="bg-white rounded-borders q-pa-xs border-light">
            <div class="text-h6 text-indigo line-height-tight text-weight-bold">{{ stats.activeStudents }}</div>
            <div class="text-caption-xs text-grey-6">Students</div>
          </div>
        </div>
      </div>
    </q-expansion-item>
  </div>
</template>

<script setup>
defineProps({
  stats: {
    type: Object,
    default: () => ({
      monthlyIncome: '125K',
      attendanceRate: '85',
      totalDue: '45K',
      activeStudents: '142'
    })
  }
})
</script>

<style scoped>
.border-light {
  border: 1px solid rgba(0,0,0,0.05);
}
.line-height-tight {
  line-height: 1.1;
}
.text-caption-xs {
  font-size: 0.7rem;
}
</style>
