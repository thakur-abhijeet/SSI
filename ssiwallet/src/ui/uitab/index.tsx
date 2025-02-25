import { ReactNode } from "react";

export type UITabOption = {
  name: string;
  action: CallableFunction;
  active?: boolean;
};
interface UITabProps {
  actions?: ReactNode;
  items: UITabOption[];
}
export default function UITab({ actions, items }: UITabProps) {
  return (
    <div className="uitab">
      <div className="uitab-items">
        {items.map((item, index) => (
          <div
            className={`uitab-items--item${item.active ? " active" : ""}`}
            onClick={() => item.action()}
            key={index}
          >
            {item.name}
          </div>
        ))}
      </div>
      <div className="uitab-actions">{actions}</div>
    </div>
  );
}
