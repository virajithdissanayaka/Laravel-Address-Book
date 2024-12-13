<template>
    <div class="max-w-2xl mx-auto p-6">
      <div class="bg-white rounded-lg shadow-xl p-8">
        <h2 class="text-2xl font-bold mb-6 text-purple-600">Edit Contact</h2>
        
        <form @submit.prevent="handleSubmit">
          <!-- Name Field -->
          <div class="mb-6">
            <label for="name" class="block text-gray-700 font-medium mb-2">Name</label>
            <input 
              type="text" 
              id="name" 
              v-model="formData.name"
              class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition duration-200"
              :class="{ 'border-red-500': errors.name }"
              placeholder="Enter full name"
            >
            <p v-if="errors.name" class="mt-1 text-red-500 text-sm">{{ errors.name }}</p>
          </div>
  
          <!-- NIC Field -->
          <div class="mb-6">
            <label for="nic" class="block text-gray-700 font-medium mb-2">NIC</label>
            <input 
              type="text" 
              id="nic" 
              v-model="formData.nic"
              class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition duration-200"
              :class="{ 'border-red-500': errors.nic }"
              placeholder="Enter NIC number"
            >
            <p v-if="errors.nic" class="mt-1 text-red-500 text-sm">{{ errors.nic }}</p>
          </div>

        <!-- Phone Numbers -->
        <div class="mb-6">
          <label class="block text-gray-700 font-medium mb-2">Phone Numbers</label>
          <div v-for="(phone, index) in formData.phones" :key="index" class="flex gap-2 mb-2">
            <input 
              type="tel" 
              v-model="formData.phones[index]"
              class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition duration-200"
              :class="{ 'border-red-500': errors.phones?.[index] }"
              placeholder="Enter phone number"
            >
            <button 
              type="button" 
              @click="removePhone(index)"
              class="px-4 py-3 text-red-500 hover:text-red-700 focus:outline-none"
              v-if="formData.phones.length > 1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
          <button 
            type="button"
            @click="addPhone"
            class="mt-2 text-purple-600 hover:text-purple-700 font-medium flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Another Phone Number
          </button>
        </div>

  
          <!-- Address Field -->
          <div class="mb-6">
            <label for="address" class="block text-gray-700 font-medium mb-2">Address</label>
            <textarea 
              id="address" 
              v-model="formData.address"
              rows="3"
              class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition duration-200"
              :class="{ 'border-red-500': errors.address }"
              placeholder="Enter full address"
            ></textarea>
            <p v-if="errors.address" class="mt-1 text-red-500 text-sm">{{ errors.address }}</p>
          </div>
  
          <!-- Submit Button -->
          <div class="flex justify-end">
            <button 
              type="submit"
              class="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white px-8 py-3 rounded-lg hover:opacity-90 transition duration-300 focus:outline-none focus:ring-2 focus:ring-purple-200"
              :disabled="isSubmitting"
            >
              {{ isSubmitting ? 'Saving...' : 'Save Contact' }}
            </button>
          </div>
        </form>
      </div>
    </div>
</template>
  
<script>
import axios from 'axios'

export default {
  name: 'EditForm',
  props: ['customerId'],
  data() {
    return {
      formData: {
        name: '',
        nic: '',
        phones: [''],
        address: ''
      },
      errors: {},
      isSubmitting: false
    }
  },
  mounted() {
    this.loadCustomerData()
  },
  methods: {
    addPhone() {
    this.formData.phones.push('');
    if (this.errors.phones) {
        this.errors.phones.push('');
    }
    },
    removePhone(index) {
    if (this.formData.phones.length > 1) {
        this.formData.phones.splice(index, 1);
        if (this.errors.phones) {
        this.errors.phones.splice(index, 1);
        }
    }
    },
    validateForm() {
      this.errors = {}

      if (!this.formData.name.trim()) {
        this.errors.name = 'Name is required'
      }

      if (!this.formData.nic.trim()) {
        this.errors.nic = 'NIC is required'
      }

      const phoneErrors = []
      let hasPhoneError = false
      this.formData.phones.forEach((phone, index) => {
        if (!phone.trim()) {
          phoneErrors[index] = 'Phone number is required'
          hasPhoneError = true
        }
      })
      if (hasPhoneError) {
        this.errors.phones = phoneErrors
      }

      if (!this.formData.address.trim()) {
        this.errors.address = 'Address is required'
      }

      return Object.keys(this.errors).length === 0
    },
    async loadCustomerData() {
      try {
        
        //get the customer id from params
        const customerId = this.$route.params.customerId

        console.log('Customer ID:', customerId)
        const response = await axios.get(`http://127.0.0.1:8000/api/customers/${customerId}`)
        const customer = response.data
        console.log('Customer Data:', customer)

        this.formData.name = customer.name
        this.formData.nic = customer.nic
        this.formData.address = customer.address.address || ''
        this.formData.phones = customer.contacts.map(contact => contact.phone_number)
      } catch (error) {
        console.error('Error fetching customer data:', error)
      }
    },
    async handleSubmit() {
        if (!this.validateForm()) {
            return;
        }

        try {
            this.isSubmitting = true;
            const customerId = this.$route.params.customerId;

            // Update customer details (name and NIC)
            await axios.put(`http://127.0.0.1:8000/api/customers/${customerId}`, {
                name: this.formData.name,
                nic: this.formData.nic,
            });

            // Fetch customer data again to get the updated contacts with IDs
            const response = await axios.get(`http://127.0.0.1:8000/api/customers/${customerId}`);
            const address = response.data.address;
            const contacts = response.data.contacts;

            const phonePromises = [];

            // Match phone numbers with existing contacts
            this.formData.phones.forEach((phone, index) => {
                if (contacts[index]) {
                    // Update existing phone numbers
                    phonePromises.push(
                        axios.put(`http://127.0.0.1:8000/api/contacts/${contacts[index].id}`, {
                            customer_id: customerId,
                            phone_number: phone,
                        })
                    );
                } else {
                    // Create new phone numbers
                    phonePromises.push(
                        axios.post(`http://127.0.0.1:8000/api/contacts`, {
                            customer_id: customerId,
                            phone_number: phone,
                        })
                    );
                }
            });

            // Handle removed phone numbers
            if (contacts.length > this.formData.phones.length) {
                const removedContacts = contacts.slice(this.formData.phones.length);
                removedContacts.forEach((contact) => {
                    phonePromises.push(
                        axios.delete(`http://127.0.0.1:8000/api/contacts/${contact.id}`)
                    );
                });
            }

            await Promise.all(phonePromises);

            // Update address
            await axios.put(`http://127.0.0.1:8000/api/addresses/${address.id}`, {
                customer_id: customerId,
                address: this.formData.address,
            });

            this.$router.push('/');
            alert('Contact updated successfully!');
        } catch (error) {
            console.error('Error submitting form:', error);
            if (error.response?.data?.errors) {
                this.errors = error.response.data.errors;
            } else {
                alert('Error updating contact. Please try again.');
            }
        } finally {
            this.isSubmitting = false;
        }
    }

  }
}
</script>