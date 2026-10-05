// Links e contatos centralizados para facilitar a edição.

// Número do WhatsApp (só dígitos, com DDI + DDD). Troque aqui e vale para o site todo.
export const WHATSAPP_NUMBER = "5511995645738"; // Atendimento 24h: (11) 9 9564-5738

// Todos os links de WhatsApp usam o mesmo contato e a mesma mensagem.
export const WHATSAPP_MESSAGE =
  "Olá! Vi o vídeo da Yaslip no YouTube e gostaria de saber como criar um site para minha empresa.";
export const WHATSAPP_URL = `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;
export const whatsappUrl = () => WHATSAPP_URL;
export const WHATSAPP_FLOAT_URL = WHATSAPP_URL;

// Contatos exibidos no rodapé.
export const CONTACT = {
  email: "contato@yaslip.com.br",
  phones: [
    { label: "WhatsApp Atendimento 24 horas por dia", display: "(11) 99564-5738", href: WHATSAPP_URL, whatsapp: true },
  ],
  address: ["Av. Sete de Setembro, 621 - Vila Galvão", "Guarulhos / SP - CEP: 07064-000"],
};

export const SOCIAL = {
  instagram: "https://www.instagram.com/yaslipoficial/",
  linkedin: "https://www.linkedin.com/company/yaslip/posts/?feedView=all",
  youtube: "https://www.youtube.com/channel/UCRGiQNYeXv6Axc3UWpOK6MQ",
};

export const SITE_URL = "https://www.yaslip.com.br/";

export const NAV_LINKS = [
  { href: "#inicio", label: "Início" },
  { href: "#servicos", label: "Serviços" },
  { href: "#como-funciona", label: "Como funciona" },
  { href: "#processo", label: "Processo" },
  { href: "#contato", label: "Contato" },
];

export const SOCIAL_LINKS = [
  { href: "https://www.instagram.com/yaslipoficial/", label: "Instagram" },
  { href: "https://www.linkedin.com/company/yaslip/posts/?feedView=all", label: "LinkedIn" },
  { href: WHATSAPP_URL, label: "WhatsApp" },
];
