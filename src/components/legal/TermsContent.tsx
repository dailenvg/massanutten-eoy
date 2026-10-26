import { TERMS_BLOCKS, TERMS_TITLE, type TermsBlock } from "@/lib/terms";

// CLIENT-APPROVED legal copy lives in lib/terms.ts (shared with the confirmation email).
function TermsBlockView({ block }: { block: TermsBlock }) {
  if (block.kind === "spacer") return <p><br /></p>;
  if (block.kind === "heading") return <h2><strong>{block.text}</strong></h2>;
  return <p>{block.strong ? <strong>{block.text}</strong> : block.text}</p>;
}

export default function TermsContent() {
  return (
    <main className="legal-main">
      <h1>{TERMS_TITLE}</h1>
      {TERMS_BLOCKS.map((block, i) => (
        <TermsBlockView key={i} block={block} />
      ))}
    </main>
  );
}
