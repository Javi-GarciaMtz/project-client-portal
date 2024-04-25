export interface User {
    user:  UserClass;
    token: string;
}

export interface UserClass {
    id:                number;
    name:              string;
    middle_name:       string;
    last_name:         string | null;
    rfc:               string;
    phone:             string | null;
    email:             string;
    role:              string;
    email_verified_at: string | null;
    created_at:        string;
    updated_at:        string;
    status:            string;
}
