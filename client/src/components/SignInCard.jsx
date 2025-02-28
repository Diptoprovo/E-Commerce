import React from 'react'

const SignInCard = () => {
    return (
        <div className='flex flex-row justify-center'>
            <div class="flex flex-col items-center basis-3/4 bg-white border border-gray-200 rounded-lg shadow-sm md:flex-row  hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 ">
                <img class="object-cover w-full rounded-t-lg h-96 md:h-auto md:w-48 md:rounded-none md:rounded-s-lg" src="asdf.jpg" alt="NOPE" />
                <div class="flex flex-col justify-between p-4 leading-normal">
                    <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Sign In to explore our endless products</h5>
                    <h6 class="mb-2 ms-10 text-lg font-bold tracking-tight text-gray-600 dark:text-white">Or register with a new email</h6>
                </div>
            </div>
        </div>
    )
}

export default SignInCard
