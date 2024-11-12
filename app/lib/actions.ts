"use server";

import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
// All functions exported in this file are from the server-side and it doesn't get executed or sent to the client-side.

import { z } from "zod";

const CreateInvoiceSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  amount: z.coerce.number(),
  status: z.enum(["pending", "paid"]),
  date: z.string(),
});

const CreateInvoiceFormSchema = CreateInvoiceSchema.omit({
  id: true,
  date: true,
});

export async function createInvoice(formData: FormData) {
  const { customerId, amount, status } = CreateInvoiceFormSchema.parse({
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  });

  // Convertimos el monto a centavos para evitar errores de redondeo
  const amountInCents = amount * 100;

  // Creamos la fecha actual
  const date = new Date().toISOString().split("T")[0];

  await sql`
    INSERT INTO invoices (customer_id, amount, status, date)
    VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
  `;

  revalidatePath("/dashboard/invoices"); // This will revalidate the cache for the dashboard/invoices page
  redirect("/dashboard/invoices");

  //const rawFormData = Object.fromEntries(formData.entries()); // This is another way in case we have many fields in the form
}
