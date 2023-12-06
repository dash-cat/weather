<template>
    <label
    v-if="label"
    :for="props.label">{{ props.label }}</label>
    <input
      :id="props.label"
      :type="props.type"
      :modelValue="props.modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
    />
</template>


<script setup>

const props = defineProps(['modelValue', 'label', 'type'])
defineEmits(['update:modelValue'])
console.log('props',props)
</script>
<style lang="scss">
input{
  height: 25px;
  width: 250px;
}
</style>