import React from 'react'
import { TypeAnimation } from 'react-type-animation';
import { motion } from 'framer-motion';
import mayank from '../assets/mayank.jpeg'
const Hero = () => {
    return (
        <>
            <div id='home' className='flex flex-col-reverse sm:justify-between gap-12 sm:gap-8 w-[90%] sm:flex-row  justify-center sm:h-[85vh] items-center py-15 sm:py-0 mx-auto'>
                <div className='w-full sm:w-[55%] flex flex-col gap-3 sm:gap-4'>
                    <motion.h1
                        initial={{
                            scale: 0
                        }}
                        whileInView={{
                            scale: 1,
                            transition: {
                                duration: 1,
                                delay: 1,
                                type: 'spring'
                            }
                        }}
                        className='text-2xl sm:text-xl md:text-4xl font-inter'>Hi, I'm Mayank Karayat</motion.h1>
                    <motion.p
                        initial={{
                            opacity: 0
                        }}
                        whileInView={{
                            opacity: 1,
                            transition: {
                                duration: 2,
                                delay: 1.5,
                                type: 'spring'
                            }
                        }}
                        id='mern' className='text-xl sm:text-lg md:text-2xl font-serif text-[#9083ed] font-bold '>
                        <TypeAnimation
                            sequence={[
                                'M',
                                50,
                                'MERN', // Types 'One'
                                1000, // Waits 1s
                                'MERN Stack', // Deletes 'One' and types 'Two'
                                1000, // Waits 2s
                                'MERN Stack Developer', // Types 'Three' without deleting 'Two'
                                1000,
                                () => {
                                    // console.log('Sequence completed');
                                },
                            ]}
                            wrapper="span"
                            cursor={false}
                            repeat={Infinity}
                        // style={{ fontSize: '2em', display: 'inline-block' }}
                        />
                    </motion.p>
                    <motion.p
                        initial={{
                            x: -150,
                            opacity: 0
                        }}
                        whileInView={{
                            x: 0,
                            opacity: 1,
                            transition: {
                                duration: 1,
                                delay: 1,
                                type: 'spring'
                            }
                        }}
                        className='text-[17px] md:text-xl font-inter'>Passionate about building clean, </motion.p>
                    <motion.p
                        initial={{
                            x: -150,
                            opacity: 0
                        }}
                        whileInView={{
                            x: 0,
                            opacity: 1,
                            transition: {
                                duration: 1,
                                delay: 1,
                                type: 'spring'
                            }
                        }}
                        className='text-[17px] md:text-3xl font-inter'>responsive web apps.</motion.p>
                    <motion.a
                        initial={{
                            x: -50,
                            opacity: 0
                        }}
                        whileInView={{
                            x: 0,
                            opacity: 1,
                            transition: {
                                duration: 1,
                                delay: 1,
                                type: 'spring'
                            }
                        }}
                        whileHover={{
                            backgroundColor: "#9083ed",
                            translateY: -5
                        }}
                        href="../assets/Mayank Resume.docx" download className='w-fit border-[1px] border-[#9083ed]  font-serif font-bold text-[15px] sm:text-lg mt-2 ease-in-out py-3 px-6 rounded-lg cursor-pointer'>Download CV</motion.a>
                </div>
                <div className=' sm:flex sm:justify-end'>
                    <motion.div
                    initial={{
                        x:100,
                        opacity:0,
                        rotateY:0,
                    }}
                    whileInView={{
                        x:0,
                        opacity:1,
                        rotateY:360,
                        transition: {
                            duration: 3,
                            delay: 1,
                            type: 'spring'
                        }
                    }}
                    className='rounded-full w-[200px] sm:w-[250px] h-[200px] sm:h-[250px] lg:w-[340px] lg:h-[340px] overflow-hidden  shadow-[0_0_5px_2px_#aea6ca]'>

                        <img src={mayank} className='w-full h-full object-cover object-top' alt="Mayank" />
                    </motion.div>

                </div>
            </div>
        </>
    )
}

export default Hero