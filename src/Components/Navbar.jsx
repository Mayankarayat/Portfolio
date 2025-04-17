import React from 'react'
import { RxHamburgerMenu } from "react-icons/rx";
import { RxCross2 } from "react-icons/rx";
import { motion } from 'framer-motion';
import logo from "../assets/logo-Photoroom.png"


const Navbar = () => {

    const [side, setside] = React.useState(false);

    return (
        <>
            {/* <div className='bg-[url(https://img.freepik.com/free-vector/modern-desktop-background-geometric-blue-design-vector_53876-135923.jpg?t=st=1744435369~exp=1744438969~hmac=536561ad4fa5dadcfb73233339c5bbb3041789150545ea9325314455382b07bf&w=996)] w-full h-[100vh] z-[1] bg-cover'> */}

            <motion.div
                initial={{
                    y: -20,
                    opacity: 0
                }}
                whileInView={{
                    y: 0,
                    opacity: 1,
                }}
                transition={{
                    duration: .5,
                    delay: .3,
                    type: 'spring'
                }}


                className=' w-full sm:w-[90%] m-auto py-4 sm:py-4 mb-4 sm:my-4 px-5 sm:rounded-full flex justify-between z-[10] bg-[#9083ed]'>
                <motion.div

                    initial={{
                        x: -50,
                        opacity: 0
                    }}

                    whileInView={{
                        x: 0,
                        opacity: 1
                    }}

                    transition={{
                        duration: .5,
                        delay: .8,
                        type: 'spring'
                    }}
                    className='w-[50px]'>
                    {/* <h1 className='text-xl sm:text-2xl font-inter font-bold'>Mayank Karayat</h1> */}
                    <img src={logo} className='w-full' alt="" />
                </motion.div>
                <div className='flex items-center'>
                    <ul className='hidden sm:flex gap-8 text-xl font-roboto'>
                        <motion.li

                            initial={{
                                x: 200,
                                opacity: 0
                            }}

                            whileInView={{
                                x: 0,
                                opacity: 1
                            }}

                            transition={{
                                duration: .8,
                                delay: 1,
                                type: 'spring'
                            }}

                            className="relative cursor-pointer text-[#f4ecff]  transition-colors duration-500 ">
                            <a href="#home" className="after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:w-0 after:h-[3px] after:rounded-2xl after:bg-[#f4ecff] font-bold hover:after:w-full after:transition-all after:duration-500">Home</a>
                        </motion.li>
                        <motion.li

                            initial={{
                                x: 200,
                                opacity: 0
                            }}

                            whileInView={{
                                x: 0,
                                opacity: 1
                            }}

                            transition={{
                                duration: .8,
                                delay: 1.2,
                                type: 'spring'
                            }}

                            className="relative cursor-pointer text-[#f4ecff]  transition-colors duration-500 ">
                            <a href="#about" className="after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:w-0 after:h-[3px] after:rounded-2xl after:bg-[#f4ecff] font-bold hover:after:w-full after:transition-all after:duration-500">About</a>
                        </motion.li>

                        {/* <li className="relative cursor-pointer text-[#f4ecff]  transition-colors duration-500 ">
                            <NavLink to="/experience" className="after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:w-0 after:h-[3px] after:rounded-2xl after:bg-[#1F1C2C] font-bold hover:after:w-full after:transition-all after:duration-500">Experience</NavLink>
                        </li> */}
                        <motion.li

                            initial={{
                                x: 200,
                                opacity: 0
                            }}

                            whileInView={{
                                x: 0,
                                opacity: 1
                            }}

                            transition={{
                                duration: .8,
                                delay: 1.4,
                                type: 'spring'
                            }}

                            className="relative cursor-pointer text-[#f4ecff]  transition-colors duration-500 ">
                            <a href="#project" className="after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:w-0 after:h-[3px] after:rounded-2xl after:bg-[#f4ecff] font-bold hover:after:w-full after:transition-all after:duration-500">Projects</a>
                        </motion.li>
                        <motion.li

                            initial={{
                                x: 100,
                                opacity: 0
                            }}

                            whileInView={{
                                x: 0,
                                opacity: 1
                            }}

                            transition={{
                                duration: .8,
                                delay: 1.6,
                                type: 'spring'
                            }}

                            className="relative cursor-pointer text-[#f4ecff]  transition-colors duration-500 ">
                            <a href="#contact" className="after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:w-0 after:h-[3px] after:rounded-2xl after:bg-[#f4ecff] font-bold hover:after:w-full after:transition-all after:duration-500">Contact</a>
                        </motion.li>
                    </ul>
                    <motion.div
                        initial={{
                            x:35,
                            opacity:0
                        }}

                        whileInView={{
                            x:0,
                            opacity:1
                        }}

                        transition={{
                            duration:1,
                            delay:1,
                            type:'spring'
                        }}
                    >
                        <RxHamburgerMenu className={`${side ? "hidden" : "block"} sm:hidden z-10 transition-all duration-500 ease-in-out cursor-pointer`} size={30} onClick={() => setside(!side)} />
                    </motion.div>
                    <RxCross2 className={`${side ? "block" : "hidden"} z-10 transition-all duration-500 ease-in-out cursor-pointer`} size={30} onClick={() => setside(!side)} />
                </div>
            </motion.div>
            <div className='' >
                <div className={`w-[200px] z-[1] h-[70vh] overflow-hidden absolute bg-[#9083ed] ${side ? "top-0" : "top-[-700px]"} transition-all duration-800 ease-in-out right-0 rounded-bl-[50px]`}>
                    <ul className='flex flex-col justify-center items-center h-full text-[16px] gap-8 font-serif'>
                        <motion.li
                        initial={{
                            x:100,
                            opacity:0
                        }}
                        whileInView={{
                            x:0,
                            opacity:1
                        }}
                        transition={{
                            duration:.6,
                            delay:.5,
                            type:'spring'
                        }}
                        className="relative cursor-pointer text-[#f4ecff]  transition-colors duration-500 ">
                            <a href="#home" className="after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px] after:bg-[#f4ecff] font-bold hover:after:w-full after:transition-all after:duration-500" onClick={() => setside(!side)}>Home</a>
                        </motion.li>
                        <motion.li
                        initial={{
                            x:100,
                            opacity:0
                        }}
                        whileInView={{
                            x:0,
                            opacity:1
                        }}
                        transition={{
                            duration:.6,
                            delay:.5,
                            type:'spring'
                        }}
                        className="relative cursor-pointer text-[#f4ecff]  transition-colors duration-500 ">
                            <a href="#about" className="after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px] after:bg-[#f4ecff] font-bold hover:after:w-full after:transition-all after:duration-500" onClick={() => setside(!side)}>About</a>
                        </motion.li>
                        {/* <li className="relative cursor-pointer text-[#f4ecff] hover:text-[#1F1C2C]  transition-colors duration-500 after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px] after:bg-[#1f1c2c] font-bold hover:after:w-full after:transition-all after:duration-500"><NavLink to="/experience">Experience</NavLink></li> */}
                        <motion.li
                        initial={{
                            x:100,
                            opacity:0
                        }}
                        whileInView={{
                            x:0,
                            opacity:1
                        }}
                        transition={{
                            duration:.6,
                            delay:.5,
                            type:'spring'
                        }}
                        className="relative cursor-pointer text-[#f4ecff]  transition-colors duration-500 ">
                            <a href="#project" className="after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px] after:bg-[#f4ecff] font-bold hover:after:w-full after:transition-all after:duration-500" onClick={() => setside(!side)}>Projects</a>
                        </motion.li>
                        <motion.li
                        initial={{
                            x:100,
                            opacity:0
                        }}
                        whileInView={{
                            x:0,
                            opacity:1
                        }}
                        transition={{
                            duration:.6,
                            delay:.5,
                            type:'spring'
                        }}
                        className="relative cursor-pointer text-[#f4ecff]  transition-colors duration-500 ">
                            <a href="#contact" className="after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px] after:bg-[#f4ecff] font-bold hover:after:w-full after:transition-all after:duration-500" onClick={() => setside(!side)}>Contact</a>
                        </motion.li>
                    </ul>
                </div>
            </div>


            {/* </div> */}
        </>
    )
}

export default Navbar