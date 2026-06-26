import { CheckCircle2 } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

const flow = ["placed", "preparing", "on_way", "delivered"];

const OrderStatus = ({ status }) => {
  const { t } = useLanguage();
  const activeIndex = status === "cancelled" ? -1 : flow.indexOf(status);

  if (status === "cancelled") {
    return <div className="status-cancelled">{t("cancelled")}</div>;
  }

  return (
    <div className="status-track">
      {flow.map((step, index) => (
        <div
          className={`status-step ${index <= activeIndex ? "active" : ""}`}
          key={step}
        >
          <span>
            <CheckCircle2 size={16} />
          </span>
          <p>{t(step)}</p>
        </div>
      ))}
    </div>
  );
};

export default OrderStatus;
