import React from "react";
import { useRef } from "react";
import { FaLinkedinIn } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaPhoneSquareAlt } from "react-icons/fa";
import { SiMinutemailer } from "react-icons/si";
import emailjs from "@emailjs/browser";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

const Contact = () => {

  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    toast.loading("Sending message...");

    emailjs
      .sendForm(
        "Contact_service",         
        "template_8ebjen4",       
        form.current,
        "RtLCdc_m6UZOa56i2"        
      )
      .then(
        () => {
          toast.dismiss();
          toast.success("Message sent successfully!");
          form.current.reset(); 
        },
        () => {
          toast.dismiss();
          toast.error("Something went wrong. Try again.");
        }
      );
  };

  return (
    <section id="contact" className="w-[90%] mx-auto py-15">
      <div className="flex justify-between flex-wrap sm:gap-0  gap-10">
        <div className="basis-[100%] sm:basis-[30%] md:basis-[40%]">
          <motion.h1
            whileInView={{
              x: [-100, 0],
              opacity: [0, 1],
              transition: {
                duration: .5,
                delay: .4,
                type: 'spring'
              }
            }}
            className="text-4xl md:text-6xl pb-5 font-inter font-bold ">Contact me</motion.h1>
          <motion.span
            whileInView={{
              x: [-100, 0],
              opacity: [0, 1],
              transition: {
                duration: .6,
                delay: .5,
                type: 'spring'
              }
            }}
            className="flex gap-4 items-center pb-4">
            <SiMinutemailer
              size={25} color="#9083ED" />
            <p className="text-[17px] sm:text-sm md:text-lg font-serif">mayank64641karayat@gmail.com</p>
          </motion.span>
          <motion.span
            whileInView={{
              x: [-100, 0],
              opacity: [0, 1],
              transition: {
                duration: .7,
                delay: .6,
                type: 'spring'
              }
            }}
            className="flex gap-4 items-center pb-4">
            <FaPhoneSquareAlt size={25} color="#9083ED" />
            <p className="text-[17px sm:text-sm md:text-lg font-serif">9717985116</p>
          </motion.span>
          <div className="flex gap-4 pt-2">
            <motion.a
              whileInView={{
                x: [-50, 0],
                opacity: [0, 1],
                transition: {
                  duration: .9,
                  delay: .8,
                  type: 'spring'
                }
              }}
              whileHover={{
                backgroundColor: "#2d283e",
              }}
              href={"https://www.linkedin.com/in/mayank-karayat-38a283213/"}
              target='_blank'
              rel='noopener noreferrer'
              className='mt-2 bg-[#f4ecff] font-bold text-white sm:text-sm md:text-[16px] p-2 font-inter rounded-full'
            >
              <FaLinkedinIn size={30} color="#9083ED" />
            </motion.a>
            <motion.a
              whileInView={{
                x: [-100, 0],
                opacity: [0, 1],
                transition: {
                  duration: 1,
                  delay: .9,
                  type: 'spring'
                }
              }}
              whileHover={{
                backgroundColor: "#2d283e",
              }}
              href={"https://www.instagram.com/_mayankkarayat_/"}
              target='_blank'
              rel='noopener noreferrer'
              className='mt-2 bg-[#f4ecff] font-bold text-white sm:text-sm md:text-[16px] p-2 font-inter rounded-full'
            >
              <FaInstagram size={30} color="#9083ED" />
            </motion.a>
          </div>
        </div>
        <div className="basis-[100%] sm:basis-[60%] md:basis-[55%] py-3">
          <form
            ref={form} onSubmit={sendEmail} className="flex flex-col gap-5 justify-center items-center">
            <motion.input
              whileInView={{
                scale: [0, 1],
                opacity: [0, 1],
                transition: {
                  duration: .8,
                  delay: .7,
                  stiffness: 100,
                  type: 'spring'
                }
              }}
              spellCheck={true} type="text" name="user_name" placeholder="Your Name" required className="w-full outline-none bg-[#2d283e] px-2 py-3 rounded-[6px]" />
            <motion.input
              whileInView={{
                scale: [0, 1],
                opacity: [0, 1],
                transition: {
                  duration: .8,
                  delay: .8,
                  stiffness: 100,
                  type: 'spring'
                }
              }}
              spellCheck={true} type="email" name="user_email" id="" required placeholder="Your mail" className="w-full outline-none bg-[#2d283e] px-2 py-3 rounded-[6px]" />
            <motion.textarea
              whileInView={{
                scale: [0, 1],
                opacity: [0, 1],
                transition: {
                  duration: .8,
                  delay: .8,
                  stiffness: 100,
                  type: 'spring'
                }
              }}
              spellCheck={true} name="message" id="" cols="30" rows="8" required placeholder="Your message" className="w-full outline-none bg-[#2d283e] px-2 py-3 rounded-[6px]"></motion.textarea>
            <motion.button
              whileInView={{
                scale: [0, 1],
                opacity: [0, 1],
                transition: {
                  duration: .8,
                  delay: .8,
                  stiffness: 100,
                  type: 'spring'
                }
              }}
              whileHover={{
                backgroundColor:"#2d283e",
                transition:{
                  duration:.2,
                  delay:.1
                }
              }}
              type="submit" className=" border-[1px] text-[#9083ED] bg-[#f4ecff] rounded-[10px] py-3 font-serif text-xl font-bold w-fit px-9 cursor-pointer">Submit</motion.button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
