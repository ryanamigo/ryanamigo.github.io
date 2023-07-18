import React from 'react';

interface VisibleControllProps {
  children?: React.ReactNode;
  visible?: boolean;
  fallback?: React.ReactNode;
}
const VisibleControll: React.FC<VisibleControllProps> = (props) => {
  const { children, visible = true, fallback } = props;

  if(visible) {
    return <>{children}</>
  }
  if (fallback) {
    return <>{fallback}</>
  }
  return null;
}

export default VisibleControll;
