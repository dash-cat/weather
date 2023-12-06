<template>
    <div class="container">
        <label>{{ props.msg }}</label>
        <textarea
            class="container_area"
            v-if="props.area"
            :value="props.modelValue"
            @input="$emit('update:modelValue',  $event.target.value)"
        ></textarea>
        <InputEl 
            class="container_input"
            v-else
            :value="props.modelValue"
            @update:modelValue="$emit('update:modelValue', $event)"
        />
    </div>
</template>

<script setup>
import InputEl from '../input/InputEl.vue'

const props = defineProps(['msg', 'area','modelValue'])
defineEmits(['update:modelValue'])
</script>

<style scoped lang="scss">
.container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    &_input {
        width: 325px;
        height: 27px;
    }
    &_area {
        width: 325px;
        height: 70px;
    }
}
</style>