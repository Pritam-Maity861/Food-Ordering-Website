import React from "react";
import { GrCertificate } from "react-icons/gr";
import { CiDeliveryTruck } from "react-icons/ci";
import freshfood from "../assets/fresh-food.svg";

const Feature = () => {
  return (
    <div className="w-full px-4 sm:px-6 md:px-10 lg:px-20 xl:px-32 mt-20">
      {/* Glowing Background Blur */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 rounded-full blur-[300px] -z-10 bg-[#FBFFE1]/70 w-full h-[400px]"></div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 justify-items-center">
        {/* Feature 1 */}
        <div className="flex flex-col items-center text-center max-w-xs w-full">
          <div className="p-6 sm:p-8 bg-violet-100 rounded-full">
            <GrCertificate className="w-10 h-10 sm:w-12 sm:h-12 text-violet-600" />
          </div>
          <div className="mt-4 space-y-2">
            <h3 className="text-base sm:text-lg font-semibold text-slate-700">
              ✅ Certified & Trusted
            </h3>
            <p className="text-sm sm:text-base text-slate-600">
              We meet the highest food safety standards—your health is our priority.
            </p>
          </div>
        </div>

        {/* Feature 2 */}
        <div className="flex flex-col items-center text-center max-w-xs w-full">
          <div className="p-6 sm:p-8 bg-green-100 rounded-full">
            <CiDeliveryTruck className="w-10 h-10 sm:w-12 sm:h-12 text-green-600" />
          </div>
          <div className="mt-4 space-y-2">
            <h3 className="text-base sm:text-lg font-semibold text-slate-700">
              🚀 Fastest Delivery
            </h3>
            <p className="text-sm sm:text-base text-slate-600">
              Get your food at lightning speed, always fresh and on time.
            </p>
          </div>
        </div>

        {/* Feature 3 */}
        <div className="flex flex-col items-center text-center max-w-xs w-full">
          <div className="p-6 sm:p-8 bg-orange-100 rounded-full">
            <img src={freshfood} alt="Fresh Food" className="w-10 h-10 sm:w-12 sm:h-12" />
          </div>
          <div className="mt-4 space-y-2">
            <h3 className="text-base sm:text-lg font-semibold text-slate-700">
              🍽️ Quality Food
            </h3>
            <p className="text-sm sm:text-base text-slate-600">
              Only the best ingredients, prepared with care by top chefs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feature;
