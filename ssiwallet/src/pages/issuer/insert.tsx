import { errorToast, successToast } from "@/lib/toastify";
import UIButton from "@/ui/uibutton";
import UIInput from "@/ui/uiinput";
import UIModal from "@/ui/uimodal";
import { constructInputDate } from "@/utils/helpers";
import {
  ChangeEvent,
  EventHandler,
  useCallback,
  useEffect,
  useState,
} from "react";
import axios from "axios";
import { TCredentials } from ".";

interface CredentialsInsertProps {
  onClose: () => void;
}
export default function InsertCredentials({ onClose }: CredentialsInsertProps) {
  const [showWarning, setShowWarning] = useState<boolean>(false);
  const [state, setState] = useState<Partial<Omit<TCredentials, "did">>>({});

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value?.trim();
    setState((prev) => ({ ...prev, [e.target.name]: value }));
  };
  const handleSave = async () => {
    if (
      !state.address ||
      !state.dob ||
      !state.email ||
      !state.name ||
      !state.phone
    )
      return errorToast("Fields are required");
    try {
      await axios.post("/issuer/add", state);
      successToast("Credentials Created");
    } catch (error: any) {
      errorToast(error.message);
    }
  };
  return (
    <>
      <UIModal onClose={onClose}>
        <div className="employee-insert">
          <h2 className="employee-insert--heading">Insert Credentials</h2>
          <UIInput
            id="name"
            isRequired
            label="Fullname"
            placeholder="eg. Aarjan.."
            name="name"
            onChange={handleInput}
            defaultValue={state.name}
          />
          <UIInput
            id="phone"
            isRequired
            label="Phone"
            placeholder="eg. 98XXXXXXXX"
            name="phone"
            defaultValue={state.phone}
          />
          <UIInput
            id="dob"
            isRequired
            type="date"
            label="Date of Birth"
            name="dob"
            defaultValue={state.dob && constructInputDate(new Date(state.dob))}
          />
          <UIInput
            id="address"
            isRequired
            label="Address"
            placeholder="eg. Kathmandu.."
            name="address"
            defaultValue={state.address}
          />
          <UIInput
            id="email"
            isRequired
            label="Email"
            placeholder="eg. xy@example.com"
            name="email"
            defaultValue={state.email}
          />

          <div className="employee-insert--actions">
            <UIButton
              label="Save"
              type="primary"
              onClick={handleSave}
              style={{ minWidth: "13rem" }}
            />
          </div>
        </div>
      </UIModal>
    </>
  );
}
