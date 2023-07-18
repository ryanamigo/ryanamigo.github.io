/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import Header from './Header';
import Footer from './Footer'
import BackToTop from '@/components/BackToTop';
import TopLoading, { useTopLoading } from '@/components/TopLoading';
import { useRouter } from 'next/router';

interface GlobalLayoutProps {
  children: React.ReactNode;
}

// const breakpoints = {
//   sm: '30em', // 480px
//   md: '48em', // 768px
//   lg: '62em', // 992px
//   xl: '80em', // 1280px
//   '2xl': '96em', // 1536px
// }

const GlobalLayout: React.FC<GlobalLayoutProps> = (props) => {
  const router = useRouter();
  const topLoading = useTopLoading();
  const handleRouteChangeStart = () => {
    topLoading.start();
  }
  const handleRouteChangeComplete = () => {
    topLoading.end();
  }
  useEffect(() => {
    topLoading.end();
    // 监听路由切换事件
    router.events.on('routeChangeComplete', handleRouteChangeComplete);
    router.events.on('routeChangeStart', handleRouteChangeStart);
    router.events.on('beforeHistoryChange', handleRouteChangeStart);

    // 清除事件监听器
    return () => {
      router.events.off('routeChangeComplete', handleRouteChangeComplete);
      router.events.off('routeChangeStart', handleRouteChangeStart);
      router.events.off('beforeHistoryChange', handleRouteChangeStart);
    };
  }, []);
  return (
    <>
      <TopLoading />
      <Header />
      {props.children}
      <Footer />
      <BackToTop />
    </>
  )
}

export default GlobalLayout;
