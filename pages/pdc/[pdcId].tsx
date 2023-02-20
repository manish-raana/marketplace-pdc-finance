import { useAddress, useNetworkMismatch } from "@thirdweb-dev/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { NftDetails } from "../../components";

const PdcDetail = () => {
  const [pdcId, setPdcId] = useState<any>();
  const router = useRouter();

  useEffect(() => {
    const { pdcId } = router.query;
    if (pdcId) {
      setPdcId(pdcId);
    }
  }, [router]);
  return <div>{pdcId && <NftDetails pdcId={pdcId} />}</div>;
};

export default PdcDetail;
