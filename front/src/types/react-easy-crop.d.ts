declare module 'react-easy-crop' {
  import type { ComponentType } from 'react';

  export type Area = {
    x: number;
    y: number;
    width: number;
    height: number;
  };

  const Cropper: ComponentType<any>;

  export default Cropper;
}