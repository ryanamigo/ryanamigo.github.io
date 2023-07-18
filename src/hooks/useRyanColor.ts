/* eslint-disable react-hooks/exhaustive-deps */
import { useColorMode } from "@chakra-ui/react";
import { useEffect, useState } from "react";

export type RyanColorMode = 'light' | 'dark' | 'system';


function getCurrentSystemColorMode() {
  if (window.matchMedia('(prefers-color-scheme)').media === 'not all') {
    return 'light';
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function useRyanColor() {
  const { colorMode, setColorMode} = useColorMode();
  const [swticherValue, setSwitcherValue] = useState<RyanColorMode>('system');

  useEffect(() => {
    const currentSystemMode = getCurrentSystemColorMode();
    const savedMode = localStorage.getItem('colorMode') as RyanColorMode | null;
    if (!savedMode || savedMode === 'system') {
      setColorMode(currentSystemMode);
      setSwitcherValue(currentSystemMode);
      return;
    } else {
      setColorMode(savedMode);
      setSwitcherValue(currentSystemMode);
    }
  }, [])

  const toggleAndSaveColorMode = (cm: RyanColorMode) => {
    setSwitcherValue(cm);
    localStorage.setItem('colorMode', cm);
    if (cm === 'system') {
      const currentSystemMode = getCurrentSystemColorMode();
      setColorMode(currentSystemMode);
    } else {
      setColorMode(cm);
    }
  }

  return {
    colorMode, toggleColorMode: toggleAndSaveColorMode, swticherValue
  }
}

export default useRyanColor;