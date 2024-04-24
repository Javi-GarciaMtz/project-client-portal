export interface User {
    user:  UserClass;
    token: string;
}

export interface UserClass {
    id:                number;
    name:              string;
    middle_name:       string;
    last_name:         null;
    rfc:               string;
    phone:             null;
    email:             string;
    role:              string;
    email_verified_at: null;
    created_at:        Date;
    updated_at:        Date;
    status:            string;
}
