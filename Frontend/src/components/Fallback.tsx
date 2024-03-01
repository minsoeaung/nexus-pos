import {useEffect} from 'react';
import NProgress from 'nprogress';
import './Fallback.css';

export const Fallback = () => {
  useEffect(() => {
    NProgress.configure({
      showSpinner: false,
    });

    NProgress.start();

    return () => {
      NProgress.done();
    };
  }, []);

  return '';
};