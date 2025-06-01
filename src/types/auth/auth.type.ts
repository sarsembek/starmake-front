export type User = {
   id?: number;
   user_id?: number;
   email: string;
   is_verified: boolean;
   is_active: boolean;
   is_staff: boolean;
   is_limited: boolean;
   plan_type: string;
   role?: string;
   name_tg?: string;
   instagram?: string;
   email_tg?: string;
   start_date?: string;
   end_date?: string;
   left_days?: number;
   request_count?: number;
   subscription?: {
      tier: string;
      expires_at: string;
      messages_left: number;
   };
   subscription_expired?: boolean;
};

export type RegisterRequest = {
   email: string;
   password: string;
};

export type RegisterResponse = User;

export type LoginRequest = {
   email: string;
   password: string;
};

export type LoginResponse = {
   token: string;
   token_type: string;
   user: User;
};

export type ValidationErrorDetail = {
   loc: [string, number];
   msg: string;
   type: string;
};

export type ValidationError = {
   detail: ValidationErrorDetail[];
};

export type EmailExistsError = {
   detail: string;
};

export type EmailConfirmationRequest = {
   token: string;
};

export type EmailConfirmationResponse = User;

export type SendConfirmationEmailRequest = {
   email: string;
};

export type SendConfirmationEmailResponse = {
   message: string;
   token: string;
};

export type UnverifiedEmailError = {
   detail: string;
};
