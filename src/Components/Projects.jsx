import React, { useState } from 'react'
import { FiExternalLink } from "react-icons/fi";
import { motion } from 'framer-motion';

const Projects = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const handleCardClick = (index) => {
    // Toggle the clicked card
    setActiveIndex(prev => (prev === index ? null : index));
  };

  const projectData = [
    {
      img: 'https://media.istockphoto.com/id/1384700413/vector/to-do-list-with-clipboard.jpg?s=612x612&w=0&k=20&c=naH67PLQVD5JuC9Z96DFTw8gZT3waRNOgOL23UyHRFw=',
      title: "To-Do's",
      desc: 'A fully responsive To-Do List app built with React and Tailwind CSS, designed for efficient task management.',
      link: "https://mayankarayat.github.io/To-Do-s/"
    },
    {
      img: 'https://5.imimg.com/data5/SELLER/Default/2023/2/FT/LE/PX/140458234/food-manufacturers-ecommerce-website-500x500.jpg',
      title: 'Dish Delight',
      desc: 'Dish Delight is a dynamic and user-friendly food ordering website designed to provide a seamless and           enjoyable experience for users. Built using modern technologies like React, Tailwind CSS, React Router   DOM, React Toast, and Context API, it ensures both performance and scalability.',
      link: 'https://mayankarayat.github.io/DishDelight/'
    },
    {
      img: 'https://images.template.net/wp-content/uploads/2014/07/13053845/Free-Book-Store-Ecommerce-Website-Template.jpg',
      title: 'Bookish Bliss',
      desc: 'Bookish Bliss is a comprehensive online bookstore platform built with the MERN stack, Tailwind CSS, Bootstrap, Context API, and React Router DOM. It is designed to deliver a seamless, secure, and enjoyable shopping experience for book lovers.',
      link: 'https://book-store-6b3q.onrender.com'
    },
  ];

  return (
    <div id='project' className='w-[90%] m-auto pt-18'>
      <motion.h1
      whileInView={{
        x:[-80,0],
        opacity:[0,1],
        transition:{
          duration:1,
          delay:.6,
          type:'spring'
        }
      }}
      className='text-4xl md:text-5xl font-bold font-inter pb-5'>My Projects</motion.h1>
      <div className='flex sm:flex-row flex-col gap-8 justify-between pt-8 flex-wrap'>
        {projectData.map((project, index) => (
          <motion.div
            whileInView={{
              scale:[0,1],
              opacity:[0,1],
              transition:{
                duration:1,
                delay:1,
                type:'spring'
              }
            }}
            key={index}
            className='basis-full sm:basis-[46%] lg:basis-[30%] relative overflow-hidden group rounded-[10px] sm:rounded-2xl cursor-pointer'
            onClick={() => handleCardClick(index)}
          >
            <img src={project.img} className={`w-full h-full object-cover transition-transform duration-500 ease-in-out sm:group-hover:transform-[scale(1.1)] ${activeIndex === index ? 'transform-[scale(1.1)]' : 'transform-[scale(1)]'} `} alt={project.title} />

            <div className={`rounded-[10px] sm:rounded-2xl px-3 absolute w-full h-[0px] left-0 bottom-0 overflow-hidden sm:group-hover:h-[100%] transition-all duration-500   text-white  flex justify-center items-center flex-col ${activeIndex === index ? 'h-full' : 'h-[0px]'}`} style={{
              background: "linear-gradient(rgba(255,255,255,0.7), #9083ED)",
            }}>
              <h1 className='text-2xl sm:text-xl md:text-[22px] font-bold font-inter text-[#1f1c2c]'>{project.title}</h1>
              <p className='text-center text-[16px] sm:text-sm md:text-[17px] lg:text-[13px] px-2 font-inter text-[#2d283e]'>{project.desc}</p>
              <a
                href={project.link}
                target='_blank'
                rel='noopener noreferrer'
                className='mt-2 bg-[#f4ecff] font-bold text-white sm:text-sm md:text-[16px] p-3 font-inter hover:bg-[#2d283e] transition-all duration-500 ease-in-out rounded-full'
              >
                <FiExternalLink color='#9083ED' size={25} />
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Projects;
