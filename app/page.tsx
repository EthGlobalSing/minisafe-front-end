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
import { WelcomeDisplay } from "./components/WelcomeDisplay";
import SetupDisplay from "./components/setup/SetupDisplay";
import WalletDisplay from "./components/WalletDisplay";
import SendDisplay from "./components/SendDisplay";
import AppsDisplay from "./components/apps/AppsDisplay";
import { Safe } from "@/types/safe";

export default function Main() {
  // Dynamic
  const { sdkHasLoaded, user } = useDynamicContext();

  // Telegram
  const { telegramSignIn } = useTelegramLogin();

  // Data
  const [username, setUsername] = useState<string>();

  // App management
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState('welcome');

  // Front-end
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function changeDisplay(page: string) {
    setCurrentPage(page);
    setIsMenuOpen(false);
  }

  // MOCKUP
  const [safeWallets, setSafeWallets] = useState<Safe[]>([
    {
      chainId: 1,
      amountInUSD: 938,
      thresholds: 3,
      addresses: [
        "0xAbc1234Ef5678Gh9012Ij3456Kl7890MnOpQr456",
        "0xDeF4567Gh8910Ij1234Kl5678Mn9012OpQr3456"
      ]
    },
    {
      chainId: 56,
      amountInUSD: 5000,
      thresholds: 2,
      addresses: [
        "0xF1234Gh5678Ij9012Kl3456Mn7890OpQrs789012",
        "0xZ9876Ab54321Cd0987Ef6543Gh0987Ij54321Kl0"
      ]
    },
    {
      chainId: 137,
      amountInUSD: 1500,
      thresholds: 2,
      addresses: [
        "0x1234Ef5678Gh9012IjKl3456Mn7890OpQr5678Ij",
        "0xIjKl7890Mn1234OpQr5678AbCd9012EfGh3456Mn"
      ]
    },
    {
      chainId: 43114,
      amountInUSD: 3200,
      thresholds: 4,
      addresses: [
        "0xAb5678Gh9012Ij3456Kl7890Mn1234OpQr5678Ij",
        "0xCd9012EfGh3456Mn7890OpQr5678Ab1234Ef5678",
        "0x5678Ij9012KlMn1234Op3456Qr5678EfGh7890Ab",
        "0xMn3456OpQr5678EfGh9012IjKl1234Ab5678Mn12"
      ]
    }
  ]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const page = urlParams.get('page');
    const amountInUSD = urlParams.get('amountInUSD');
    const toUsername = urlParams.get('toUsername');
    const fromChain = urlParams.get('fromChain');

    if (page) {
      setCurrentPage(page);
    }

    // if (WebApp.BiometricManager.isBiometricAvailable) {
    //   WebApp.BiometricManager.requestAccess({ reason: 'Allow Telegram to access your MiniSafe' }, () => {
    //   });

    //   WebApp.BiometricManager.authenticate({ reason: 'Allow Telegram to access your MiniSafe' }, () => {
    //     setIsBiometricUserConnected(true);
    //   });
    // }

    if (WebApp.initDataUnsafe.user) {
      setUsername(WebApp.initDataUnsafe.user.username);
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
      {currentPage.toLowerCase() !== 'send' && <NavBar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} windowName={currentPage.charAt(0).toUpperCase() + currentPage.slice(1)} changeDisplay={changeDisplay} currentPage={currentPage} />}
      <main className={`flex min-h-screen items-center justify-center py-4 ${currentPage.toLowerCase() === 'send' || currentPage.toLowerCase() === 'apps' ? 'bg-lightGreen' : 'bg-darkGreen'}`}>
        {isLoading ? <CircularProgress color='default' /> :
          currentPage.toLowerCase() === 'welcome' ?
            <WelcomeDisplay title={username ? `Hey ${username} 👋, welcome to MiniSafe.` : `Welcome to MiniSafe.`} changeDisplay={changeDisplay} />
            :
            currentPage.toLowerCase() === 'setup' ?
              <SetupDisplay safeWallets={safeWallets} changeDisplay={changeDisplay} />
              :
              currentPage.toLowerCase() === 'wallet' ?
                <WalletDisplay safeWallets={safeWallets} />
                :
                currentPage.toLowerCase() === 'send' ?
                  <SendDisplay toAddress={""} amount={Number(amountInUSD)} fromChain={0} />
                  :
                  currentPage.toLowerCase() === 'apps' ?
                    <AppsDisplay />
                    :
                    <>
                      <DynamicWidget />
                    </>}
      </main>
    </NextUIProvider >
  );
}
