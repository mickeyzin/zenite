// Substituto de next/image: <img> com caminho relativo.
type Props = React.ImgHTMLAttributes<HTMLImageElement> & { priority?: boolean };
export default function Image({ priority, src, alt, ...rest }: Props) {
  void priority;
  return <img src={String(src).replace(/^\//, "")} alt={alt} {...rest} />;
}
