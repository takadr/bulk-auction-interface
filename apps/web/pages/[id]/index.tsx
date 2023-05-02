import Router, { useRouter } from 'next/router';

import BulksaleV1 from 'ui/components/templates/BulksaleV1';

export default function SalePage() {
    const router = useRouter();
    const { id } = router.query;

    return (
        <BulksaleV1 title={`Contract: ${id}`} />
    )
}