import ContactList from "@/components/ContactList.vue";
import AddContact from "@/components/AddContact.vue";
import { createRouter, createWebHistory } from 'vue-router';

const routes = [
    {
        name: "ContactList",
        path: "/",
        component: ContactList,
    },
    {
        name: "AddContact",
        path: "/add_contact",
        component: AddContact,
    },
    {
        path: '/edit/:customerId',
        name: 'editCustomer',
        component: () => import('@/components/EditContact.vue')
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router;