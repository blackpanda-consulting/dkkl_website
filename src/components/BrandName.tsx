import { site } from "@/lib/content";

// The wordmark, coloured to match the approved logo: "Dinesh Kiran" in brand
// teal, "काशी लाभ" in brand orange. Sampled from public/logos/final_logo.png —
// the Devanagari reads ~#c86820, which is the palette's --caramel.
export default function BrandName({ className = "" }: { className?: string }) {
  return (
    <span className={`brand-name ${className}`}>
      <span className="text-teal">{site.nameLatin}</span>{" "}
      <span className="text-caramel">{site.nameDevanagari}</span>
    </span>
  );
}
