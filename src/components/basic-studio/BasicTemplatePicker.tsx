"use client";

import { Check, Heart, Leaf } from "lucide-react";
import { BASIC_TEMPLATES, type BasicTemplateCode } from "@/lib/basic-invitation";

export default function BasicTemplatePicker({ selected, onSelect }: {
  selected: BasicTemplateCode;
  onSelect: (template: BasicTemplateCode) => void;
}) {
  return <div className="mt-6 grid gap-4 sm:grid-cols-2">
    {BASIC_TEMPLATES.map((template) => <button
      key={template.code}
      type="button"
      aria-pressed={selected === template.code}
      onClick={() => onSelect(template.code)}
      className={`overflow-hidden rounded-xl border bg-white text-left ${selected === template.code ? "border-[#947a4b] ring-1 ring-[#947a4b]" : "border-[#e8e0d3]"}`}
    >
      <div aria-hidden="true" className="flex h-44 items-center justify-center bg-[#f3efe6] px-6 py-4">
        {template.code === "arch" ? <div className="flex h-full w-28 flex-col items-center justify-center rounded-t-full border border-[#b8923f] bg-[#fffdf8] text-[#7a1f2b] outline outline-1 outline-offset-[-5px] outline-[#d6c49b]">
          <Heart className="mb-2 rounded-full border border-[#b8923f] p-1" size={25} strokeWidth={1} />
          <span className="font-serif-luxury text-2xl">A <i>&amp;</i> B</span><span className="mt-2 text-[6px] tracking-widest">OUR WEDDING DAY</span>
        </div> : template.code === "maison" ? <div className="h-full w-36 bg-[#fffdf8] p-3 text-[#7a1f2b] shadow-sm">
          <p className="border-b border-[#e6dcc8] pb-2 text-[5px] tracking-widest">A &amp; B / THE WEDDING</p>
          <div className="mt-3 grid grid-cols-2 items-center gap-2"><p className="font-serif-luxury text-2xl leading-none">A<br /><i className="text-base">&amp;</i><br />B</p><div className="flex h-20 items-center justify-center rounded-tr-[35px] bg-[#e9e0d3]"><Heart size={16} strokeWidth={1} /></div></div>
          <div className="mt-3 border border-[#e6dcc8] bg-[#faf6ee] p-1 text-center text-[5px] tracking-widest">ONE DAY. A LIFETIME OF US.</div>
        </div> : template.code === "botanical" ? <div className="relative flex h-full w-32 flex-col items-center justify-center border border-[#c7ba8b] bg-[#243c30] p-3 text-[#fffdf5] outline outline-1 outline-offset-[-5px] outline-[#e5dfbf40]">
          <Leaf size={18} strokeWidth={1} className="text-[#d6c797]" />
          <p className="mt-2 text-center font-serif-luxury text-2xl leading-none">A <i className="text-[#d6c797]">&amp;</i> B</p>
          <p className="mt-2 text-center text-[5px] tracking-widest">THE BEGINNING OF FOREVER</p>
          <div className="absolute -bottom-2 left-3 right-3 border border-[#e6dcc8] bg-[#fffdf8] py-2 text-center font-serif-luxury text-[10px] text-[#3f6a4b]">Love brought us here.</div>
        </div> : <div className="h-full w-32 bg-[#fffdf8] p-3 text-[#393b31] shadow-sm">
          <p className="text-center text-[5px] tracking-widest">A WEDDING CELEBRATION</p>
          <p className="mt-2 text-center font-serif-luxury text-lg leading-none">A lifetime to <i className="text-[#7a1f2b]">cherish.</i></p>
          <div className="mt-3 flex h-16 items-center justify-center bg-[#e7e2d6]"><Heart size={20} strokeWidth={1} className="text-[#a08a62]" /></div>
          <p className="mt-2 text-center text-[6px] tracking-widest">A &amp; B / THE NEXT CHAPTER</p>
        </div>}
      </div>
      <div className="p-4"><span className="flex items-center justify-between gap-2 text-xs font-semibold">{template.name}{selected === template.code && <Check size={15} className="shrink-0 text-[#947a4b]" />}</span><p className="mt-2 text-[11px] leading-5 text-[#807969]">{template.description}</p></div>
    </button>)}
  </div>;
}
