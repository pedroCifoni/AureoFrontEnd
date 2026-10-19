import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Coins,
  ArrowRight,
  ArrowRightLeft,
  Filter,
  BarChart3,
  PieChart,
  ShieldCheck,
  Wallet,
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  Home as HomeIcon,
  Coffee,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatBRL } from '@/utils/format';

const features = [
  {
    icon: ArrowRightLeft,
    title: 'Todas as transações num só lugar',
    text: 'Registre receitas e despesas em segundos e mantenha o histórico completo, sempre à mão.',
  },
  {
    icon: Filter,
    title: 'Filtros que encontram tudo',
    text: 'Busque por descrição, categoria, tipo ou mês e ordene por data ou valor sem esforço.',
  },
  {
    icon: BarChart3,
    title: 'Evolução mês a mês',
    text: 'Compare receitas e despesas ao longo do tempo e entenda para onde o seu dinheiro vai.',
  },
  {
    icon: PieChart,
    title: 'Gastos por categoria',
    text: 'Veja quanto cada categoria pesa no orçamento e descubra onde dá para economizar.',
  },
];

const steps = [
  { n: '01', title: 'Crie sua conta', text: 'Cadastro rápido, só com nome, e-mail e senha.' },
  { n: '02', title: 'Registre suas movimentações', text: 'Adicione receitas e despesas com categoria e data.' },
  { n: '03', title: 'Acompanhe e decida', text: 'Saldo, gráficos e filtros mostram o quadro completo.' },
];

const sampleRows = [
  { icon: <TrendingUp size={14} />, desc: 'Salário', cat: 'Receita', value: 4500, expense: false },
  { icon: <HomeIcon size={14} />, desc: 'Aluguel', cat: 'Moradia', value: 1400, expense: true },
  { icon: <ShoppingCart size={14} />, desc: 'Supermercado', cat: 'Alimentação', value: 387.9, expense: true },
  { icon: <Coffee size={14} />, desc: 'Padaria', cat: 'Alimentação', value: 25.5, expense: true },
];

const sampleBars = [
  [55, 40],
  [62, 48],
  [58, 35],
  [75, 52],
  [70, 44],
  [88, 50],
];

const navLinks = [
  { id: 'recursos', label: 'Recursos' },
  { id: 'como-funciona', label: 'Como funciona' },
];

