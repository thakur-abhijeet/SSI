import UITable, { UITableHeader } from "@/components/table";
import UIButton from "@/ui/uibutton";
import { TCredentials, TUser } from ".";
import UISelect from "@/ui/uiselect";

type CredentialsTable = TCredentials & { user: string };
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
  {
    name: "user",
    display: "Assign User",
  },
];

interface CertificateTableProps {
  handleInsert: () => void;
  handleUser: (id: string, did: string) => void;
  data: TCredentials[];
  users: TUser[];
}
export default function CertificateTable({
  handleInsert,
  handleUser,
  data,
  users,
}: CertificateTableProps) {
  return (
    <UITable<CredentialsTable>
      overflow="visible"
      customActions={
        <UIButton
          label={
            <span>
              <i className="fa-regular fa-plus"></i> Create
            </span>
          }
          type="primary"
          style={{ minWidth: "10rem" }}
          onClick={handleInsert}
        />
      }
      headings={columns}
      rawData={data.map((item, index) => {
        return {
          did: {
            value: item.did,
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
          user: {
            value: "",
            display: item.userId ? (
              item.userFullName
            ) : (
              <UISelect
                placeholder="Select any user"
                style={{ width: "30rem" }}
                options={users.map((i) => ({
                  value: i.id,
                  displayValue: i.name + `(${i.phone})`,
                }))}
                showSearch
                onChange={(e) => handleUser(e.target.value, item.did)}
              />
            ),
          },
        };
      })}
    />
  );
}
