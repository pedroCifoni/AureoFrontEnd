# Aureo Front-end

Interface web do **Aureo**, plataforma de organização financeira pessoal. Consome a [Aureo API](https://github.com/pedroCifoni/AureoBackEnd).

**[Ver online](https://aureo-front-end.vercel.app)**

## Stack

- **React 19** + **TypeScript**
- **Vite**
- **Tailwind CSS 4**
- **React Router** (rotas e layouts)
- **Axios** (cliente HTTP)
- **Sonner** (notificações) e **Lucide** (ícones)
- **ESLint** com `typescript-eslint`
- Deploy na **Vercel**

## Telas

| Tela | Descrição |
|---|---|
| `Login` | Autenticação do usuário |
| `Home` | Página inicial |
| `Dashboard` | Visão geral das finanças |
| `Transacoes` | Listagem das receitas e despesas |
| `NovaTransacao` | Cadastro de transação |
| `Metas` | Metas financeiras |

## Estrutura

```
src/
  components/ui/  componentes reutilizáveis
  layouts/        estrutura compartilhada das páginas
  pages/          telas
  router/         definição das rotas
  services/       acesso à API (`api.ts`, `authService.ts`, `transacaoService.ts`)
  hooks/          hooks customizados
  models/         tipos e contratos
  utils/          funções auxiliares
```

As páginas conversam com a API apenas por meio da camada `services`.

## Como rodar

Pré-requisitos: Node.js e a [Aureo API](https://github.com/pedroCifoni/AureoBackEnd) em execução.

```bash
git clone https://github.com/pedroCifoni/AureoFrontEnd.git
cd AureoFrontEnd
npm install
npm run dev
```

O cliente HTTP fica em `src/services/api.ts`. Ajuste lá a URL base da API, se necessário.

### Scripts

| Comando | O que faz |
|---|---|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Checagem de tipos e build de produção |
| `npm run lint` | Análise estática com ESLint |
| `npm run preview` | Pré-visualiza o build |

## Autor

Pedro Cifoni · [LinkedIn](https://www.linkedin.com/in/pedro-cifoni-montezuma/)
