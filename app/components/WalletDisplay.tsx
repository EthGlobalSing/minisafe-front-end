'use client';

import { Safe } from "../../types/safe";
import Image from "next/image";
import { dmSerifText } from "../shared/fonts";

interface WalletDisplayProps {
    safeWallets: Safe[];
    // changeDisplay: (page: string) => void;
}

export default function WalletDisplay({ safeWallets }: WalletDisplayProps) {
    return (
        <div className='p-10 min-h-screen flex flex-col gap-12 items-center'>
            <div className="flex flex-col gap-6">
                <h1 className={`${dmSerifText.className} text-lightGreen text-3xl`}>$839.29</h1>
            </div>
            <div className="w-full">
                {safeWallets.map((safe, index) => (
                    <div key={index} className="w-full p-6 bg-lightGreen rounded-xl flex gap-4 items-center justify-between">
                        <div className="flex gap-4 items-center">
                            <Image src={'/chains/ethereum.svg'} alt="Ethereum" width={20} height={20} />
                            <p className="text-xl text-darkGreen">Ethereum</p>
                        </div>
                        <p className={`text-lg text-darkGreen ${dmSerifText.className}`}>$38.38</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
