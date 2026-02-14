import { useEffect, useState } from "react";
import Loading from "./Loading";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const Credits = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const { axios, token } = useAppContext();

  const fetchPlans = async () => {
    try {
      const { data } = await axios.get("/api/credit/plan", {
        headers: { Authorization: token },
      });
      if (data.success) {
        setPlans(data.plans);
      } else {
        toast.error(data.message || "Failed to fetch payment plans");
      }
    } catch (error) {
      toast.error(error.message);
    }
    setLoading(false);
  };

  const purchasePlan = async (planId) => {
    try {
      const { data } = await axios.post(
        "/api/credit/purchase",
        { planId },
        { headers: { Authorization: token } },
      );

      if (data.success) {
        window.location.href = data.url;
        toast.success("purchases");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  if (loading) return <Loading />;
  return (
    <div className="max-w-7xl h-screen overflow-y-auto mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-3xl font-semibold text-center mb-10 xl:mt-10 dark:text-white not-dark:invert ">
        Upgrade your plan
      </h2>

      <div className="flex flex-wrap justify-center gap-8 ">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`border border-purple-300 dark:border-b-cyan-500 rounded-lg shadow hover:shadow-lg 
      transition-shadow p-6 h-[420px] w-[320px]  flex flex-col ${
        plan.popular
          ? "bg-transparent dark:text-primary"
          : "dark:bg-indigo-600/35 bg-indigo-400 text-white "
      }`}
          >
            <h3 className="text-xl font-semibold mb-2 text-center">
              {plan.name}
            </h3>
            <p
              className={`text-sm dark:text-purple-400 mb-4 ${
                plan.popular ? "text-gray-400" : "text-gray-300 "
              }`}
            >
              {plan.description}
            </p>
            <p className="text-2xl font-bold mb-4">
              ${plan.price}/mo - {plan.credits} credits
            </p>
            <ul className="space-y-2 mb-6">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="text-sm">
                  {" "}
                  {feature}{" "}
                </li>
              ))}
            </ul>
            <button
              onClick={() =>
                toast.promise(purchasePlan(plan.id), {
                  loading: "Processing payment...",
                })
              }
              className="mt-auto w-full bg-[#5445c5] 
             hover:bg-[#8024dd]  text-amber-50 
             font-semibold py-2.5 cursor-pointer px-4 rounded-lg shadow-sm transition-all"
            >
              Choose {plan.name}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Credits;
