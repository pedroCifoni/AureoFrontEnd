import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Coins } from 'lucide-react';
import {authService} from '@/services/authService';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { toast } from 'sonner';
import { getErrorMessage } from '@/utils/errors';

export const LoginPage = () => {
  const [nome, setNome] = useState('');
  const [senha, setSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setError(null);
    setIsLoading(true);
    try {
      await authService.login({ nome, senha });
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      console.error(err);
      const status = err.response?.status;
      let errorMsg: string;
      if (status === 401) errorMsg = 'Usuário ou senha inválidos.';
      else if (status === 429) {
        errorMsg = 'Muitas tentativas, tente novamente em 1 minuto.';
        setBlocked(true);
        setTimeout(() => setBlocked(false), 60000);
      } else errorMsg = getErrorMessage(err, 'Login ou senha inválidos.');
      setError(errorMsg);
      toast.error(errorMsg);
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
            <h1 className="text-xl font-semibold text-text-primary">Bem-vindo de volta</h1>
            <p className="text-sm text-text-secondary mt-1">Acesse sua conta para continuar.</p>
          </div>

         
          {error && (
            <div className="bg-danger/10 border border-danger/20 rounded-button px-3 py-2">
              <p className="text-xs text-danger">{error}</p>
            </div>
          )}

          
          <div
            className="flex flex-col gap-4"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && nome && senha && !isLoading && !blocked) handleSubmit();
            }}
          >
            <Input
              label="Login"
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="seu.login"
            />

            <Input
              label="Senha"
              type={showPassword ? 'text' : 'password'}
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="••••••••"
              icon={
                <button type="button" onClick={() => setShowPassword((v) => !v)}>
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              }
            />
          </div>

          
          <Button
            onClick={handleSubmit}
            disabled={isLoading || blocked || !nome || !senha}
            isLoading={isLoading}
            className="w-full mt-2"
          >
            Entrar
          </Button>


          <div className="text-center mt-2">
            <span className="text-xs text-text-muted">Não tem conta? </span>
            <Link to="/criar-conta" className="text-xs text-gold hover:text-gold-muted transition-colors font-medium">
              Criar conta
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};
