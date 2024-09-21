import { Safe } from "../../../types/safe";
import { NoSafeErrorDisplay } from "./components/NoSafeErrorDisplay";
import { useEffect, useState } from 'react';
import { SafeDetectedDisplay } from "./components/SafeDetectedDisplay";
import { CircularProgress } from "@nextui-org/react";
import { DynamicWidget } from "@dynamic-labs/sdk-react-core";

interface SetupDisplayProps {
    safeWallets: Safe[];
    changeDisplay: (page: string) => void;
}

export default function SetupDisplay({ safeWallets, changeDisplay }: SetupDisplayProps) {
    const [loading, setLoading] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // TO TEST
    // [{
    //     chainId: 1,
    //     amountInUSD: 938,
    //     thresholds: 3,
    //     addresses: ["0xZJdhb28dJ", "0xZJdhb28dJ"]
    // }]

    return (
        <div className='flex flex-col gap-2'>
            {loading ? <CircularProgress className='m-auto' color="default" aria-label="Loading..." /> : <>
                <DynamicWidget />
                {safeWallets.length === 0 ? <SafeDetectedDisplay safeWallets={safeWallets} changeDisplay={changeDisplay} /> : <NoSafeErrorDisplay changeDisplay={changeDisplay} />}
            </>
            }
        </div>
    );
}