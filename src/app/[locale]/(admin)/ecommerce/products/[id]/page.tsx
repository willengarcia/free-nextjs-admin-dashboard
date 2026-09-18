import ComponentCard from "@/components/common/ComponentCard";
import { getCommerceData } from "@/lib/admin/server";
import { Link } from "@/i18n/navigation";

type Product = { nome: string; sku: string; descricaoCurta: string; descricao: string; preco: number; precoPromocional?: number; quantidadeEstoque: number; quantidadeReservada: number; estoqueMinimo: number; status: string; categoriaId: number };
type ProductImage = { id: number; urlImagem: string; nomeArquivo: string; imagemPrincipal: boolean };
const money = (value: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [product, images] = await Promise.all([getCommerceData<Product>(`/products/${id}`), getCommerceData<ProductImage[]>(`/products/${id}/images`)]);
  if (!product) return <ComponentCard title="Produto indisponível">Não foi possível carregar este produto.</ComponentCard>;
  return <><Link href="/ecommerce/products" className="text-sm font-medium text-brand-500">← Produtos</Link><div className="mt-4 flex justify-between"><div><h1 className="text-title-md font-semibold">{product.nome}</h1><p className="text-sm text-gray-500">SKU: {product.sku}</p></div><span>{product.status}</span></div><div className="mt-6 grid gap-6 xl:grid-cols-2"><ComponentCard title="Informações"><dl className="grid grid-cols-2 gap-4"><dt>Preço</dt><dd>{money(product.preco)}</dd><dt>Estoque</dt><dd>{product.quantidadeEstoque}</dd><dt>Reservado</dt><dd>{product.quantidadeReservada}</dd><dt>Estoque mínimo</dt><dd>{product.estoqueMinimo}</dd><dt>Categoria</dt><dd>#{product.categoriaId}</dd></dl></ComponentCard><ComponentCard title="Descrição"><p>{product.descricaoCurta}</p><p className="mt-3">{product.descricao}</p></ComponentCard></div><div className="mt-6"><ComponentCard title="Imagens"><div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">{images?.map((image) => <figure key={image.id}><img src={image.urlImagem} alt={image.nomeArquivo} className="aspect-square w-full rounded-xl object-cover" /><figcaption className="mt-2 text-xs">{image.imagemPrincipal ? "Imagem principal" : image.nomeArquivo}</figcaption></figure>)}</div>{!images?.length && <p>Nenhuma imagem cadastrada.</p>}</ComponentCard></div></>;
}
