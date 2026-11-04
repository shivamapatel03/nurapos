export interface OwnerCatalogItem {
  id: number;
  name: string;
  description?: string;
  contact?: string;
  email?: string;
  address?: string;
  categoryId?: number;
  categoryName?: string;
  sellingPrice?: number;
  costPrice?: number;
  taxRate?: number;
  taxType?: 'inclusive' | 'exclusive';
  unit?: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface CategoryRequest {
  name: string;
  description?: string;
  status?: 'ACTIVE' | 'INACTIVE';
}

export interface ProductRequest {
  name: string;
  categoryId?: number;
  sellingPrice: number;
  costPrice: number;
  taxRate: number;
  taxType: 'inclusive' | 'exclusive';
  unit?: string;
  status?: 'ACTIVE' | 'INACTIVE';
}

export interface SupplierRequest {
  name: string;
  contact?: string;
  email?: string;
  address?: string;
  status?: 'ACTIVE' | 'INACTIVE';
}

export interface ExpenseCategoryRequest {
  name: string;
  description?: string;
  status?: 'ACTIVE' | 'INACTIVE';
}
