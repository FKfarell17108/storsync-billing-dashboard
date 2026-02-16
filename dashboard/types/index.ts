export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user';
  created_at: string;
  updated_at: string;
}

export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  created_at: string;
  updated_at: string;
}

export interface Package {
  id: number;
  name: string;
  speed: string;
  price: number;
  created_at: string;
  updated_at: string;
}

export interface Subscription {
  id: number;
  customer_id: number;
  package_id: number;
  start_date: string;
  status: string;
  created_at: string;
  updated_at: string;
  customer?: Customer;
  package?: Package;
}

export interface Invoice {
  id: number;
  customer_id: number;
  month: string;
  total: number;
  status: 'paid' | 'unpaid' | 'pending';
  due_date: string;
  created_at: string;
  updated_at: string;
  customer?: Customer;
}

export interface Payment {
  id: number;
  invoice_id: number;
  amount: number;
  payment_date: string;
  method: string;
  created_at: string;
  updated_at: string;
  invoice?: Invoice;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ActivityItem {
  type: 'user' | 'customer' | 'package' | 'subscription' | 'invoice' | 'payment';
  action: 'created' | 'updated' | 'deleted' | 'paid' | 'assigned';
  title: string;
  timestamp: string;
}
