<template>
    <div class="bg-white p-6 rounded-lg mt-8">
        <div class="container mx-auto">
            <h2 class="text-2xl font-bold text-gray-800 mb-4">Contact Information</h2>
            
            <!-- Search Bar -->
            <div class="mb-6">
                <div class="flex gap-4">
                    <input 
                        type="text" 
                        v-model="searchQuery"
                        @input="handleSearch"
                        placeholder="Search contacts..."
                        class="w-64 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                </div>
            </div>

            <div class="overflow-x-auto">
                <table class="min-w-full bg-white border border-gray-200">
                    <thead>
                        <tr class="bg-gray-100">
                            <th class="py-3 px-6 text-left text-gray-700 font-semibold border-b">Name</th>
                            <th class="py-3 px-6 text-left text-gray-700 font-semibold border-b">NIC</th>
                            <th class="py-3 px-6 text-left text-gray-700 font-semibold border-b">Address</th>
                            <th class="py-3 px-6 text-left text-gray-700 font-semibold border-b">Contact Numbers</th>
                            <th class="py-3 px-6 text-left text-gray-700 font-semibold border-b">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="customer in customers.data" :key="customer.id" class="hover:bg-gray-50">
                            <td class="py-3 px-6 border-b text-gray-600">{{ customer.name }}</td>
                            <td class="py-3 px-6 border-b text-gray-600">{{ customer.nic }}</td>
                            <td class="py-3 px-6 border-b text-gray-600">{{ customer.address }}</td>
                            <td class="py-3 px-6 border-b text-gray-600">{{ customer.contactNumbers }}</td>
                            <td class="py-3 px-6 border-b">
                                <button @click="editContact(customer)" class="text-blue-600 hover:text-blue-800 mr-6">Edit</button>
                                <button @click="deleteContact(customer.id)" class="text-red-600 hover:text-red-800">Delete</button>
                            </td>
                        </tr>
                        <tr v-if="!customers.data?.length">
                            <td colspan="6" class="py-4 text-center text-gray-500">No contacts found</td>
                        </tr>
                    </tbody>
                </table>

                <!-- Pagination -->
                <div class="mt-4 flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <select 
                            v-model="perPage" 
                            @change="handlePerPageChange"
                            class="border rounded px-2 py-1"
                        >
                            <option value="10">10</option>
                            <option value="25">25</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                        </select>
                        <span class="text-gray-600">Items per page</span>
                    </div>
                    
                    <div class="flex gap-2">
                        <button 
                            @click="changePage(currentPage - 1)"
                            :disabled="currentPage === 1"
                            class="px-4 py-2 border rounded hover:bg-gray-100 disabled:opacity-50"
                        >
                            Previous
                        </button>
                        <button 
                            v-for="page in totalPages" 
                            :key="page"
                            @click="changePage(page)"
                            :class="[
                                'px-4 py-2 border rounded hover:bg-gray-100',
                                currentPage === page ? 'bg-purple-500 text-white' : ''
                            ]"
                        >
                            {{ page }}
                        </button>
                        <button 
                            @click="changePage(currentPage + 1)"
                            :disabled="currentPage === totalPages"
                            class="px-4 py-2 border rounded hover:bg-gray-100 disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import { debounce } from 'lodash';

export default {
    name: 'CustomerList',
    data() {
        return {
            customers: {
                data: [],
                current_page: 1,
                last_page: 1,
                per_page: 10,
                total: 0
            },
            searchQuery: '',
            loading: false,
            currentPage: 1,
            perPage: 10
        }
    },
    computed: {
        totalPages() {
            return this.customers.last_page;
        }
    },
    created() {
        this.getCustomers();
    },
    methods: {
        async getCustomers() {
            try {
                this.loading = true;
                const response = await axios.get('http://127.0.0.1:8000/api/customers', {
                    params: {
                        page: this.currentPage,
                        per_page: this.perPage,
                        search: this.searchQuery
                    }
                });

                this.customers = response.data;
                this.customers.data = this.customers.data.map(customer => ({
                    ...customer,
                    address: customer.address ? customer.address.address : 'No Address',
                    contactNumbers: customer.contacts.map(contact => contact.phone_number).join(', ')
                }));
            } catch (error) {
                console.error('Error fetching customers:', error);
            } finally {
                this.loading = false;
            }
        },

        editContact(customer) {
            this.$router.push({ 
            name: 'editCustomer', // You can specify the route for editing
            params: { customerId: customer.id }
            });
        },
                
        handleSearch: debounce(function() {
            this.currentPage = 1;
            this.getCustomers();
        }, 300),

        changePage(page) {
            if (page >= 1 && page <= this.totalPages) {
                this.currentPage = page;
                this.getCustomers();
            }
        },

        handlePerPageChange() {
            this.currentPage = 1;
            this.getCustomers();
        },

        async deleteContact(id) {
            if (confirm('Are you sure you want to delete this customer?')) {
                try {
                    await axios.delete(`http://127.0.0.1:8000/api/customers/${id}`);
                    await this.getCustomers(); // Refresh the list after deletion
                } catch (error) {
                    console.error('Error deleting customer:', error);
                }
            }
        }
    }
}
</script>