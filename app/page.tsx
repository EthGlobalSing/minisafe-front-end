"use client";

import { useEffect, useState } from "react";

import {
  DynamicWidget,
  useTelegramLogin,
  useDynamicContext,
} from "../lib/dynamic";
import WebApp from '@twa-dev/sdk'

import { Button, CircularProgress, NextUIProvider } from "@nextui-org/react";
import { NavBar } from "./components/ui/NavBar";

export default function Main() {
  // Dynamic
  const { sdkHasLoaded, user } = useDynamicContext();
  const { primaryWallet } = useDynamicContext();

  // Telegram
  const { telegramSignIn } = useTelegramLogin();

  // Data
  const [username, setUsername] = useState<string | null>(null);

  // App management
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState('welcome');

  // Front-end
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  async function signMessage(fromAddress: string, toAddress: string, fromChain: number, toChain: number, amountInWei: number) {
    if (!primaryWallet) return;

    let signature;

    try {
      signature = await primaryWallet.signMessage(`${fromAddress}-${toAddress}-${fromChain}-${toChain}-${amountInWei}`);
    } catch (err) {
      // TODO Set error handling
    }

    // TODO Do something with the signature
  }

  function changeDisplay(page: string) {
    setCurrentPage(page);
  }

  useEffect(() => {
    // if (WebApp.BiometricManager.isBiometricAvailable) {
    //   WebApp.BiometricManager.requestAccess({ reason: 'Allow Telegram to access your MiniSafe' }, () => {
    //   });

    //   WebApp.BiometricManager.authenticate({ reason: 'Allow Telegram to access your MiniSafe' }, () => {
    //     setIsBiometricUserConnected(true);
    //   });
    // }

    if (WebApp.initDataUnsafe.user) {
      setUsername(WebApp.initDataUnsafe.user);
      setIsMenuOpen(false);
    }
  }, [])

  useEffect(() => {
    if (!sdkHasLoaded) return;

    const signIn = async () => {
      if (!user) {
        await telegramSignIn({ forceCreateUser: true });
      }
      setIsLoading(false);
    };

    signIn();
  }, [sdkHasLoaded]);

  return (
    <NextUIProvider>
      <NavBar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} windowName="MiniSafe" />
      <main className="flex min-h-screen items-center justify-center py-4">
        {isLoading ? <CircularProgress color='default' /> :
          <>
            <DynamicWidget />
            <Button
              className='bg-darkGreen text-lightGreen font-bold w-full'
              onClick={() => {
                //WebApp.HapticFeedback.impactOccurred('heavy');
                signMessage('0x1', '0x2', 1, 2, 1000);
              }}>Send</Button>
          </>}
      </main>
    </NextUIProvider>
  );
}
