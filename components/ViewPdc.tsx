/* eslint-disable react/no-unescaped-entities */
import React, { useEffect, useState } from "react";
import { useMoralisQuery } from "react-moralis";
import { useAddress } from "@thirdweb-dev/react";
import { formattedDate, convertDate } from "../utils/web3";

const ViewPdc = () => {
  const address = useAddress();
  const [UpcomingPdcList, setUpcomingPdcList] = useState([]);
  const [ExpiredPdcList, setExpiredPdcList] = useState([]);

  const moralisTableName = process.env.NEXT_PUBLIC_MORALIS_TABLE_NAME || "";
  const { fetch } = useMoralisQuery(
    moralisTableName,
    (query) => query.equalTo("owner", address?.toLowerCase()),
    [],
    {
      autoFetch: false,
    }
  );
  const fetchFromDB = async () => {
    try {
      const results = await fetch();
      if (results) {
        console.log("pdc-list:  ", JSON.parse(JSON.stringify(results)));
        const data = JSON.parse(JSON.stringify(results));
        if (data && data.length > 0) {
          const expiredPdc = data.filter(
            (item: any) => parseInt(item.date) * 1000 < Date.now()
          );
          const upcomingPdc = data.filter(
            (item: any) => parseInt(item.date) * 1000 > Date.now()
          );
          setExpiredPdcList(expiredPdc);
          setUpcomingPdcList(upcomingPdc);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchFromDB();
  }, [address]);
  return (
    <div className="w-5/6 fixed h-screen overflow-y-scroll md:p-10 mt-10 flex flex-col items-center">
      <div className="w-full">
        <p className="text-2xl font-bold text-center">Created PDC's</p>
        <div className="mt-5 w-full border-2 border-gray-200 rounded-xl">
          <div className="overflow-x-scroll w-full h-[40vh]">
            <table className="overflow-x-scroll table table-zebra table-compact w-full">
              <thead>
                <tr>
                  <th>CREATED DATE</th>
                  <th>RECEIVER</th>
                  <th>TOKEN</th>
                  <th className="text-right">AMOUNT</th>
                  <th className="text-right">PAYMENT DATETIME</th>
                </tr>
              </thead>

              {UpcomingPdcList.length == 0 && (
                <tbody className="pt-10 w-full relative">
                  <div className="flex absolute items-center justify-center w-full pt-20">
                    <p className="font-bold text-xl text-center w-full">
                      No Pdc Found!
                    </p>
                  </div>
                </tbody>
              )}
              {UpcomingPdcList.length > 0 && (
                <tbody>
                  {UpcomingPdcList.map((item: any, index) => (
                    <tr key={index}>
                      <th>{convertDate(item.createdAt)} </th>
                      <td>{item.receiver}</td>
                      <td>{item.token}</td>
                      <th className="text-right">
                        {(item.amount / 10 ** 18).toLocaleString()}
                      </th>
                      <th className="text-right">
                        {formattedDate(item.date)}{" "}
                      </th>
                    </tr>
                  ))}
                </tbody>
              )}
            </table>
          </div>
        </div>
      </div>
      <div className="w-full">
        <p className="text-2xl font-bold text-center">Expired PDC's</p>
        <div className="mt-5 w-full border-2 border-gray-200 rounded-xl">
          <div className="overflow-x-scroll w-full h-[40vh]">
            <table className="overflow-x-scroll table table-zebra table-compact w-full">
              <thead>
                <tr>
                  <th>CREATED DATE</th>
                  <th>RECEIVER</th>
                  <th>TOKEN</th>
                  <th className="text-right">AMOUNT</th>
                  <th className="text-right">PAYMENT DATETIME</th>
                </tr>
              </thead>
              {ExpiredPdcList.length == 0 && (
                <tbody className="pt-10 w-full relative">
                  <div className="flex absolute items-center justify-center w-full pt-20">
                    <p className="font-bold text-xl text-center w-full">
                      No Pdc Found!
                    </p>
                  </div>
                </tbody>
              )}

              {ExpiredPdcList.length > 0 && (
                <tbody>
                  {ExpiredPdcList.map((item: any, index) => (
                    <tr key={index}>
                      <th>{convertDate(item.createdAt)} </th>
                      <td>{item.receiver}</td>
                      <td>{item.token}</td>
                      <th className="text-right">
                        {(item.amount / 10 ** 18).toLocaleString()}
                      </th>
                      <th className="text-right">
                        {formattedDate(item.date)}{" "}
                      </th>
                    </tr>
                  ))}
                </tbody>
              )}
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewPdc;
