import React, { useContext } from 'react';
import herologo from '../assets/hero-logo.png'; 
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/authContext';


const HeroSection = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useContext(AuthContext);
  return (
    <div
      className="h-full w-full bg-cover scroll-mt-25 bg-center bg-no-repeat  bg-green-100 text-white"
      id='home'
    >
      <div className="bg-transparent  py-12">
        <div className="flex flex-col-reverse  md:flex-row gap-30 px-4 md:px-16 lg:px-24 xl:px-32 ">
          {/* Text Content */}
          <div className="max-md:text-center">
            <h5 className="text-4xl md:text-6xl/[76px] font-semibold max-w-xl bg-gradient-to-r from-slate-900 to-[#6D8FE4] text-transparent bg-clip-text">
              Craving Something Delicious? We’ve Got You.
            </h5>

            <p className="text-sm md:text-base max-w-lg mt-6 max-md:px-2 text-slate-600">
              Get your favorite meals from top-rated restaurants delivered hot and fresh — fast, easy, and just a tap away.
            </p>

            <div className="flex items-center gap-4 mt-6 justify-center md:justify-start">
              <button
              onClick={isLoggedIn?() => navigate("/Cart"):() => navigate("/login")}
               className="px-8 py-3 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white active:scale-95 transition-all">
                🍔 Order Now
              </button>
              <button className="px-5 py-3 rounded-md bg-white text-indigo-600 border border-indigo-400 flex items-center gap-2 hover:bg-indigo-600/5 active:scale-95 transition-all"
              onClick={isLoggedIn?() => navigate("/allRestaurents"):()=>navigate("/login")}
              >
                <span>🔍 Browse Restaurants</span>
              </button>
            </div>

            <div className="flex items-center mt-9 justify-center md:justify-start">
              <div className="flex -space-x-3.5 pr-3"></div>
              <div>
                <div className="flex items-center gap-px">
                  {Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <svg
                        key={i}
                        width="13"
                        height="12"
                        viewBox="0 0 13 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M5.85536 0.463527C6.00504 0.00287118 6.65674 0.00287028 6.80642 0.463526L7.82681 3.60397C7.89375 3.80998 8.08572 3.94946 8.30234 3.94946H11.6044C12.0888 3.94946 12.2901 4.56926 11.8983 4.85397L9.22687 6.79486C9.05162 6.92219 8.97829 7.14787 9.04523 7.35388L10.0656 10.4943C10.2153 10.955 9.68806 11.338 9.2962 11.0533L6.62478 9.11244C6.44954 8.98512 6.21224 8.98512 6.037 9.11244L3.36558 11.0533C2.97372 11.338 2.44648 10.955 2.59616 10.4943L3.61655 7.35388C3.68349 7.14787 3.61016 6.92219 3.43491 6.79486L0.763497 4.85397C0.37164 4.56927 0.573027 3.94946 1.05739 3.94946H4.35944C4.57606 3.94946 4.76803 3.80998 4.83497 3.60397L5.85536 0.463527Z"
                          fill="#FF8F20"
                        />
                      </svg>
                    ))}
                </div>
                <p className="text-sm text-slate-500">Used by 1,000+ people</p>
              </div>
            </div>
          </div>

          <div className="w-full md:max-w-xs  lg:max-w-lg">
            <img
              className="w-full h-full object-cover rounded-lg "
              src={herologo} 
              alt=""
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
