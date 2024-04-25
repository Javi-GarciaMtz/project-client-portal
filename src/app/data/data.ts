export const sidebarItems = [
    { label: 'Crear solicitud', icon: 'edit_document', url: './request/create', permissions: ['admin', 'customer'] },
    { label: 'Panel Administrativo', icon: 'shield_person', url: './admin/manage', permissions: ['admin'] },
    // { label: 'Login', icon: 'login', url: './auth/login' },
    { label: 'Crear cuenta', icon: 'person_add', url: './admin/create-user', permissions: ['admin'] },
    { label: 'Mis solicitudes', icon: 'list_alt', url: './users/my-requests', permissions: ['customer'] },
];