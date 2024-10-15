// * Sidebar Elements
export const sidebarItems = [
    { label: 'Crear solicitud', icon: 'edit_document', url: './request/create', permissions: ['admin', 'customer'] },
    { label: 'Panel Administrativo', icon: 'shield_person', url: './admin/manage', permissions: ['admin'] },
    // { label: 'Login', icon: 'login', url: './auth/login' },
    { label: 'Crear cuenta', icon: 'person_add', url: './admin/create-user', permissions: ['admin'] },
    { label: 'Mis solicitudes', icon: 'list_alt', url: './users/my-requests', permissions: ['customer'] },
    { label: 'Aviso de Privacidad', icon: 'admin_panel_settings', url: './users/privacy-notice', permissions: ['admin', 'customer'] },
];

// * Patterns
export const namePattern: RegExp = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
export const companyNamePattern: RegExp = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s\d\-.,\/_]+$/;
export const addressPattern: RegExp = /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s.,#\-\/]+$/;

// export const phoneNumberPattern: RegExp = /^\+?\d{1,3}?[-.\s]?\(?(\d{2,3})\)?[-.\s]?(\d{3})[-.\s]?(\d{2})[-.\s]?(\d{2})$/;
export const phoneNumberPattern: RegExp = /^\+?\d+$/;

// export const rfcPatternMoral: RegExp = /^[A-ZÑ&-]{4}\d{6}[A-ZÑ\d]{3}$/;
// export const rfcPatternMoral: RegExp = /^(?:[A-ZÑ&]-|[A-ZÑ&]{2}-|[A-ZÑ&]{3}-|[A-ZÑ&]{4})\d{6}[A-ZÑ\d]{3}$/;
export const rfcPatternPhysical: RegExp = /^[A-ZÑ&]{4}\d{6}[A-ZÑ\d]{3}$/;

// * Constant Values
export const NOM051SCFISSA12010_FASE2_ID: number = 6;
export const NOM051SCFISSA12010_FASE3_ID: number = 7;

export const INSPECT_NUMBER: string = `XXX`;
export const CODE_PDF: string = `FOR-14`;

export const WEB_INGCOM: string = `ingcom.com.mx`;
export const WHATSAPP_NUMBER: string = `5580130396`;
export const PHONE_NUMBER: string = `5525825612`;
export const EMAIL_CONTACT: string = `uva@ingcom.com.mx`;
export const ADDRESS_INGCOM: string = `Nicolas San Juan No. 1307 Int. 3, Col. Del Valle Sur, C.P. 03104, Alcaldía Benito Juárez, Ciudad de México`;

export const STATUS_REVIEW = 'review';
export const STATUS_CANCELLED = 'cancelled';
export const STATUS_ACCEPTED = 'accepted';

export const TEXT_CERTIFICATE_ACCEPTED = 'accepted';
export const TEXT_CERTIFICATE_CANCELLED = 'Solicitud no aprobada'
export const TEXT_CERTIFICATE_REVIEW = 'Espacio para el sello digital de la unidad';

export const TEXT_SELLO = '[[[SELLO_01]]]';
export const TEXT_JUMP_PAGE = '[[[JUMP_PAGE_01]]]';
