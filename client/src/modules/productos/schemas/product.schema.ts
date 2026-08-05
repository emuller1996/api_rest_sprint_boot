// src/schemas/product.schema.ts
import { z } from "zod";

export const productSchema = z.object({
  nombre: z.string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(100, "El nombre no puede exceder 100 caracteres"),
  precio: z.number()
    .min(0.01, "El precio debe ser mayor a 0")
    .max(9999999, "El precio no puede ser tan alto"),
  stock: z.number()
    .int("El stock debe ser un número entero")
    .min(0, "El stock no puede ser negativo")
    .max(999999, "El stock no puede ser tan alto"),
  categoriaId: z.number()
    .min(1, "Debes seleccionar una categoría")
    .optional(),
});

export type ProductFormData = z.infer<typeof productSchema>;