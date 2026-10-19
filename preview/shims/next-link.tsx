// Substituto de next/link: a prévia tem só a home; a resenha abre como página separada.
type Props = React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };
export default function Link({ href, children, ...rest }: Props) {
  const local = href.startsWith("/perfumes/") ? "resenha.html" : href === "/" ? "#" : href;
  return (
    <a href={local} {...rest}>
      {children}
    </a>
  );
}
