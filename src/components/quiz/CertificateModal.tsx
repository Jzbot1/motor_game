'use client';

import React, { useEffect, useRef } from 'react';
import { X, Award, CheckCircle, Printer, Download, Share2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CertificateModalProps {
  studentName: string;
  score: number;
  totalQuestions: number;
  passingScore: number;
  dateStr: string;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  studentName,
  score,
  totalQuestions,
  passingScore,
  dateStr,
  onClose,
}) => {
  const percentage = Math.round((score / totalQuestions) * 100);
  const isPassed = score >= passingScore;
  const certificateRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isPassed) {
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FF9933', '#FFFFFF', '#138808', '#38BDF8'],
      });
    }
  }, [isPassed]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto bg-slate-950 rounded-3xl border border-slate-700 p-4 sm:p-6 md:p-8 flex flex-col gap-4 sm:gap-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-5 sm:right-5 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Certificate Printable Canvas */}
        <div
          ref={certificateRef}
          className="relative bg-gradient-to-b from-amber-50/95 to-amber-100/90 text-slate-900 rounded-2xl p-4 sm:p-8 border-4 sm:border-8 border-double border-amber-600/70 shadow-2xl overflow-hidden flex flex-col items-center text-center"
        >
          {/* Subtle Ashok Chakra / Watermark seal */}
          <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
            <svg viewBox="0 0 100 100" className="w-96 h-96">
              <circle cx="50" cy="50" r="45" fill="none" stroke="#000080" strokeWidth="2" />
              {Array.from({ length: 24 }).map((_, i) => (
                <line
                  key={i}
                  x1="50"
                  y1="50"
                  x2={50 + 45 * Math.cos((i * 2 * Math.PI) / 24)}
                  y2={50 + 45 * Math.sin((i * 2 * Math.PI) / 24)}
                  stroke="#000080"
                  strokeWidth="1"
                />
              ))}
            </svg>
          </div>

          {/* Tri-color Accent Bar */}
          <div className="w-full h-2 flex rounded-full overflow-hidden mb-4 shadow-sm">
            <div className="flex-1 bg-[#FF9933]" />
            <div className="flex-1 bg-[#FFFFFF]" />
            <div className="flex-1 bg-[#138808]" />
          </div>

          <div className="flex items-center gap-2 mb-1">
            <Award className="w-7 h-7 text-amber-700" />
            <span className="text-xs uppercase tracking-widest font-extrabold text-amber-800">
              ROADREADY INDIA • RTO ROAD SAFETY INITIATIVE
            </span>
          </div>

          <h2 className="text-2xl md:text-3xl font-black text-slate-950 font-serif tracking-tight mt-1">
            CERTIFICATE OF ROAD SIGN MASTERY
          </h2>
          <p className="text-xs text-slate-600 font-medium max-w-md mt-1">
            Official Indian Road Signs (IRC:67-2022) & Traffic Regulations Learner Examination
          </p>

          <div className="my-6">
            <p className="text-xs uppercase tracking-wider text-slate-500 font-bold">This certifies that</p>
            <h3 className="text-2xl md:text-3xl font-black text-amber-900 font-serif underline decoration-amber-600/50 underline-offset-8 mt-1">
              {studentName || 'Learner Driver'}
            </h3>
            <p className="text-xs text-slate-700 mt-4 max-w-lg leading-relaxed">
              has successfully cleared the <strong>Indian Road Transport & Signs Examination</strong> based on the standards of the <strong>Indian Roads Congress (IRC)</strong> and <strong>Ministry of Road Transport and Highways (MoRTH)</strong>.
            </p>
          </div>

          {/* Score & Verification Footer */}
          <div className="w-full flex items-center justify-between border-t border-b border-amber-900/20 py-3 my-2 text-xs">
            <div className="text-left">
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Score Achieved:</span>
              <strong className="text-emerald-800 font-black text-sm">
                {score} / {totalQuestions} ({percentage}%)
              </strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Result Status:</span>
              <strong className="text-emerald-700 font-black text-sm uppercase">PASSED ✓</strong>
            </div>
            <div className="text-right">
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Date of Issue:</span>
              <strong className="text-slate-800 font-semibold">{dateStr}</strong>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between w-full mt-4 text-[10px] text-slate-600 font-mono gap-2 border-t border-amber-900/10 pt-2">
            <span>CERT-ID: RTO-IND-{Math.floor(100000 + Math.random() * 900000)}</span>
            <span>OFFICIAL COMPLIANCE: MoRTH & MOTOR VEHICLES ACT</span>
            <span>VERIFIED: IRC:67 / IRC:35</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition-all shadow-lg shadow-amber-500/20 active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span>Print Certificate</span>
          </button>
        </div>
      </div>
    </div>
  );
};
