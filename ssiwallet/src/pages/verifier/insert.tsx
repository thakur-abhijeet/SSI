import { errorToast } from "@/lib/toastify";
import UIButton from "@/ui/uibutton";
import UIInput from "@/ui/uiinput";
import UIModal from "@/ui/uimodal";
import { ChangeEvent, useState } from "react";
import axios from "axios";
import { TCredentials } from ".";

interface VerifyCredentialsProps {
  onClose: () => void;
}
export default function VerifyCredentials({ onClose }: VerifyCredentialsProps) {
  const [did, setDID] = useState<string | null>(null);
  const [credential, setCredential] = useState<TCredentials | null>({
    did: "234234w34r234r23re23e23e",
    name: "Narayan Neupane",
    phone: "9805401056",
    dob: "2000/01/01",
    email: "narannpn@gmail.com",
    address: "Kathmandu, Nepal",
    userId: "234234",
    userFullName: "Narayan neupane",
  });

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value?.trim();
    setDID((_) => (value ? value : null));
  };
  const handleSave = async () => {
    if (!did) return errorToast("Document ID is required");

    try {
      const response = await axios.post("/issuer/verify", {
        did,
      });
      setCredential(response.data);
    } catch (error: any) {
      errorToast(error.message);
    }
  };
  return (
    <>
      <UIModal onClose={onClose}>
        <div className="employee-insert">
          <h2 className="employee-insert--heading">Verify Credential</h2>
          <UIInput
            id="did"
            isRequired
            label="Document ID"
            placeholder="eg. Insert Credential.."
            name="did"
            onChange={handleInput}
            defaultValue={did}
          />
          <div className="employee-insert--actions">
            <UIButton
              label="Verify Now"
              type="primary"
              onClick={handleSave}
              style={{ minWidth: "13rem" }}
            />
          </div>
          {credential ? (
            <table width={"100%"}>
              <tr>
                <td>Status</td>
                <td>Verified</td>
              </tr>
              <tr>
                <td>Fullname</td>
                <td>{credential.name}</td>
              </tr>
              <tr>
                <td>Phone</td>
                <td>{credential.phone}</td>
              </tr>
              <tr>
                <td>Date of Birth</td>
                <td>{credential.dob}</td>
              </tr>
              <tr>
                <td>Email</td>
                <td>{credential.email}</td>
              </tr>
              <tr>
                <td>Address</td>
                <td>{credential.address}</td>
              </tr>
            </table>
          ) : (
            <span
              className="noresult"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              No Document Available
            </span>
          )}
        </div>
      </UIModal>
    </>
  );
}
