/* =========================================================
   Conteúdo da DigitalFlow — processo da Yaslip, do estudo
   até o site no ar.
   - A ordem do array define a ordem das etapas na tela.
   - duration: tempo (ms) que cada etapa fica ativa no loop
   - event: linha que aparece no feed "Atividade"
   ========================================================= */

export const flowContent = {
  title: "Do estudo do seu negócio ao site no ar.",
  description:
    "Acompanhe as etapas que levam o seu projeto da estratégia até um site pronto para receber clientes.",
  windowTitle: "Yaslip · Projeto em andamento",
};

export const flowSteps = [
  {
    id: "strategy",
    label: "Estratégia",
    caption: "Plano para converter",
    duration: 3400,
    event: { title: "Estratégia definida", detail: "Plano aprovado" },
  },
  {
    id: "development",
    label: "Desenvolvimento",
    caption: "Páginas sendo criadas",
    duration: 3000,
    event: { title: "Desenvolvimento", detail: "Páginas criadas" },
  },
  {
    id: "analysis",
    label: "Análise de Site",
    caption: "Revisão antes de publicar",
    duration: 3000,
    event: { title: "Análise concluída", detail: "Site revisado e testado" },
  },
  {
    id: "launch",
    label: "Site no ar",
    caption: "Pronto para receber clientes",
    duration: 4200,
    event: { title: "Publicação", detail: "Site no ar" },
  },
];

// Itens revisados na análise (level = largura ilustrativa da barra, não é nota real)
export const auditItems = [
  { label: "Velocidade", level: 0.92 },
  { label: "SEO", level: 0.88 },
  { label: "Mobile", level: 0.95 },
];

// Itens do plano estratégico (recebem check em sequência)
export const strategyItems = [
  "Público-alvo definido",
  "Palavras-chave mapeadas",
  "Estrutura das páginas",
  "Chamadas para ação",
];

export const launchInfo = {
  domain: "seunegocio.com.br",
  message: "Seu site está publicado, rápido e pronto para receber visitantes.",
};
