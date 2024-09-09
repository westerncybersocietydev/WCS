import React from 'react'
import Navbar from '../components/navbar'
import Footer from '../components/footer'

export default function IBM() {
  return (
    <div className='text-black'>
      <Navbar />
      {/* Full-width background image with text */}
      <div
        className='relative w-full h-screen bg-cover bg-center'
        style={{ backgroundImage: "url('/overviewBg.jpg')" }}
      >
        <div className='absolute inset-0 bg-black bg-opacity-50 flex text-left items-center'>
          <div className='text-white px-4 ml-8'>
            <h1 className='text-4xl font-bold'>WCS x IBM</h1>
            <p className='mt-6 max-w-xl'>
              Are you curious about Mainframe, the backbone of modern business and technology? Want to learn more about the incredible world of Z? Western Cyber Society is thrilled to announce our latest venture- the groundbreaking IBM Z Accelerator Program.
            </p>
          </div>
        </div>
      </div>

      {/* Content with additional margin/padding at the bottom */}
      <div className="flex flex-col justify-center items-center min-h-screen space-y-10 pb-20">
        <img src="/ibm.jpg" className="w-3/4 mt-20" alt="ibm" />
        <h2 className='text-3xl'><strong>IBM Z ACCELERATOR PROGRAM</strong></h2>
        <p className='w-9/12 text-center'>By joining the IBM Accelerator Program, students will complete highly valuable certifications through IBM Z Xplore, Network with mainframe executives from various large industry companies, and gain practical work experience utilizing mainframe technologies while developing a project to showcase at the Toronto Tech Expo.</p>
        <p className='w-9/12 text-center'>Dive into the exciting world of IBM Z Mainframe technology with WCS's IBM Accelerator Program! This is your chance to gain the essential skills and resources needed to make a significant impact in a field that's eagerly seeking new talent. Seize this opportunity to be part of a dynamic, future-shaping industry!</p>
        <img src="/badge.jpg" className="w-2/4" alt="badge" />
        <button className='bg-black'>JOIN THE IBM Z ACCELARATOR PROGRAM</button>
        <img src="/percent.jpg" className="w-2/4" alt="badge" />
        <h2 className='text-3xl'><strong>What is Mainframe?</strong></h2>
        <p className='w-9/12 text-center'>IBM Z Mainframe is an essential part of the hybrid cloud, analytics, internet of things and AI strategy. Z-standing for zero downtime, the mainframe powers over 68% of worldwide transactions. </p>
        <h2 className='text-xl'><strong>The backbone of the world's leading businesses.</strong></h2>
        <div className="grid grid-cols-4 gap-4 text-center">
          <div className="p-4">
            <p className="text-4xl font-bold">7</p>
            <p className="text-base">of the 10 top Retailers</p>
          </div>
          <div className="p-4">
            <p className="text-4xl font-bold">45</p>
            <p className="text-base">of the top 50 worldwide banks</p>
          </div>
          <div className="p-4">
            <p className="text-4xl font-bold">4</p>
            <p className="text-base">of the world's largest airlines</p>
          </div>
          <div className="p-4">
            <p className="text-4xl font-bold">8</p>
            <p className="text-base">10 of the 10 world's largest insurers</p>
          </div>
        </div>
        <p className='w-9/12 text-center'>To learn more click the button above and sign up for the IBM Z Accelerator Program.</p>
      </div>

      <Footer />
    </div>
  )
}
