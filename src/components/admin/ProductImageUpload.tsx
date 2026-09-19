"use client";

import { useRef, useState } from "react";

export default function ProductImageUpload({ productId }: { productId: number }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState("");
  const [mainImage, setMainImage] = useState(false);
  async function upload(file: File) {
    setMessage("Enviando...");
    const form = new FormData();
    form.append("file", file);
    const response = await fetch(`/api/commerce/admin/products/${productId}/images?imagemPrincipal=${mainImage}`, { method: "POST", body: form });
    setMessage(response.ok ? "Imagem enviada" : "Falha no envio");
  }
  return <span className="relative inline-flex items-center gap-1"><select value={mainImage ? "true" : "false"} onChange={(event) => setMainImage(event.target.value === "true")} aria-label="Tipo da imagem" className="h-8 max-w-24 rounded-lg border border-gray-300 bg-white px-2 text-xs dark:border-gray-700 dark:bg-gray-900"><option value="false">Comum</option><option value="true">Principal</option></select><input ref={inputRef} type="file" accept="image/*" className="sr-only" onChange={(event) => { const file = event.target.files?.[0]; if (file) void upload(file); }} /><button type="button" onClick={() => inputRef.current?.click()} title="Enviar imagem" aria-label="Enviar imagem" className="inline-flex size-8 items-center justify-center rounded-lg border border-brand-200 bg-brand-50 text-brand-600 hover:bg-brand-100 dark:border-brand-500/30 dark:bg-brand-500/15 dark:text-brand-300">↑</button>{message && <span className="absolute start-0 top-full z-10 mt-1 w-24 rounded bg-gray-900 px-2 py-1 text-xs text-white">{message}</span>}</span>;
}
