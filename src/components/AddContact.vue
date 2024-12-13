<template>
  <div>
    <CustomerForm @contact-added="handleContactAdded"/>
  </div>
</template>

<script>
import CustomerForm from './ContactForm.vue';

export default {
  components: {
    CustomerForm
  },
  methods: {
    handleContactAdded(newContact) {
      // Refresh your contacts list or handle the new contact
      console.log('New contact added:', newContact)
      //locate to /
      this.$router.push('/')
      this.getContacts() // If you have this method to refresh the list
    }
  }
}
</script>