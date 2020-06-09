<template>
    <GridLayout>
        <Label class="message" :text="msg" verticalAlignment="center" textWrap='true'/>
    </GridLayout>
</template>

<script >
export default {
  data() {
    return {
      msg: 'Welcome to Vending Machine with Advanced Ordering System'
    }
  }
}
</script>

