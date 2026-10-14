import React from 'react';
import { X, Laptop, CheckCircle2, Terminal, Download, Sparkles } from 'lucide-react';

interface DesktopAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DesktopAppModal: React.FC<DesktopAppModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-800 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
        
        <div className="px-6 py-4.5 bg-zinc-950 border-b border-zinc-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500 text-zinc-950 font-black flex items-center justify-center shrink-0 shadow-md shadow-orange-500/20">
              <Laptop className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black uppercase tracking-tight text-white font-['Outfit',sans-serif]">
                Como rodar como Aplicativo (.exe / Desktop)
              </h3>
              <p className="text-xs text-zinc-400 font-medium">
                Opções para usar direto na área de trabalho do Windows
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-1.5 rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-xs sm:text-sm text-zinc-300 max-h-[75vh] overflow-y-auto">
          
          {/* Option 1: PWA (Recommended - Instant) */}
          <div className="p-4 rounded-xl bg-zinc-950 border border-orange-500/30">
            <div className="flex items-center gap-2 font-black text-white text-sm uppercase tracking-tight mb-2 font-['Outfit',sans-serif]">
              <CheckCircle2 className="w-4 h-4 text-orange-400 shrink-0" />
              <span>Opção 1: Instalar como Aplicativo Nativo no Windows (Mais fácil!)</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed font-medium">
              No navegador Google Chrome ou Microsoft Edge:
            </p>
            <ol className="list-decimal list-inside text-xs text-zinc-300 mt-2.5 space-y-1.5 font-medium">
              <li>Clique nos <strong>três pontinhos (⋮)</strong> no canto superior direito do navegador.</li>
              <li>Vá em <strong>"Transmitir, salvar e compartilhar"</strong> &gt; <strong>"Instalar página como app"</strong> (ou "Criar Atalho").</li>
              <li>Marque <strong>"Abrir como janela"</strong>.</li>
              <li>Pronto! Ele terá seu próprio ícone na Área de Trabalho e Barra de Tarefas do Windows como um programa independente.</li>
            </ol>
          </div>

          {/* Option 2: Build native .exe with Nativefier or Electron */}
          <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800">
            <div className="flex items-center gap-2 font-black text-white text-sm uppercase tracking-tight mb-2 font-['Outfit',sans-serif]">
              <Terminal className="w-4 h-4 text-orange-400 shrink-0" />
              <span>Opção 2: Gerar arquivo executável real (.exe) via Electron / Nativefier</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed font-medium">
              Se desejar empacotar em um executável <code className="px-1.5 py-0.5 bg-zinc-800 text-orange-400 rounded-md font-mono text-[11px] font-bold">.exe</code> distribuível:
            </p>
            <div className="bg-black text-orange-400 p-3 rounded-lg font-mono text-[11px] mt-2 overflow-x-auto select-all border border-zinc-800">
              npx nativefier --name "ControleDeJanta" --tray --icon icon.png "URL_DO_APP"
            </div>
            <p className="text-[11px] text-zinc-500 mt-2 font-medium">
              Isso cria uma pasta com o arquivo <code className="font-bold text-zinc-300">ControleDeJanta.exe</code> pronto para executar.
            </p>
          </div>

          {/* Option 3: Export data */}
          <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between gap-3">
            <div className="text-xs">
              <strong className="block text-white uppercase tracking-wider text-[11px] font-black">Seus dados ficam salvos localmente</strong>
              <span className="text-zinc-400 text-[11px] font-medium">
                Todos os pedidos e orçamentos ficam armazenados no seu navegador e você pode exportar para Excel / CSV a qualquer momento.
              </span>
            </div>
            <Download className="w-5 h-5 text-orange-400 shrink-0" />
          </div>

        </div>

        <div className="p-4 bg-zinc-950 border-t border-zinc-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-orange-500 hover:bg-orange-400 text-zinc-950 rounded-xl text-xs font-black uppercase tracking-wider transition-colors cursor-pointer"
          >
            Entendi
          </button>
        </div>

      </div>
    </div>
  );
};
