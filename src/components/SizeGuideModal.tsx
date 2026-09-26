import React, { useState } from 'react';
import { useCart } from '../context/CartContext';

export const SizeGuideModal: React.FC = () => {
  const { isSizeGuideOpen, setIsSizeGuideOpen } = useCart();
  const [userHeightCm, setUserHeightCm] = useState(165);

  if (!isSizeGuideOpen) return null;

  const calculateRecommendedSize = (cm: number) => {
    if (cm <= 158) return { size: '52', height: '5\'1" – 5\'2"', hemLength: '52 in (132 cm)' };
    if (cm <= 163) return { size: '54', height: '5\'3" – 5\'4"', hemLength: '54 in (137 cm)' };
    if (cm <= 168) return { size: '56', height: '5\'5" – 5\'6"', hemLength: '56 in (142 cm)' };
    if (cm <= 173) return { size: '58', height: '5\'7" – 5\'8"', hemLength: '58 in (147 cm)' };
    return { size: '60', height: '5\'9"+', hemLength: '60 in (152 cm)' };
  };

  const rec = calculateRecommendedSize(userHeightCm);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#171411]/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#fdf9f3] w-full max-w-2xl rounded-2xl shadow-2xl border border-[#e6e2dc] overflow-hidden relative">
        
        {/* Header */}
        <div className="bg-white p-5 border-b border-[#e6e2dc] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#5c6149]">straighten</span>
            <h3 className="font-serif text-lg font-semibold text-[#171411]">
              Atelier Abaya Size & Height Measurements
            </h3>
          </div>
          <button
            onClick={() => setIsSizeGuideOpen(false)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#7e756f] hover:text-[#171411] hover:bg-[#f1ede7] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 flex flex-col gap-6">
          <p className="text-xs text-[#7e756f] leading-relaxed">
            Standard abaya sizing is defined by full vertical length from the top of the shoulder to the floor hem. Because modest silhouettes feature generous relaxed fits around the bust and hips, you should select your size based primarily on your height.
          </p>

          {/* Interactive Calculator */}
          <div className="bg-white p-4 rounded-xl border border-[#e6e2dc] flex flex-col gap-3">
            <span className="text-xs font-semibold text-[#171411] uppercase tracking-wider">
              Interactive Size Finder
            </span>
            <div className="flex items-center justify-between text-xs">
              <label className="text-[#7e756f]">Your Height (with typical footwear):</label>
              <span className="font-bold text-[#171411] text-sm">{userHeightCm} cm</span>
            </div>
            <input
              type="range"
              min={150}
              max={185}
              value={userHeightCm}
              onChange={(e) => setUserHeightCm(Number(e.target.value))}
              className="w-full accent-[#5c6149] cursor-pointer"
            />
            <div className="p-3 bg-[#dee3c4]/50 rounded-lg flex items-center justify-between text-xs">
              <span className="text-[#191d0a] font-medium">Recommended Abaya Size:</span>
              <span className="font-bold text-[#191d0a] text-sm">
                Size {rec.size} ({rec.hemLength})
              </span>
            </div>
          </div>

          {/* Sizing Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#f1ede7] text-[#171411] font-semibold">
                  <th className="p-2.5 rounded-l-lg">Abaya Size</th>
                  <th className="p-2.5">Recommended Height</th>
                  <th className="p-2.5">Garment Length</th>
                  <th className="p-2.5">Bust (Free Fit)</th>
                  <th className="p-2.5 rounded-r-lg">Sleeve Length</th>
                </tr>
              </thead>
              <tbody className="text-[#4d4540] divide-y divide-[#f1ede7]">
                <tr className="hover:bg-white transition-colors">
                  <td className="p-2.5 font-bold text-[#171411]">52</td>
                  <td className="p-2.5">5'1" – 5'2" (155–158 cm)</td>
                  <td className="p-2.5">52 in (132 cm)</td>
                  <td className="p-2.5">44 in</td>
                  <td className="p-2.5">27 in</td>
                </tr>
                <tr className="hover:bg-white transition-colors">
                  <td className="p-2.5 font-bold text-[#171411]">54</td>
                  <td className="p-2.5">5'3" – 5'4" (160–163 cm)</td>
                  <td className="p-2.5">54 in (137 cm)</td>
                  <td className="p-2.5">46 in</td>
                  <td className="p-2.5">27.5 in</td>
                </tr>
                <tr className="bg-[#dee3c4]/30 hover:bg-[#dee3c4]/50 transition-colors font-medium">
                  <td className="p-2.5 font-bold text-[#5c6149]">56 (Standard)</td>
                  <td className="p-2.5 text-[#5c6149]">5'5" – 5'6" (165–168 cm)</td>
                  <td className="p-2.5 text-[#5c6149]">56 in (142 cm)</td>
                  <td className="p-2.5 text-[#5c6149]">48 in</td>
                  <td className="p-2.5 text-[#5c6149]">28 in</td>
                </tr>
                <tr className="hover:bg-white transition-colors">
                  <td className="p-2.5 font-bold text-[#171411]">58</td>
                  <td className="p-2.5">5'7" – 5'8" (170–173 cm)</td>
                  <td className="p-2.5">58 in (147 cm)</td>
                  <td className="p-2.5">50 in</td>
                  <td className="p-2.5">28.5 in</td>
                </tr>
                <tr className="hover:bg-white transition-colors">
                  <td className="p-2.5 font-bold text-[#171411]">60</td>
                  <td className="p-2.5">5'9"+ (175+ cm)</td>
                  <td className="p-2.5">60 in (152 cm)</td>
                  <td className="p-2.5">52 in</td>
                  <td className="p-2.5">29 in</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="p-3 bg-white rounded-xl border border-[#e6e2dc] flex items-center justify-between text-xs">
            <span className="text-[#7e756f]">Need custom sleeve length or bridal fit?</span>
            <a
              href="https://wa.me/?text=Hello%20Husna%20Collection%20Tailor%2C%20I%20would%20like%20a%20custom%20abaya%20sizing%20consultation."
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#5c6149] font-bold underline flex items-center gap-1"
            >
              <span>Chat with Atelier Tailor</span>
              <span className="material-symbols-outlined text-sm">open_in_new</span>
            </a>
          </div>

        </div>

      </div>
    </div>
  );
};
