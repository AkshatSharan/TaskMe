import { Loader2 } from 'lucide-react'
import React from 'react'

const Loading = ({ text }) => {
    return (
        <div className="flex justify-center items-center h-40 absolute left-[50%] top-[40%] translate-x-[-50%] ">
            <Loader2 className="animate-spin w-6 h-6 text-white" />
            <span className="ml-2 text-sm">{text}</span>
        </div>
    )
}

export default Loading