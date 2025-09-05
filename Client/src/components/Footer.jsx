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
      <div className="fixed bottom-25 left-80 right-0 rounded-2xl lg:bottom-25 lg:left-300">
        <a href="https://wa.me/+447311145412" target="blank">
          <img
            className="lg:w-10 lg:h-10 w-10 h-10 rounded-full"
            src={whatsapp}
            alt=""
          />
        </a>
      </div>
    </footer>
  );
}

export default Footer