export const HomePage = () => {
  const [ativo, setAtivo] = useState<string | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setAtivo(e.target.id);
        });
      },
      { rootMargin: '-40% 0px -50% 0px' }
    );
    navLinks.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const irPara = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen bg-base text-text-primary overflow-x-clip">
      {/* Fundo decorativo */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[720px] opacity-60"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(48,54,61,0.35) 1px, transparent 1px), linear-gradient(to bottom, rgba(48,54,61,0.35) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
          maskImage: 'radial-gradient(ellipse at 50% 0%, black 30%, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(ellipse at 50% 0%, black 30%, transparent 75%)',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[-180px] h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-gold/10 blur-[120px]"
      />

      {/* Navbar */}
      <header className="sticky top-0 z-30 border-b border-border/60 bg-base/70 backdrop-blur-xl shadow-[0_1px_0_rgba(201,168,76,0.08)]">
        <div className="mx-auto grid h-16 max-w-6xl grid-cols-[1fr_auto] items-center gap-6 px-6 md:grid-cols-[1fr_auto_1fr]">
          <Link to="/" className="flex items-center gap-2.5 justify-self-start">
            <div className="flex h-9 w-9 items-center justify-center rounded-card border border-gold/30 bg-gold/10">
              <Coins size={18} className="text-gold" />
            </div>
            <span className="text-lg font-bold tracking-tight">Aureo</span>
          </Link>

          <nav className="hidden items-center gap-1 rounded-full border border-border bg-surface/80 p-1 shadow-card md:flex">
            {navLinks.map((l) => (
              <a
                key={l.id}
                href={`#${l.id}`}
                onClick={(e) => irPara(e, l.id)}
                className={`rounded-full px-5 py-1.5 text-sm font-medium transition-all duration-200 ${
                  ativo === l.id
                    ? 'bg-gold/15 text-gold shadow-[inset_0_0_0_1px_rgba(201,168,76,0.35)]'
                    : 'text-text-secondary hover:bg-elevated hover:text-text-primary'
                }`}
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3 justify-self-end">
            <Link to="/login">
              <Button variant="secondary">Entrar</Button>
            </Link>
            <Link to="/criar-conta" className="hidden sm:block">
              <Button>Criar conta</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 mx-auto max-w-6xl px-6 pb-20 pt-20 text-center md:pt-28">
        <Badge variant="warning" className="border-gold/30 bg-gold/10 text-gold">
          <ShieldCheck size={12} />
          Suas finanças, sob controle
        </Badge>

        <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl md:text-6xl">
          Organize sua vida.
          <br />
          <span className="bg-gradient-to-r from-gold via-[#E8D08A] to-gold-muted bg-clip-text text-transparent">
            Organize suas finanças.
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-base text-text-secondary md:text-lg">
          O Aureo reúne receitas, despesas e categorias em um painel simples e elegante, para você
          saber exatamente para onde vai cada real.
        </p>

        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link to="/criar-conta">
            <Button className="h-11 px-6 text-base">
              Começar agora
              <ArrowRight size={16} className="ml-2" />
            </Button>
          </Link>
          <Link to="/login">
            <Button variant="secondary" className="h-11 px-6 text-base">
              Já tenho conta
            </Button>
          </Link>
        </div>

        {/* Prévia ilustrativa do produto */}
        <div className="relative mx-auto mt-16 max-w-4xl text-left">
          <div
            aria-hidden
            className="absolute -inset-4 rounded-[28px] bg-gold/5 blur-2xl"
          />
          <Card className="relative border-border/80 p-4 shadow-glow md:p-6">
            <div className="mb-5 flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-danger/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-warning/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-success/70" />
              <span className="ml-3 text-xs text-text-secondary">Dashboard</span>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {[
                { label: 'Saldo', value: 2686.6, icon: <Wallet size={14} /> },
                { label: 'Receitas', value: 4500, icon: <TrendingUp size={14} /> },
                { label: 'Despesas', value: 1813.4, icon: <TrendingDown size={14} /> },
              ].map((k) => (
                <div key={k.label} className="rounded-button border border-border bg-elevated p-4">
                  <div className="flex items-center justify-between text-text-secondary">
                    <span className="text-[10px] font-medium uppercase tracking-widest">{k.label}</span>
                    <span className="text-gold">{k.icon}</span>
                  </div>
                  <p className="mt-2 font-mono text-xl font-bold">{formatBRL(k.value)}</p>
                </div>
              ))}
            </div>

            <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-5">
              <div className="rounded-button border border-border bg-elevated p-4 md:col-span-3">
                <p className="text-xs font-semibold">Evolução mensal</p>
                <div className="mt-4 flex h-32 items-end gap-3">
                  {sampleBars.map(([r, d], i) => (
                    <div key={i} className="flex h-full flex-1 items-end gap-1">
                      <div className="flex-1 rounded-t bg-success/80" style={{ height: `${r}%` }} />
                      <div className="flex-1 rounded-t bg-danger/80" style={{ height: `${d}%` }} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-button border border-border bg-elevated p-4 md:col-span-2">
                <p className="text-xs font-semibold">Últimas transações</p>
                <div className="mt-2 flex flex-col">
                  {sampleRows.map((r) => (
                    <div
                      key={r.desc}
                      className="flex items-center justify-between border-b border-border py-2 last:border-0"
                    >
                      <div className="flex items-center gap-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-surface text-gold">
                          {r.icon}
                        </span>
                        <div>
                          <p className="text-xs font-medium">{r.desc}</p>
                          <p className="text-[10px] text-text-secondary">{r.cat}</p>
                        </div>
                      </div>
                      <span
                        className={`font-mono text-xs font-semibold ${r.expense ? 'text-danger' : 'text-success'}`}
                      >
                        {r.expense ? '- ' : '+ '}
                        {formatBRL(r.value)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
          <p className="mt-3 text-center text-xs text-text-secondary">Exemplo ilustrativo com dados fictícios.</p>
        </div>
      </section>

      {/* Recursos */}
      <section id="recursos" className="relative z-10 mx-auto max-w-6xl scroll-mt-20 px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <Badge className="border-gold/30 bg-gold/10 text-gold">Recursos</Badge>
          <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
            Tudo o que você precisa para enxergar o seu dinheiro
          </h2>
          <p className="mt-3 text-text-secondary">
            Ferramentas simples, pensadas para dar clareza ao seu dia a dia financeiro.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <Card
              key={f.title}
              hoverable
              className="flex flex-col items-start gap-4 p-6 transition-transform duration-200 hover:-translate-y-1"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-card border border-gold/30 bg-gold/10">
                <f.icon size={20} className="text-gold" />
              </div>
              <h3 className="text-base font-semibold leading-snug text-white">{f.title}</h3>
              <p className="text-sm leading-relaxed text-text-secondary">{f.text}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Como funciona */}
      <section id="como-funciona" className="relative z-10 mx-auto max-w-6xl scroll-mt-20 px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <Badge className="border-gold/30 bg-gold/10 text-gold">Como funciona</Badge>
          <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
            Do cadastro ao controle em três passos
          </h2>
          <p className="mt-3 text-text-secondary">
            Em poucos minutos você sai do zero e tem uma visão completa das suas finanças.
          </p>
        </div>

        <div className="relative mt-14 grid grid-cols-1 gap-5 md:grid-cols-3">
          <div
            aria-hidden
            className="absolute left-[16%] right-[16%] top-[52px] hidden h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent md:block"
          />
          {steps.map((s) => (
            <div
              key={s.n}
              className="relative flex flex-col items-center rounded-card border border-border bg-surface p-7 text-center shadow-card"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/40 bg-base font-mono text-lg font-bold text-gold shadow-glow">
                {s.n}
              </span>
              <h3 className="mt-5 text-base font-semibold text-white">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA final */}
      <section className="relative z-10 mx-auto max-w-6xl px-6 pb-24 pt-10">
        <div className="relative overflow-hidden rounded-card border border-gold/20 bg-surface px-6 py-14 text-center shadow-glow">
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-0 h-48 w-[480px] -translate-x-1/2 rounded-full bg-gold/10 blur-[80px]"
          />
          <h2 className="relative text-3xl font-bold tracking-tight md:text-4xl">
            Pronto para organizar suas finanças?
          </h2>
          <p className="relative mx-auto mt-3 max-w-md text-text-secondary">
            Crie sua conta e comece a acompanhar cada movimentação hoje mesmo.
          </p>
          <div className="relative mt-8">
            <Link to="/criar-conta">
              <Button className="h-11 px-6 text-base">
                Criar minha conta
                <ArrowRight size={16} className="ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/60">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 py-6 text-xs text-text-secondary sm:flex-row">
          <div className="flex items-center gap-2">
            <Coins size={14} className="text-gold" />
            <span className="font-semibold text-text-secondary">Aureo</span>
          </div>
          <span>© {new Date().getFullYear()} Aureo. Todos os direitos reservados.</span>
        </div>
      </footer>
    </div>
  );
};
