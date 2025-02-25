import UITable, { UITableHeader } from "@/components/table";
import { TCredentials, TUser } from ".";
import { copyToClipboard } from "@/utils/helpers";

type CredentialsTable = TCredentials;
const columns: UITableHeader<CredentialsTable>[] = [
  {
    name: "did",
    display: "Document ID",
  },
  {
    name: "name",
    display: "Fullname",
  },
  {
    name: "phone",
    display: "Phone",
  },
  {
    name: "dob",
    display: "Date of Birth",
  },
  {
    name: "email",
    display: "Email",
  },
  {
    name: "address",
    display: "Address",
  },
];

interface CertificateTableProps {
  data: TCredentials[];
}
export default function CertificateTable({ data }: CertificateTableProps) {
  return (
    <UITable<CredentialsTable>
      overflow="visible"
      headings={columns}
      rawData={data.map((item, index) => {
        return {
          did: {
            value: item.did,
            display: (
              <>
                <strong>{item.did}</strong>{" "}
                <span
                  onClick={() => copyToClipboard(item.did)}
                  className="table-content--label"
                >
                  <i className="fa-regular fa-copy"></i>
                </span>
              </>
            ),
          },
          name: {
            value: item.name,
          },
          address: {
            value: item.address,
          },
          phone: {
            value: item.phone,
          },
          dob: {
            value: item.dob,
          },
          email: {
            value: item.email,
          },
        };
      })}
    />
  );
}
