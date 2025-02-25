import NavBar from "@/components/nav";
import Head from "next/head";
import { useEffect, useState } from "react";
import { LOGO } from "@/constants/images";
import axios from "axios";
import InsertCredentials from "./insert";
import CertificateTable from "./data";
import { errorToast } from "@/lib/toastify";

const demoUser: TUser[] = [
  { id: "234234", phone: "9805401056", name: "Narayan neupane" },
  { id: "wq3e4534", phone: "9812345678", name: "Aarjan Xetri" },
];
const demoDocument: TCredentials[] = [
  {
    did: "234234w34r234r23re23e23e",
    name: "Narayan Neupane",
    phone: "9805401056",
    dob: "2000/01/01",
    email: "narannpn@gmail.com",
    address: "Kathmandu, Nepal",
    userId: "234234",
    userFullName: "Narayan neupane",
  },
];

export type TCredentials = {
  did: string;
  name: string;
  phone: string;
  dob: string;
  email: string;
  address: string;
  userId?: string;
  userFullName?: string;
};
export type TUser = {
  id: string;
  phone: string;
  name: string;
};
export default function Credentials() {
  const [documents, setDocuments] = useState<TCredentials[]>(demoDocument);

  return (
    <>
      <Head>
        <title>Credentials</title>
        <meta name="description" content="Content Management System" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href={LOGO.src} />
      </Head>
      <main>
        <div className="framecontainer">
          <div className="framecontainer-content">
            <div className="employee">
              <NavBar name="Holder (Credentials)" showBars />

              <CertificateTable data={documents} />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
