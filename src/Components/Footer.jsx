import React from 'react'
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { FaInstagram } from "react-icons/fa";
import { motion } from 'framer-motion';

const Footer = () => {
    return (
        <>
            <footer className='w-full py-10'>
                <div className='w-[90%] justify-between m-auto flex sm:flex-row sm:gap-0 gap-5 flex-col'>
                    <div className='w-[350px] sm:w-[30%] flex flex-col gap-2 sm:items-center'>
                        <motion.h1
                        whileInView={{
                            translateY:[-40,0],
                            opacity:[0,1],
                            transition:{
                                duration:.2,
                                delay:.2,
                                stiffness:100,
                                type:'spring'
                            }
                        }}
                        className=' text-2xl font-inter font-semibold'>About me</motion.h1>
                        <motion.p
                        whileInView={{
                            translateX:[-40,0],
                            opacity:[0,1],
                            transition:{
                                duration:.3,
                                delay:.3,
                                stiffness:100,
                                type:'spring'
                            }
                        }}
                        className='sm:text-center font-serif'>Passionate MERN stack developer focused on building clean, responsive web apps with modern tools.</motion.p>
                    </div>
                    <div className='w-[250px] sm:w-[30%] flex flex-col gap-2 sm:items-center'>
                        <motion.h2
                        whileInView={{
                            translateY:[-40,0],
                            opacity:[0,1],
                            transition:{
                                duration:.4,
                                delay:.4,
                                stiffness:100,
                                type:'spring'
                            }
                        }}
                        className=' text-xl font-inter font-semibold'>Quick Links</motion.h2>
                        <ul id='quick' className='leading-7' >
                            <motion.li
                            whileInView={{
                            translateY:[-40,0],
                            opacity:[0,1],
                            transition:{
                                duration:.5,
                                delay:.5,
                                stiffness:100,
                                type:'spring'
                            }
                        }}
                            ><a href="#project" className='font-serif'>Projects</a></motion.li>
                            <motion.li
                            whileInView={{
                            translateY:[-40,0],
                            opacity:[0,1],
                            transition:{
                                duration:.5,
                                delay:.6,
                                stiffness:100,
                                type:'spring'
                            }
                        }}
                            ><a href="#about" className='font-serif'>Skills</a></motion.li>
                            <motion.li
                            whileInView={{
                            translateY:[-40,0],
                            opacity:[0,1],
                            transition:{
                                duration:.5,
                                delay:.7,
                                stiffness:100,
                                type:'spring'
                            }
                        }}
                            ><a href="#contact" className='font-serif'>Contact</a></motion.li>
                            <motion.li
                            whileInView={{
                            translateY:[-40,0],
                            opacity:[0,1],
                            transition:{
                                duration:.5,
                                delay:.8,
                                stiffness:100,
                                type:'spring'
                            }
                        }}
                            ><a href="/Mayank_Karayat_Resume.docx" download className='font-serif'>Resume</a></motion.li>
                        </ul>
                    </div>
                    <div className='w-[250px] sm:w-[30%] flex flex-col sm:items-center gap-4'>
                        <motion.h3 
                        whileInView={{
                            translateY:[-40,0],
                            opacity:[0,1],
                            transition:{
                                duration:.6,
                                delay:.9,
                                stiffness:100,
                                type:'spring'
                            }
                        }}
                        className=' text-xl font-inter font-semibold'>Connect</motion.h3>
                        <ul className='flex  gap-5'>
                            <motion.a
                                whileInView={{
                                    x: [30, 0],
                                    opacity: [0, 1],
                                    transition: {
                                        duration: .8,
                                        delay:.9,
                                        type: 'spring',
                                        stiffness:100
                                    }
                                }}
                                whileHover={{
                                    backgroundColor: "#2d283e",
                                    translateY:-5
                                }}
                                href='https://github.com/Mayankarayat' className='bg-[#f4ecff] p-2  rounded-full' target='_blank'><FaGithub color="#9083ED" size={30} /></motion.a>
                            <motion.a
                                whileInView={{
                                    x: [30, 0],
                                    opacity: [0, 1],
                                    transition: {
                                        duration: .8,
                                        delay: .9,
                                        type: 'spring',
                                        stiffness:100
                                    }
                                }}
                                whileHover={{
                                    backgroundColor: "#2d283e",
                                    translateY:-5
                                }}
                                href='https://www.linkedin.com/in/mayank-karayat-38a283213/' className='bg-[#f4ecff] p-2  rounded-full' target='_blank'><FaLinkedin color="#9083ED" size={30} /></motion.a>
                            <motion.a
                                whileInView={{
                                    x: [-30, 0],
                                    opacity: [0, 1],
                                    transition: {
                                        duration: .8,
                                        delay: .9,
                                        type: 'spring',
                                        stiffness:100
                                    }
                                }}
                                whileHover={{
                                    backgroundColor: "#2d283e",
                                    translateY:-5
                                }}
                                href='https://www.instagram.com/_mayankkarayat_/' className='bg-[#f4ecff] p-2  rounded-full' target='_blank'><FaInstagram color="#9083ED" size={30} /></motion.a>
                        </ul>
                    </div>
                </div>
            </footer>
        </>
    )
}

export default Footer