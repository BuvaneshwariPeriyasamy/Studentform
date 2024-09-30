import React from 'react'
import { BsXLg } from "react-icons/bs";

function registerForm() {

}


const Home = () => {
    return (
        <div>
            <div className='text-lg font-bold text-center p-2 marginleft border border-black rounded-2xl text-white bg-black hover:text-black hover:bg-white'>
                <button onChange={registerForm()}>Student Registration</button>
            </div>
            <div className='text-white bg-black  margin text-lg hidden' >
                <div className='ml-80 pt-10 pl-10'><BsXLg /></div>
                <div className='text-center px-20 py-10 pb-60  flex flex-col gap-5'>
                    <div>Home</div>
                    <div>Registration Form/Edit</div>
                    <div>Delete</div>
                </div>
            </div>

            <div className='text-center p-20'>
                <h1 className='text-5xl font-bold'>Welcome to Student Registration!</h1>
                <p className='text-xl font-semibold pt-5'>Register now to join our vibrant learning community</p>
                <button className='border-2 border-black p-1 m-5 bg-green-600 px-4 rounded-md text-xl font-bold hover:text-white'>Get Started</button>

            </div>
        </div>
    )
}

export default Home;
