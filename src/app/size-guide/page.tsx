import React from "react";

export const metadata = {
  title: "Size Guide | Aura Apparel",
  description: "Accurate garment measurements for Kids, Teens, and Adults apparel."
};

export default function SizeGuidePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 text-xs sm:text-sm">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-black font-heading text-slate-900 uppercase">Garment Sizing Guide</h1>
        <p className="text-xs text-slate-500">Measure your chest and length to find your tailored fit</p>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs space-y-8">
        <div>
          <h2 className="text-base font-bold font-heading text-slate-900 mb-3">Kids & Toddler Garments</h2>
          <table className="w-full border-collapse border border-slate-200 text-center text-xs">
            <thead className="bg-slate-100 text-slate-900 font-bold">
              <tr>
                <th className="border border-slate-200 p-2.5">Size</th>
                <th className="border border-slate-200 p-2.5">Chest (Inches)</th>
                <th className="border border-slate-200 p-2.5">Length (Inches)</th>
                <th className="border border-slate-200 p-2.5">Recommended Age</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              <tr><td className="p-2 font-bold">Month 6-18</td><td className="p-2">20 - 22"</td><td className="p-2">14"</td><td className="p-2">Infant</td></tr>
              <tr><td className="p-2 font-bold">Year 2-3</td><td className="p-2">24"</td><td className="p-2">16"</td><td className="p-2">Toddler</td></tr>
              <tr><td className="p-2 font-bold">Year 4-5</td><td className="p-2">26"</td><td className="p-2">18"</td><td className="p-2">Young Kids</td></tr>
              <tr><td className="p-2 font-bold">Year 6-7</td><td className="p-2">28"</td><td className="p-2">20"</td><td className="p-2">School Kids</td></tr>
              <tr><td className="p-2 font-bold">Year 8-9</td><td className="p-2">30"</td><td className="p-2">22"</td><td className="p-2">Junior</td></tr>
            </tbody>
          </table>
        </div>

        <div>
          <h2 className="text-base font-bold font-heading text-slate-900 mb-3">Adults Unisex T-Shirts (Boxy Fit)</h2>
          <table className="w-full border-collapse border border-slate-200 text-center text-xs">
            <thead className="bg-slate-100 text-slate-900 font-bold">
              <tr>
                <th className="border border-slate-200 p-2.5">Size</th>
                <th className="border border-slate-200 p-2.5">Chest (Inches)</th>
                <th className="border border-slate-200 p-2.5">Length (Inches)</th>
                <th className="border border-slate-200 p-2.5">Shoulder Drop</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              <tr><td className="p-2 font-bold">S</td><td className="p-2">38"</td><td className="p-2">27"</td><td className="p-2">18.5"</td></tr>
              <tr><td className="p-2 font-bold">M</td><td className="p-2">40"</td><td className="p-2">28"</td><td className="p-2">19.5"</td></tr>
              <tr><td className="p-2 font-bold">L</td><td className="p-2">42"</td><td className="p-2">29"</td><td className="p-2">20.5"</td></tr>
              <tr><td className="p-2 font-bold">XL</td><td className="p-2">44"</td><td className="p-2">30"</td><td className="p-2">21.5"</td></tr>
              <tr><td className="p-2 font-bold">XXL</td><td className="p-2">46"</td><td className="p-2">31"</td><td className="p-2">22.5"</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
