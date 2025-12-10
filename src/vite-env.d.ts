/// <reference types="vite/client" />

declare namespace JSX {
    interface IntrinsicElements {
        'model-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
            src?: string;
            alt?: string;
            poster?: string;
            loading?: 'auto' | 'lazy' | 'eager';
            reveal?: 'auto' | 'interaction' | 'manual';
            'camera-controls'?: boolean;
            'auto-rotate'?: boolean;
            'rotation-per-second'?: string;
            ar?: boolean;
            'ar-modes'?: string;
            'environment-image'?: string;
            exposure?: string;
            'shadow-intensity'?: string;
            'shadow-softness'?: string;
        }, HTMLElement>;
    }
}
