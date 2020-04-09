import React, { useRef } from "react";
import { useAsync } from "react-async-hook";

import ErrorFallback from "components/ErrorFallback";

import css from "./Image.module.scss";

export interface Props {
  alt: string;
  src: string;
  base64: string;
  ratio: number;
}

const Image: React.FC<Props> = props => {
  return (
    <>
      <Aspect ratio={props.ratio}>
        <Inner {...props} />
      </Aspect>
      <span className={css.caption}>{props.alt}</span>
    </>
  );
};

interface AspectProps {
  children: React.ReactNode;
  ratio: number;
}

const Aspect: React.FC<AspectProps> = props => (
  <div className={css.aspectWrapper}>
    <div
      className={css.aspectInner}
      style={{ marginBottom: `${100 * props.ratio}%` }}
    />
    {props.children}
  </div>
);

const Inner: React.FC<Props> = props => {
  const imageElement = useRef<HTMLImageElement>(null);
  const state = useAsync(() => {
    const img = imageElement.current;
    if (img === null) {
      // Never resolve - this promise will be thrown away anyway as soon as the
      // ref below gets linked and the async function is restarted.
      return new Promise<void>(() => {});
    }

    return img.decode();
  }, [imageElement.current === null]);

  const loading = [
    css.main,
    css.loading,
    state.loading ? css.show : css.hide
  ].join(" ");

  const error = [css.main, css.error, state.error ? css.show : css.hide].join(
    " "
  );

  const main = [
    css.main,
    state.status === "success" ? css.show : css.hide
  ].join(" ");

  return (
    <>
      <div
        style={{ backgroundImage: `url(${props.base64})` }}
        className={loading}
      />
      <div
        style={{ backgroundImage: `url(${props.base64})` }}
        className={error}
      />
      {state.error && <ErrorFallback error={state.error} />}
      <img
        ref={imageElement}
        className={main}
        src={props.src}
        alt={props.alt}
        style={{
          backgroundImage: `url(${props.base64})`
        }}
        loading="lazy"
      />
    </>
  );
};

export default Image;
