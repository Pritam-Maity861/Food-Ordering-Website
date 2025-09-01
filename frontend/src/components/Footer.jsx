import React from 'react'

const Footer = () => {
  return (
    <div className="bg-gray-800  ">
       <footer className="px-6 md:px-16 lg:px-24 xl:px-32 pt-8 w-full text-gray-300">
            <div className="flex flex-col md:flex-row justify-between w-full gap-10 border-b border-gray-500/30 pb-6">
                <div className="md:max-w-96">
                    <h1 className="text-2xl font-semibold text-gray-100">Khaddoroshik</h1>
                    <p className="mt-6 text-sm">
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                        Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
                        when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                    </p>
                </div>
                <div className="flex-1 flex items-start md:justify-end gap-20">
                    <div>
                        <h2 className="font-semibold mb-5 text-gray-800">Company</h2>
                        <ul className="text-sm space-y-2">
                            <li><a href="#">Home</a></li>
                            <li><a href="#">Restaurants</a></li>
                            <li><a href="#">Our Food</a></li>
                            <li><a href="#">aboutus</a></li>
                            <li><a href="#">contact</a></li>
                        </ul>
                    </div>
                    <div>
                        <h2 className="font-semibold mb-5 text-gray-800">Get in touch</h2>
                        <div className="text-sm space-y-2">
                            <p>+91 8159028218</p>
                            <p>maitypritam861@gmail.com</p>
                        </div>
                    </div>
                </div>
            </div>
            <p className="pt-4 text-center text-xs md:text-sm pb-5">
                Copyright 2025 © <a href="https://prebuiltui.com">Khaddoroshik</a>. All Right Reserved.
            </p>
        </footer>
    </div>
  )
}

export default Footer
