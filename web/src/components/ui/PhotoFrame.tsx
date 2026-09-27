import { FrameImage } from "./FrameImage";

type Props = {
  src: string;
  caption?: string;
  tilt?: number;
  className?: string;
};

/** Polaroid from the photo-frame sheet — paper, tape, handwriting. */
export function PhotoFrame({ src, caption, tilt = -4, className = "" }: Props) {
  return (
    <figure
      className={`qd-polaroid ${className}`.trim()}
      style={{ ["--tilt" as string]: `${tilt}deg` }}
    >
      <span className="qd-polaroid__tape" aria-hidden />
      <FrameImage src={src} alt="" sizes="240px" className="qd-polaroid__img" />
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}
