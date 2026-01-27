/**
 * NΞØ Smart Factory — ErrorBoundary Component
 * 
 * React Error Boundary para capturar erros de renderização e exibir fallback UI
 * 
 * @see https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary
 */

import { Component } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });

    // Log to console
    console.error('[ErrorBoundary]', error, errorInfo);

    // Log to Sentry if available
    if (typeof window !== 'undefined' && window.Sentry) {
      window.Sentry.captureException(error, {
        contexts: {
          react: {
            componentStack: errorInfo.componentStack
          }
        },
        tags: {
          component: this.props.componentName || 'Unknown',
          level: this.props.level || 'error'
        },
        extra: {
          errorInfo,
          props: this.props
        }
      });
    }

    // Call custom error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return typeof this.props.fallback === 'function'
          ? this.props.fallback(this.state.error, this.handleReset)
          : this.props.fallback;
      }

      // Default fallback UI
      return (
        <div className="error-boundary glass-card border-red-500/20 bg-black/60 p-6 rounded-lg">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <h3 className="text-sm font-bold uppercase tracking-widest text-red-400">
              {this.props.title || 'Algo deu errado'}
            </h3>
          </div>

          <p className="text-xs text-slate-400 mb-4 leading-relaxed">
            {this.props.message || 'Ocorreu um erro inesperado. Por favor, tente novamente.'}
          </p>

          {this.props.showDetails && this.state.error && (
            <details className="mb-4">
              <summary className="text-xs text-slate-500 cursor-pointer mb-2 hover:text-slate-400">
                Detalhes técnicos
              </summary>
              <pre className="text-[10px] text-slate-500 bg-black/40 p-3 rounded overflow-auto max-h-40 font-mono">
                {this.state.error.toString()}
                {this.state.errorInfo?.componentStack && (
                  <>
                    {'\n\nComponent Stack:\n'}
                    {this.state.errorInfo.componentStack}
                  </>
                )}
              </pre>
            </details>
          )}

          <div className="flex gap-2 flex-wrap">
            <button
              onClick={this.handleReset}
              className="px-4 py-2 bg-neon-acid text-black text-xs font-bold rounded hover:opacity-90 transition-opacity flex items-center gap-2"
            >
              <RefreshCw className="w-3 h-3" />
              Tentar Novamente
            </button>

            {this.props.showReload && (
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-slate-700 text-white text-xs font-bold rounded hover:opacity-90 transition-opacity"
              >
                Recarregar Página
              </button>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
