# Relatórios administrativos

## Implementação

Página `/reports` dividida em **Vendas** e **Processamentos externos**, preservando o shell TailAdmin, o controle de sessão administrativa e o JWT no cookie HttpOnly.

- Vendas: quatro indicadores provenientes de `summary`, filtros aplicados explicitamente, validação de período, paginação do servidor, detalhes em modal e download do CSV original por Blob.
- Exportação: usa os filtros aplicados e não envia `page`/`size`. Alterações ainda não aplicadas desabilitam a exportação. O proxy preserva `Content-Type` e `Content-Disposition`.
- Histórico: campos nulos de processamento são apresentados como Histórico, com explicação; não disparam consultas adicionais.
- Operação: fila independente com Todos/Pendentes/Processados, consulta de detalhes e conclusão apenas para MANUAL + PENDING. Referência externa opcional. Após sucesso, fila e relatório são recarregados.
- Estados: carregamento sem zeros fictícios, lista vazia, erro amigável, nova tentativa, sessão expirada e acesso negado. Respostas antigas são descartadas após troca de consulta.
- Nenhum backend, endpoint de negócio, dependência ou mock foi criado.

## Responsividade e acessibilidade

- Indicadores: uma coluna no celular, duas a partir de `sm` e quatro a partir de `xl`.
- Vendas: cards abaixo de `md`; tabela reduzida no tablet; pagamento e status do pedido também visíveis a partir de `xl`.
- Fila operacional: cards em uma ou duas colunas, sem tabela comprimida.
- Filtros e navegação empilhados no celular. Valores e nomes longos podem quebrar linha.
- Modais reutilizam o componente existente com foco inicial, contenção de Tab, retorno de foco, Escape e nome acessível. Formulários possuem labels e estados de carregamento/desabilitado.
- Tema escuro e tokens existentes preservados.

## Componentes reutilizados

`ComponentCard`, `PageBreadCrumb`, `Button`, `Badge`, `Alert`, `InputField`, `Label`, `Table`/`TableHeader`/`TableBody`/`TableRow`/`TableCell`, `Modal`, `useModal` e `PaginationControls`.

O tipo `PageResponse` e a ponte `/api/commerce/[...path]` existentes são reutilizados. A paginação mantém o comportamento por URL dos outros consumidores e aceita callbacks opcionais para os relatórios.

## Endpoints utilizados

Todos passam pela ponte autenticada existente:

- `GET /api/v1/admin/reports/sales`
- `GET /api/v1/admin/reports/sales/export`
- `GET /api/v1/admin/external-processings` (paginação e filtro `status`)
- `GET /api/v1/admin/external-processings/{processingId}`
- `PATCH /api/v1/admin/external-processings/{processingId}/complete`

O helper existente para `GET /api/v1/admin/external-processings/orders/{orderId}` permanece disponível; a página não faz essa consulta desnecessariamente.

## Arquivos criados

- `src/lib/admin/report-types.ts`
- `src/lib/admin/report-service.ts`
- `src/lib/admin/report-format.ts`
- `src/components/reports/ReportsPage.tsx`
- `src/components/reports/SalesReport.tsx`
- `src/components/reports/SalesSummaryCards.tsx`
- `src/components/reports/SalesReportFilters.tsx`
- `src/components/reports/SalesReportList.tsx`
- `src/components/reports/SalesReportDetails.tsx`
- `src/components/reports/ReportDialog.tsx`
- `src/components/reports/ReportFeedback.tsx`
- `src/components/reports/ReportStatus.tsx`
- `src/components/reports/useReportResource.ts`
- `docs/reports.md`

## Arquivos alterados

- `src/app/[locale]/(admin)/reports/page.tsx`
- `src/app/api/commerce/[...path]/route.ts`
- `src/components/admin/ExternalProcessings.tsx`
- `src/components/admin/PaginationControls.tsx`
- `src/lib/admin/external-processing-client.ts`
- `src/messages/en.json` (namespace `reports`, textos em português conforme solicitado; nenhuma nova localidade habilitada)

## Validação realizada

- `npm run build`: aprovado, incluindo compilação TypeScript e geração das rotas.
- `npx --no-install tsc --noEmit --incremental false`: aprovado após o build gerar os arquivos auxiliares do Next. A execução inicial, antes dessa geração, apontou erros de tipos SVG em arquivos existentes.
- ESLint dos arquivos criados/alterados: aprovado, sem avisos.
- `npm run lint`: falhou em dois erros existentes de `react-hooks/set-state-in-effect`, em `BrandManager.tsx` e `CategoryManager.tsx`. Há quatro avisos existentes nesses arquivos e em `ProductInventoryAndImages.tsx`. Esses arquivos não foram alterados.
- `git diff --check`: aprovado.
- Doze verificações de funções puras: datas sem deslocamento de dia, truncamento de frações de segundos, tratamento de null, BRL, parâmetros permitidos nos filtros/CSV e mapeamento seguro de erros HTTP. Nenhuma API simulada.
- Aplicação em modo de produção: as três rotas de listagem de vendas, exportação e fila operacional retornaram HTTP 401 sem sessão.

## Limitações de homologação

Não há `.env`, `.env.local` ou `API_BASE_URL` configurado no ambiente local do projeto, nem sessão administrativa disponível para consultar o backend. Não foram executados download real autenticado ou conclusão de pedidos reais.

A navegação local retornou redirecionamento circular HTTP 307 para a própria URL tanto em `/signin` quanto em `/reports`, inclusive enviando o cookie de idioma. O roteamento global/next-intl e as páginas de autenticação não foram alterados. Esse comportamento precisa ser investigado separadamente para permitir homologação visual autenticada. A responsividade foi revisada no código, mas não foi validada visualmente com dados reais no navegador.

## Roteiro de homologação com backend disponível

1. Entrar como administrador ativo; acessar Relatórios e conferir indicadores com a resposta real.
2. Aplicar período e status; conferir `page=0`, filtros na requisição e atualização conjunta de resumo/listagem.
3. Alterar rascunho de filtros; verificar que não há consulta automática e que o CSV exige aplicar os novos filtros.
4. Navegar entre páginas; verificar preservação dos filtros e tamanho de página retornado pelo backend.
5. Exportar; conferir nome, acentos, filtros e ausência de paginação na requisição CSV.
6. Abrir venda histórica e venda com processamento; conferir detalhes, datas e valores.
7. Conferir fila Todos/Pendentes/Processados; abrir processamento manual pendente e concluir somente um pedido de homologação autorizado, com e sem referência.
8. Voltar a Vendas; conferir resumo e status atualizados.
9. Validar em celular, tablet e desktop, em tema claro/escuro, incluindo navegação por teclado.
