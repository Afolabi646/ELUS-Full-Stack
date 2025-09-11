import React from 'react'
import { FaFacebook } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaWhatsapp } from "react-icons/fa";
import whatsapp from '../assets/whatsapp.png'


const Footer = () => {
  return (
    <footer className="border-t">
      <div className="container mx-auto p-4 flex flex-col lg:flex-row lg:justify-between gap-4">
        <p className="text-center">© All Rights Reserved 2025</p>

        <div className="flex items-center gap-4 justify-center text-2xl">
          <a href="">
            <FaFacebook />
          </a>
          <a href="https://www.instagram.com/elusfood?igsh=MXVocXVpM2hyYjUzZw%3D%3D&utm_source=qr">
            <FaInstagram className="text-red-500" />
          </a>
          <a href="">
            <FaWhatsapp />
          </a>
        </div>
      </div>
      <div className="fixed bottom-18 left-72 md:bottom-18 md:left-190 lg:bottom-18 lg:left-310 right-0 rounded-2xl">
        <a
          href="https://wa.me/+447311145412"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            className="lg:w-10 lg:h-10 w-7 h-7 rounded-full"
            src={whatsapp}
            alt="WhatsApp"
          />
        </a>
      </div>
    </footer>
  );
}

export default Footer