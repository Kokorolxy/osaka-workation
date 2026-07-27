export type UserRole = "user" | "admin";
export type EventOptionKind = "package" | "addon";
export type RegistrationStatus =
  | "draft"
  | "pending_approval"
  | "approved"
  | "paid"
  | "cancelled";

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string | null;
          display_name: string | null;
          role: UserRole;
          referral_code: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email?: string | null;
          display_name?: string | null;
          role?: UserRole;
          referral_code?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string | null;
          display_name?: string | null;
          role?: UserRole;
          referral_code?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      events: {
        Row: {
          id: string;
          slug: string;
          title: string;
          description: string | null;
          starts_on: string | null;
          ends_on: string | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          description?: string | null;
          starts_on?: string | null;
          ends_on?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          description?: string | null;
          starts_on?: string | null;
          ends_on?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      event_options: {
        Row: {
          id: string;
          event_id: string;
          key: string;
          kind: EventOptionKind;
          name: string;
          description: string | null;
          price_jpy: number | null;
          sort_order: number;
        };
        Insert: {
          id?: string;
          event_id: string;
          key: string;
          kind: EventOptionKind;
          name: string;
          description?: string | null;
          price_jpy?: number | null;
          sort_order?: number;
        };
        Update: {
          id?: string;
          event_id?: string;
          key?: string;
          kind?: EventOptionKind;
          name?: string;
          description?: string | null;
          price_jpy?: number | null;
          sort_order?: number;
        };
        Relationships: [];
      };
      event_registrations: {
        Row: {
          id: string;
          user_id: string;
          event_id: string;
          package_key: string;
          addon_keys: string[];
          stay_key: string | null;
          phone: string | null;
          notes: string | null;
          status: RegistrationStatus;
          stripe_checkout_session_id: string | null;
          stripe_payment_intent_id: string | null;
          paid_at: string | null;
          referrer_id: string | null;
          referral_code_used: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          event_id: string;
          package_key: string;
          addon_keys?: string[];
          stay_key?: string | null;
          phone?: string | null;
          notes?: string | null;
          status?: RegistrationStatus;
          stripe_checkout_session_id?: string | null;
          stripe_payment_intent_id?: string | null;
          paid_at?: string | null;
          referrer_id?: string | null;
          referral_code_used?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          event_id?: string;
          package_key?: string;
          addon_keys?: string[];
          stay_key?: string | null;
          phone?: string | null;
          notes?: string | null;
          status?: RegistrationStatus;
          stripe_checkout_session_id?: string | null;
          stripe_payment_intent_id?: string | null;
          paid_at?: string | null;
          referrer_id?: string | null;
          referral_code_used?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
      find_referrer_by_code: {
        Args: { code: string };
        Returns: string;
      };
    };
    Enums: {
      user_role: UserRole;
    };
    CompositeTypes: Record<string, never>;
  };
};

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type EventRow = Database["public"]["Tables"]["events"]["Row"];
export type EventOption = Database["public"]["Tables"]["event_options"]["Row"];
export type EventRegistration =
  Database["public"]["Tables"]["event_registrations"]["Row"];
