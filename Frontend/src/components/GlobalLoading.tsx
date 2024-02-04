import './GlobalLoading.css';
import { CSSProperties } from 'react';
import { Spin } from 'antd';

type Props = {
  spinning: boolean,
  fullScreen: boolean,
}

const wrapperStyle: CSSProperties = {
  backgroundColor: '#fff',
  width: '100%',
  position: 'absolute',
  top: 0,
  bottom: 0,
  left: 0,
  zIndex: 100000,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  opacity: 1,
  textAlign: 'center',
};

export const GlobalLoading = ({ spinning, fullScreen }: Props) => {
  const hiddenStyles: CSSProperties = !spinning ? {
    'zIndex': '-1',
    'opacity': '0',
    'transition': 'opacity 1s ease 0.3s, z-index 0.1s ease 1.3s',
  } : {};

  const fullScreenStyles: CSSProperties = fullScreen ? {
    position: 'fixed',
  } : {};

  return (
    <div
      style={{ ...wrapperStyle, ...hiddenStyles, ...fullScreenStyles }}
    >
      <div
        style={{
          width: '100px',
          height: '100px',
          display: 'inline-flex',
          flexDirection: 'column',
          justifyContent: 'space-around',
        }}
      >
        <Spin size="large" />
        <div
          style={{
            'width': '100px',
            'height': '20px',
            'textAlign': 'center',
            'fontSize': '14px',
            'letterSpacing': '3px',
            'color': '#000',
          }}
        >
          LOADING
        </div>
      </div>
    </div>
  );
};