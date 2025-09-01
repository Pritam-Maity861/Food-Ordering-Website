import React from "react";
import aboutus from "../assets/aboutus.jpg";

const AboutPage = () => {
  return (
    <div className="mt-30 scroll-mt-30 bg-gray-50" id="about">
      <style>{`
            @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
        
            * {
                font-family: 'Poppins', sans-serif;
            }
        `}</style>
      <h1 className="text-3xl font-semibold text-center mx-auto text-gray-700">
        About us
      </h1>
      <p className="text-sm text-slate-500 text-center mt-2 max-w-md mx-auto">
        Welcome to Khaddoroshik – where cravings meet convenience!
      </p>
      <p className="text-sm text-slate-500 text-center mt-2 max-w-[80%] mx-auto">
        We’re more than just a food ordering platform. We're a passionate team
        of food lovers, tech enthusiasts, and customer service champions who
        believe that great meals should be just a few clicks away. Whether
        you’re looking for your favorite comfort food, trying something new, or
        need a quick bite on a busy day, we’re here to make your life tastier
        and easier.
      </p>
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-center gap-8 px-4 md:px-0 py-10">
        <img
          className="max-w-lg w-full rounded-xl h-auto"
          src={aboutus}
          alt=""
        />
        <div>
          <div className="flex flex-col gap-10 mt-6">
            <div className="flex items-center gap-4">
              <div className="text-sm text-slate-500 mt-2">
                <h1 className="text-2xl text-gray-550 pb-4">What We Do</h1>
                <p>
                  At Khaddoroshik, we connect you with a wide variety of
                  restaurants and cuisines in your area. From local gems to
                  well-known favorites, we’ve partnered with the best to ensure
                  your meal is hot, fresh, and delivered right to your door—or
                  ready for pickup, if that’s more your style.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-slate-500 mt-2">
                <h1 className="text-2xl text-gray-550">Our Mission</h1>
                <p className="text-lg">Our mission is simple:</p>
                <h1 className="text-sm">
                  To bring people and food together with speed, reliability, and
                  joy.{" "}
                </h1>
                <p>
                  We aim to provide a seamless, hassle-free food ordering
                  experience that puts your needs first—whether that means
                  filtering by dietary preference, tracking your order in
                  real-time, or getting support when you need it.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
