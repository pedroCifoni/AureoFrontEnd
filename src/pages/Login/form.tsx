import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Coins } from 'lucide-react';
import {authService} from '@/services/authService';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { toast } from 'sonner';
import { getErrorMessage } from '@/utils/errors';

export const CreateAccountPage = () => {

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  
  const [showSenha, setShowSenha] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setError(null);
    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const validacao =
      nome.length < 3 || nome.length > 100 ? 'Nome deve ter de 3 a 100 caracteres.'
      : !emailValido || email.length > 150 ? 'E-mail inválido.'
      : senha.length < 8 || senha.length > 128 ? 'Senha deve ter de 8 a 128 caracteres.'
      : null;
    if (validacao) {
      setError(validacao);
      toast.error(validacao);
      return;
    }
    setIsLoading(true);
    try {
      await authService.register({ nome, email, senha });
      
      toast.success('Conta criada! Faça login para continuar.');
      navigate('/login', { replace: true });
    } catch (err: any) {
      console.error(err);
      const errorMessage = getErrorMessage(err, 'Erro ao criar conta. Verifique os dados e tente novamente.');
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base flex items-center justify-center p-4">
      <div className="w-full max-w-sm flex flex-col gap-8">
        {/* Logo */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-10 h-10 rounded-card bg-gold/10 border border-gold/20 flex items-center justify-center">
            <Coins size={20} className="text-gold" />
          </div>
          <span className="text-xl font-bold tracking-tight text-text-primary">Aureo</span>
        </div>

        {/* Card do formulário */}
        <Card className="flex flex-col gap-5">
          <div>
            <h1 className="text-xl font-semibold text-text-primary">Criar nova conta</h1>
            <p className="text-sm text-text-secondary mt-1">Preencha os dados abaixo para se cadastrar.</p>
          </div>

          {/* Exibição de Erro */}
          {error && (
            <div className="bg-danger/10 border border-danger/20 rounded-button px-3 py-2">
              <p className="text-xs text-danger">{error}</p>
            </div>
          )}

          {/* Inputs */}
          <div className="flex flex-col gap-4">
            <Input
              label="Nome de usuário"
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Seu nome"
            />

            <Input
              label="E-mail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
            />

            <Input
              label="Senha"
              type={showSenha ? 'text' : 'password'}
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="••••••••"
              icon={
                <button type="button" onClick={() => setShowSenha((v) => !v)}>
                  {showSenha ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              }
            />
          </div>

          {/* Submit */}
          <Button
            onClick={handleSubmit}
            disabled={isLoading || !nome || !email || !senha}
            isLoading={isLoading}
            className="w-full mt-2"
          >
            Cadastrar
          </Button>

          {/* Link para Voltar ao Login */}
          <div className="text-center mt-2">
            <span className="text-xs text-text-muted">Já tem uma conta? </span>
            <button 
              onClick={() => navigate('/login')}
              className="text-xs text-gold hover:text-gold-muted transition-colors font-medium bg-transparent border-none p-0 cursor-pointer"
            >
              Fazer login
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};