import React, { useState, useEffect } from 'react';
import { 
  X, 
  Image as ImageIcon, 
  Save, 
  RotateCcw, 
  CheckCircle2, 
  Sparkles, 
  Shield, 
  Globe,
  Lock
} from 'lucide-react';
import { UserProfile } from '../types/auth';
import { 
  BrandingConfig, 
  DEFAULT_BRANDING_CONFIG, 
  getStoredBrandingConfig, 
  saveStoredBrandingConfig 
} from '../utils/brandingStorage';

interface BrandingSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser?: UserProfile | null;
  onConfigChange?: (newConfig: BrandingConfig) => void;
}

export const BrandingSettingsModal: React.FC<BrandingSettingsModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onConfigChange,
}) => {
  const [config, setConfig] = useState<BrandingConfig>(DEFAULT_BRANDING_CONFIG);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const current = getStoredBrandingConfig();
      setConfig(current);
      setSuccessMsg(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  if (currentUser?.role !== 'admin') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full text-center space-y-4 shadow-xl">
          <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-400 mx-auto flex items-center justify-center font-bold">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Akses Dibatasi</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Pengaturan logo dan favicon hanya dapat diubah oleh akun <strong>Administrator / Guru Utama TJKT</strong>.
          </p>
          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    );
  }

  const handleChange = (field: keyof BrandingConfig, value: string) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveStoredBrandingConfig(config);
    if (onConfigChange) {
      onConfigChange(config);
    }
    setSuccessMsg('Pengaturan logo & favicon berhasil disimpan!');
    setTimeout(() => {
      setSuccessMsg(null);
      onClose();
    }, 1200);
  };

  const handleReset = () => {
    if (window.confirm('Kembalikan logo dan favicon ke pengaturan standar?')) {
      setConfig(DEFAULT_BRANDING_CONFIG);
      saveStoredBrandingConfig(DEFAULT_BRANDING_CONFIG);
      if (onConfigChange) {
        onConfigChange(DEFAULT_BRANDING_CONFIG);
      }
      setSuccessMsg('Logo dan favicon berhasil dikembalikan ke standar.');
      setTimeout(() => {
        setSuccessMsg(null);
      }, 1500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-6 my-8">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
                Pengaturan Logo & Favicon Aplikasi
              </h2>
              <p className="text-xs text-slate-500">
                Sesuaikan ikon logo header dan favicon situs instansi Anda
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {successMsg && (
          <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs font-semibold text-emerald-900 dark:text-emerald-200 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              <span>Teks Singkat Logo Header (Maksimal 2-3 Huruf / Emoji)</span>
            </label>
            <input
              type="text"
              required
              maxLength={5}
              value={config.logoText}
              onChange={(e) => handleChange('logoText', e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white font-bold"
              placeholder="Contoh: TK atau 🌐"
            />
            <span className="text-[10px] text-slate-400 block">Huruf atau simbol ini akan tampil di kotak biru logo navigasi header.</span>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-blue-500" />
              <span>URL Gambar Favicon (Ikon Tab Browser / .ico / .png)</span>
            </label>
            <input
              type="url"
              value={config.faviconUrl}
              onChange={(e) => handleChange('faviconUrl', e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
              placeholder="https://contoh.com/favicon.png (Opsional)"
            />
            <span className="text-[10px] text-slate-400 block">Kosongkan untuk menggunakan ikon bawaan. Masukkan URL langsung gambar publik (.png/.ico).</span>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Judul Lengkap Aplikasi (Browser Title)
            </label>
            <input
              type="text"
              required
              value={config.appName}
              onChange={(e) => handleChange('appName', e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
              placeholder="Simulasi TKA SMK TJKT..."
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Sub-teks Header Samping Logo
            </label>
            <input
              type="text"
              required
              value={config.headerBadge}
              onChange={(e) => handleChange('headerBadge', e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
              placeholder="Bank 400 Soal & Pembahasan"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Standar</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl shadow-md transition-colors cursor-pointer flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Perubahan</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
