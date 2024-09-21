"use client";

import { useEffect, useState } from "react";
import {
  DynamicWidget,
  useTelegramLogin,
  useDynamicContext,
} from "../lib/dynamic";

import { Button, CircularProgress, Input, NextUIProvider } from "@nextui-org/react";

export default function Main() {
  const { sdkHasLoaded, user } = useDynamicContext();
  const { telegramSignIn } = useTelegramLogin();
  const { primaryWallet } = useDynamicContext();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [result, setResult] = useState<string>();


  async function signMessage(fromAddress: string, toAddress: string, fromChain: number, toChain: number, amountInWei: number) {
    if (!primaryWallet) return;

    let signature;

    try {
      signature = await primaryWallet.signMessage(`${fromAddress}-${toAddress}-${fromChain}-${toChain}-${amountInWei}`);
    } catch (err) {
      setResult('Error creating the signature.');
    }

    setResult(signature);
  }

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
            {result && <p>{result}</p>}
          </>}
      </main>
    </NextUIProvider>
  );
}
