// src/schemas/product.schema.ts
import { z } from "zod";

export const clienteSchema = z.object({
  nombre: z
    .string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(100, "El nombre no puede exceder 100 caracteres"),
  telefono: z.string(),
  direccion: z.string(),
});

export type ClientetFormData = z.infer<typeof clienteSchema>;
