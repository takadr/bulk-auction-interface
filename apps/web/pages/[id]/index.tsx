import Router, { useRouter } from 'next/router';
import { useAccount } from 'wagmi';

import BulksaleV1 from 'ui/components/templates/BulksaleV1/index';

export default function SalePage() {
    const { address, isConnected, connector } = useAccount();
    const router = useRouter();
    const { id } = router.query;

    // TODO Get template address from contractAddress
    // Switch template by using template address
    return (
        <BulksaleV1
            title={`Contract: ${id}`}
            contractAddress={id as `0x${string}`}
            address={address}
        />
    )
}