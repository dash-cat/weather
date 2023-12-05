<template>
    <input type="file" @change="onFileSelected" />
</template>

<script>
export default {
  name: 'ImageUpload',
  data () {
    return {
      previewImage: null
    }
  },
  methods: {
    onFileSelected (e) {
      const image = e.target.files[0]
      const reader = new FileReader()
      reader.readAsDataURL(image)
      reader.onload = e => {
        this.previewImage = e.target.result
        this.$emit('upload', this.previewImage)
      }
    }
  }
} // missing closure added
</script>

 <style>
    .uploading-image{
      display:flex;
    }
  </style>
