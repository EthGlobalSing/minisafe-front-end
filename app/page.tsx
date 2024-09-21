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

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const page = urlParams.get('page');

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
      {currentPage.toLowerCase() !== 'send' && <NavBar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} windowName={currentPage.charAt(0).toUpperCase() + currentPage.slice(1)} changeDisplay={changeDisplay} />}
      <main className={`flex min-h-screen items-center justify-center py-4 ${currentPage.toLowerCase() === 'send' ? 'bg-lightGreen' : 'bg-darkGreen'}`}>
        {isLoading ? <CircularProgress color='default' /> :
          currentPage.toLowerCase() === 'welcome' ?
            <WelcomeDisplay title={username ? `Hey ${username} 👋, welcome to MiniSafe.` : `Welcome to MiniSafe.`} changeDisplay={changeDisplay} />
            :
            currentPage.toLowerCase() === 'setup' ?
              <SetupDisplay safeWallets={[]} changeDisplay={changeDisplay} />
              :
              currentPage.toLowerCase() === 'wallet' ?
                <WalletDisplay safeWallets={[]} />
                :
                currentPage.toLowerCase() === 'send' ?
                  <SendDisplay />
                  :
                  <>
                    <DynamicWidget />
                  </>}
      </main>
    </NextUIProvider >
  );
}
