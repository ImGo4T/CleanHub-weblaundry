import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    url: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    phone?: string;
    role: 'admin' | 'operator' | 'pelanggan';
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
}

// CleanHub Domain Types

export interface Customer {
    id: number;
    user_id: number;
    user?: User;
    address?: string;
    membership_tier: 'bronze' | 'silver' | 'gold';
    points: number;
    total_spent: string;
    orders?: Order[];
    display_name?: string;
    created_at: string;
    updated_at: string;
}

export interface Service {
    id: number;
    name: string;
    description?: string;
    price_per_kg: string;
    price_per_item: string;
    unit_type: 'kg' | 'item' | 'both';
    duration_hours: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface Order {
    id: number;
    order_code: string;
    customer_id: number;
    customer?: Customer;
    operator?: User;
    service_id: number;
    service?: Service;
    status: OrderStatus;
    total_weight?: string;
    total_items?: number;
    subtotal: string;
    discount: string;
    total_price: string;
    payment_status: 'unpaid' | 'partial' | 'paid';
    pickup_type: 'drop_off' | 'pickup';
    delivery_type: 'self_pickup' | 'delivery';
    notes?: string;
    estimated_ready_at?: string;
    completed_at?: string;
    items?: OrderItem[];
    status_logs?: OrderStatusLog[];
    payments?: Payment[];
    created_at: string;
    updated_at: string;
}

export type OrderStatus = 'diterima' | 'dicuci' | 'disetrika' | 'siap' | 'diambil' | 'selesai' | 'cancelled';

export interface OrderItem {
    id: number;
    order_id: number;
    item_name: string;
    quantity: number;
    weight?: string;
    price: string;
    notes?: string;
    created_at: string;
}

export interface OrderStatusLog {
    id: number;
    order_id: number;
    status: string;
    changed_by: number;
    changed_by_user?: User;
    notes?: string;
    created_at: string;
}

export interface Payment {
    id: number;
    order_id: number;
    amount: string;
    method: 'cash' | 'transfer' | 'e-wallet';
    status: 'pending' | 'verified' | 'failed';
    reference?: string;
    paid_at?: string;
    created_at: string;
    updated_at: string;
}

export interface PaginatedData<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: PaginationLink[];
}

export interface PaginationLink {
    url?: string;
    label: string;
    active: boolean;
}

export interface StatusOption {
    value: string;
    label: string;
    color: string;
}
