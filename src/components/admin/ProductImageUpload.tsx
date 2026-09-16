"use client";

import { useState } from "react";

export default function ProductImageUpload({ productId }: { productId: number }) {
  const [file, setFile] = useState<File | null>(null);
  const [mainImage, setMainImage] = useState(false);
  const [message, setMessage] = useState("");

  async function upload() {
    if (!file) return;
    setMessage("Enviando...");
    const data = new FormData();
    data.append("file", file);
    const response = await fetch(`/api/commerce/products/${productId}/images?imagemPrincipal=${mainImage}`, { method: "POST", body: data });
    setMessage(response.ok ? "Imagem enviada." : "Não foi possível enviar a imagem.");
    if (response.ok) setFile(null);
  }

  return <details className="relative"><summary className="cursor-pointer text-sm font-medium text-brand-500">Imagem</summary><div className="absolute end-0 z-10 mt-2 w-72 rounded-lg border border-gray-200 bg-white p-3 shadow-theme-md dark:border-gray-700 dark:bg-gray-900"><input type="file" accept="image/*" onChange={(event) => setFile(event.target.files?.[0] ?? null)} className="block w-full text-xs" /><label className="mt-3 flex items-center gap-2 text-xs"><input type="checkbox" checked={mainImage} onChange={(event) => setMainImage(event.target.checked)} />Imagem principal</label><button type="button" disabled={!file} onClick={upload} className="mt-3 rounded bg-brand-500 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50">Enviar</button>{message && <p className="mt-2 text-xs text-gray-500">{message}</p>}</div></details>;
}
