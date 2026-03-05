import { ProductFormData } from "./productFormData";

export interface AddProductModalProps {
  onClose: () => void;
  onAdd: (formData: ProductFormData) => void;
}

export interface AddauthModalProps {
  onClose: () => void;
}

