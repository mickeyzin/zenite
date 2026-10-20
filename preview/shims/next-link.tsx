// Substituto de next/link na prévia estática: mapeia as rotas para as páginas .html.
type Props = React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

export function previewHref(href: string) {
  if (href === "/") return "index.html";
  if (href.startsWith("/catalogo")) return "catalogo.html" + (href.includes("?") ? "#" + href.split("?")[1] : "");
  if (href.startsWith("/comparar")) return "comparar.html" + (href.includes("?") ? "#" + href.split("?")[1] : "");
  if (href.startsWith("/perfumes/")) return "resenha.html#" + href.slice("/perfumes/".length);
  if (href.startsWith("/laboratorio")) return "lab.html";
  return href;
}

export default function Link({ href, children, ...rest }: Props) {
  return (
    <a href={previewHref(href)} {...rest}>
      {children}
    </a>
  );
}
