import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in React lifecycle:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    this.setState({ hasError: false, error: null });
    window.location.hash = '';
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#050505] text-[#E5E5E5] flex flex-col items-center justify-center p-4 sm:p-6 selection:bg-indigo-500 selection:text-white font-sans text-left">
          <div className="max-w-md w-full bg-[#0A0A0A] border border-red-500/30 rounded-xl p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center gap-3 text-red-400">
              <div className="p-2.5 bg-red-950/50 border border-red-500/40 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <span className="text-[10px] font-mono-tech uppercase tracking-widest text-red-400 block font-bold">
                  ERRO DE RENDERIZAÇÃO
                </span>
                <h1 className="font-display font-bold text-lg text-white">
                  Ocorreu um erro inesperado
                </h1>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
              O aplicativo encontrou uma falha na renderização deste módulo. Você pode tentar recarregar a interface ou voltar ao portfólio.
            </p>

            {this.state.error && (
              <div className="p-3 bg-black/60 border border-white/10 rounded font-mono-tech text-[11px] text-gray-400 break-words max-h-32 overflow-y-auto">
                <span className="text-red-400 font-bold block mb-1">Detalhe técnico:</span>
                {this.state.error.message}
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                onClick={this.handleReload}
                className="w-full sm:w-1/2 py-3 px-4 bg-white hover:bg-gray-200 text-black font-bold text-xs font-mono-tech uppercase tracking-wider rounded flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Recarregar</span>
              </button>
              <button
                onClick={this.handleGoHome}
                className="w-full sm:w-1/2 py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-mono-tech text-xs uppercase tracking-wider rounded flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Início</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
