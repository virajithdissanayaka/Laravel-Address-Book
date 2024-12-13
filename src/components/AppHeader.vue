<template>
  <nav class="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 p-4 shadow-lg">
    <div class="container mx-auto">
      <div class="flex items-center justify-between">
        <!-- Logo -->
        <router-link to="/">
          <div class="text-white text-2xl font-bold">
            Address Book
          </div>
        </router-link>
        

        <!-- Navigation Links -->
        <div class="hidden md:flex space-x-8">
          <router-link to="/" class="text-white hover:text-yellow-200 transition duration-300">Home</router-link>
          <router-link to="add_contact" class="text-white hover:text-yellow-200 transition duration-300">Add Contact</router-link>
          <!-- <a href="#" class="text-white hover:text-yellow-200 transition duration-300">About</a>
          <a href="#" class="text-white hover:text-yellow-200 transition duration-300">Services</a>
          <a href="#" class="text-white hover:text-yellow-200 transition duration-300">Contact</a> -->
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'AppHeader',
}
</script>