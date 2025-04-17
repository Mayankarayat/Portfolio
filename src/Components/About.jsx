import React from 'react'
import { useState } from 'react';
import { motion } from 'framer-motion';

const About = () => {

  const [activeTab, setActiveTab] = useState('skills');

  // console.log(activeTab)

  const renderContent = () => {
    switch (activeTab) {
      case 'skills':
        return (
          <motion.div
          whileInView={{
            scale:[0,1],
            transition:{
              duration:1,
              delay:1,
              type:'spring'
            }
          }}
          className='pt-5 sm:pt-2 md:pt-5'>
            <h1 className='text-[#9083ED] text-[17px] sm:text-[15px] md:text-xl font-inter font-bold'>Frontend Development</h1>
            <p className='pt-2 pb-3 sm:pt-1 md:pt-2 text-sm sm:text-[12px] md:text-[16px] font-serif'>HTML, CSS, JS, React.js, Tailwind.CSS, Bootstrap</p>
            <h1 className='text-[#9083ED] text-[18px] md:text-xl font-inter font-bold pt-2 sm:pt-1 md:pt-2'>Backend Development</h1>
            <p className='pt-2 pb-3 sm:pt-1 md:pt-2 text-sm sm:text-[12px] md:text-[16px] font-serif'>Node.js, Express.js, MongoDB</p>
            <h1 className='text-[#9083ED] text-[18px] md:text-xl font-inter font-bold pt-2 sm:pt-1 md:pt-2'>MERN Stack Development</h1>
            <p className='pt-2 pb-3 sm:pt-1 md:pt-2 text-sm sm:text-[12px] md:text-[16px] font-serif'>MongoDB, Express.js, React.js, Node.js</p>
          </motion.div>
        );
      case 'experience':
        return (
          <motion.div
          whileInView={{
            scale:[0,1],
            transition:{
              duration:1,
              delay:1,
              type:'spring'
            }
          }}
          className='pt-5 sm:pt-2 md:pt-5'>
            <h1 className='text-[#9083ED] pb-4 sm:pb-2 md:pb-4 sm:text-[15px] text-[18px] md:text-xl font-inter font-bold'>Frontend Developer (June 2024 - Aug 2024)</h1>
            {/* <p className='pt-2 font-roboto'></p> */}
            <ul className='pl-8 font-serif sm:text-[12px] text-14px md:text-[16px] leading-6 sm:leading-5 md:leading-7 flex flex-col gap-3 sm:gap-1 md:gap-3'>
              <li className='list-disc'>Completed a 3-month internship in game development using HTML, CSS, JavaScript and jQuery.</li>
              <li className='list-disc'>Designed and developed interactive , responsive game interfaces with smooth animations.</li>
              <li className='list-disc'>Enhanced user experience through efficient debugging and problem-solving.</li>
              <li className='list-disc'>Gained practical exposure to collaborative project development in a dynamic environment.</li>
            </ul>
          </motion.div>
        );
      case 'education':
        return (
          <motion.div
          whileInView={{
            scale:[0,1],
            transition:{
              duration:1,
              delay:1,
              type:'spring'
            }
          }}
          className='pt-5 sm:pt-2 md:pt-5'>
            <h1 className='text-[#9083ED] text-lg md:text-xl font-inter font-bold'>2022-2025</h1>
            <p className='pt-2 pb-3 sm:pt-1 md:pt-2 font-serif text-sm md:text-[16px]'>BCA (Bachelors in Computer Application) at Chaudhary Charan Singh University.</p>
            <h1 className='text-[#9083ED] text-lg md:text-xl font-inter font-bold pt-2 sm:pt-1 md:pt-2'>2021-2022</h1>
            <p className='pt-2 pb-3 sm:pt-1 md:pt-2 font-serif text-sm md:text-[16px]'>12th Passed from C.B.S.E Board.</p>
            <h1 className='text-[#9083ED] text-lg md:text-xl font-inter font-bold pt-2 sm:pt-1 md:pt-2'>2019-2020</h1>
            <p className='pt-2 pb-3 sm:pt-1 md:pt-2 font-serif text-sm md:text-[16px]'>10th Passed from C.B.S.E Board.</p>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div id='about' className=' w-[90%] m-auto flex justify-between gap-8 sm:flex-row flex-col-reverse pt-10'>
        <motion.div
        initial={{
          rotateY:0,
          x:-100,
          opacity:0
        }}

        whileInView={{
          rotateY:360,
          x:0,
          opacity:1,
          transition:{
            duration:1,
            delay:.8,
            type:'spring'
          }
        }}

        className=' m-auto sm:basis-[50%] md:basis-[45%] lg:basis-[35%]'>
          <img src="/src/assets/about2.jpeg" className='sm:w-[100%] sm:h-[100%] w-[250px] h-[250px] rounded-full object-cover  sm:rounded-2xl' alt="" />
        </motion.div>
        <div className='sm:basis-[45%] md:basis-[50%] lg:basis-[60%]'>
          <motion.h1
          initial={{
          x:100,
          opacity:0
        }}

        whileInView={{
          x:0,
          opacity:1,
          transition:{
            duration:.7,
            delay:1,
            type:'spring'
          }
        }}
          className='text-4xl pb-3 md:text-5xl font-inter font-bold'>About me</motion.h1>
          <motion.p 
          initial={{
          x:100,
          opacity:0
        }}

        whileInView={{
          x:0,
          opacity:1,
          transition:{
            duration:.7,
            delay:1.2,
            type:'spring'
          }
        }}
          className='pt-2 sm:pt-1 md:pt-2 font-inter text-sm md:text-lg'>I'm Mayank Karayat, a dedicated BCA student with a strong passion for web development. I specialize in creating modern, responsive web applications using the MERN stack — MongoDB, Express.js, React, and Node.js — along with tools like Tailwind CSS, Bootstrap, and jQuery. I enjoy turning ideas into reality through clean, efficient code and intuitive UI/UX design. I'm always eager to learn, collaborate, and contribute to projects that create real impact.</motion.p>
          <ul className='flex justify-between sm:justify-start sm:gap-10 font-inter text-lg sm:text-sm md:text-lg pt-5 sm:pt-2 md:pt-5'>
            {['skills', 'experience', 'education'].map((tab) => (
              <motion.li
                initial={{
                  x:100,
                  opacity:0
                }}
                whileInView={{
                  x:0,
                  opacity:1,
                  transition:{
                    duration:.5,
                    delay:1.4,
                    type:'spring'
                  }
                }}
                key={tab}
                className={`cursor-pointer relative after:content-[''] after:absolute after:w-0 after:bottom-[-3px] after:left-0 hover:after:w-[50%] after:bg-[#9083ED] after:h-[3px] after:rounded-3xl after:transition-all after:duration-500 ${activeTab === tab ? 'after:w-[50%]' : ''
                  }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </motion.li>
            ))}
          </ul>

          {/* Render the selected content */}
          {renderContent()}
        </div>
      </div>
    </>
  )
}

export default About