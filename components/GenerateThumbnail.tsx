import React, { useRef, useState } from 'react'
import { GenerateThumbnailProps } from '@/types'
import { Loader } from 'lucide-react'
import { Input } from './ui/input'
import Image from 'next/image'
import { useToast } from './ui/use-toast'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { useUploadFiles } from '@xixixao/uploadstuff/react'

const GenerateThumbnail = ({setImage, setImageStorageId, image}: GenerateThumbnailProps) => {

  const [isImageLoading, setIsImageLoading] = useState<boolean>(false)

  const imageRef = useRef<HTMLInputElement>(null)
  const generateUploadUrl = useMutation(api.files.generateUploadUrl)
  const { startUpload } = useUploadFiles(generateUploadUrl)
  const getImageUrl = useMutation(api.podcast.getUrl)
  const { toast } = useToast()

  const handleImage = async (blob: Blob, fileName: string) => {
    setIsImageLoading(true)
    setImage('')

    try {

      const file = new File([blob], fileName, {type: 'image/png'})
      
      const uploaded = await startUpload([file])
      const storageId = (uploaded[0].response as any).storageId
      setImageStorageId(storageId)

      const imageUrl = await getImageUrl({storageId})
      setImage(imageUrl!)
      setIsImageLoading(false)
      toast({
        title: "thumbnail generated successfully"
      })
    } catch (error) {
      console.log(error)
      toast({
        title: "Error generating thumbnail",
        variant: 'destructive'
      })
    }
  }

  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()

    try {
      const files = e.target.files
      if(!files) return
      const file = files[0]
      const blob = await file.arrayBuffer()
      .then((ab) => new Blob([ab]))
      handleImage(blob, file.name)
    } catch (error) {
      console.log(error)
      toast({
        title: "Error uploading image",
        variant: 'destructive'
      })
    }
  }

  return (
    <>
      <div className='mt-[30px] flex flex-col gap-2.5'>
        <h2 className='text-16 font-bold text-white-1'>Podcast cover image</h2>
        <p className='text-14 text-white-3'>Upload a square cover image for your podcast.</p>
        <div className='image_div' onClick={() => imageRef.current?.click()}
          onChange={uploadImage}
        >
          <Input
            type='file'
            className='hidden'
            ref={imageRef}
          />
          {!isImageLoading ? (
            <Image src="icons/upload-image.svg" width={40} height={40} alt="upload" />
          ): (
            <div className='text-16 flex-center font-medium text-white-1'>
              Uploading
              <Loader />
            </div>
          )}
          <div className='flex flex-col items-center gap-1'>
            <h2 className='text-12 font-bold text-orange-1'>Click to upload</h2>
            <p className='text-12 font-normal text-gray-1'>SVG, PNG, JPG, or GIF (MAX. 1080x1080px)</p>
          </div>
        </div>
      </div>
      {image && (
        <div className='flex-center w-full'>
          <Image
            src={image}
            width={200}
            height={200}
            className='mt-5'
            alt='thumbnail'
          />
        </div>
      )}
    </>
  )
}

export default GenerateThumbnail
