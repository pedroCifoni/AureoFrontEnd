import { Card } from '@/components/ui/Card';

export const MetasPage = () => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-text-primary">Metas</h1>
      </div>

      <Card className="py-8 text-center text-sm text-text-muted">
        Nenhuma meta disponível.
      </Card>
    </div>
  );
};
