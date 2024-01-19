import { NextPage } from 'next'

interface Props { }

const Page: NextPage<Props> = ({ }) => {
  return <div className='min-h-screen min-w-full border-2'>
    <div className='border-2 border-blue-500 h-20'>Header</div>
    <div className='border-2 border-blue-500'>Content</div>
    <div className='border-2 border-blue-500'>Footer</div>
  </div>
}

export default Page