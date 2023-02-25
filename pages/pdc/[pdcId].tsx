import { useAddress, useNetworkMismatch } from "@thirdweb-dev/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { NftDetails, Footer } from "../../components";

const PdcDetail = () => {
  const [pdcId, setPdcId] = useState<any>();
  const router = useRouter();

  useEffect(() => {
    const { pdcId } = router.query;
    if (pdcId) {
      setPdcId(pdcId);
    }
  }, [router]);
  return <>
      <div>{pdcId && <NftDetails pdcId={pdcId} />}</div>
      <Footer />
    </>;
};

export default PdcDetail;
