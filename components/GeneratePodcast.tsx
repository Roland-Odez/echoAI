import React, { useState } from 'react'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { Button } from './ui/button'
import { Loader } from 'lucide-react'
import { GeneratePodcastProps } from '@/types'
import { useAction, useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import {v4 as uuidv4} from 'uuid'
import { useUploadFiles } from '@xixixao/uploadstuff/react'
import { useToast } from "@/components/ui/use-toast"

const useGeneratePodcast = ({
    setAudio, voiceType, voicePrompt, setAudioStorageId
}: GeneratePodcastProps) => {

    const [isGenerating, setIsGenerating] = useState<boolean>(false)
    const generateUploadUrl = useMutation(api.files.generateUploadUrl)
    const { startUpload } = useUploadFiles(generateUploadUrl)
    const getPodcastAudio = useAction(api.openai.generateAudioAction)
    const getAudioUrl = useMutation(api.podcast.getUrl)
    const { toast } = useToast()
    
    const generatePodcast = async () => {
        setIsGenerating(true)

        setAudio('')

        if(!voiceType){
            toast({ title: "Please select a Kokoro voice", variant: "destructive" })
            return setIsGenerating(false)
        }

        if(!voicePrompt){
            toast({
                title: "Please generate or write a narration script"
            })
            return setIsGenerating(false)
        }

        try {
            const response = await getPodcastAudio({
                voice: voiceType,
                input: voicePrompt
            })

            const blob = new Blob([response], {type: 'audio/mpeg'});
            const fileName = `podcast-${uuidv4()}.mp3`
            const file = new File([blob], fileName, {type: 'audio/mpeg'})

            const uploaded = await startUpload([file])
            const storageId = (uploaded[0].response as any).storageId
            setAudioStorageId(storageId)

            const audioUrl = await getAudioUrl({storageId})
            setAudio(audioUrl!)
            setIsGenerating(false)
            toast({
                title: "Podcast generated successfully!"
            })
        } catch (error) {
            console.log('Error generating podcast', error)
            toast({
                title: "Error creating a podcast",
                variant: "destructive"
              })
            setIsGenerating(false)
        }
    }

    return {
        isGenerating,
        generatePodcast
    }
}

const GeneratePodcast = (props: GeneratePodcastProps) => {

    const {isGenerating, generatePodcast} = useGeneratePodcast(props)
    const [topic, setTopic] = useState('')
    const [isGeneratingScript, setIsGeneratingScript] = useState(false)
    const generateScript = useAction(api.openai.generateScriptAction)
    const { toast } = useToast()

    const handleGenerateScript = async () => {
        if (!topic.trim()) {
            toast({ title: 'Please provide a podcast topic', variant: 'destructive' })
            return
        }

        setIsGeneratingScript(true)
        try {
            props.setVoicePrompt(await generateScript({ topic }))
            toast({ title: 'Script generated. You can edit it before creating audio.' })
        } catch (error) {
            console.log('Error generating script', error)
            toast({ title: 'Error generating script', variant: 'destructive' })
        } finally {
            setIsGeneratingScript(false)
        }
    }

  return (
    <div>
        <div className='flex flex-col gap-2.5'>
            <Label className='text-16 font-bold text-white-1'>Podcast topic and instructions</Label>
            <Textarea
                className='input-class font-light focus-visible:ring-offset-orange-1'
                placeholder='Example: Explain practical ways small businesses can use AI, in a warm and optimistic tone.'
                rows={4}
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
            />
        </div>
        <div className='mt-5 w-full max-w-[200px]'>
            <Button type="button" className="text-16 py-4 font-bold text-white-1 bg-orange-1" onClick={handleGenerateScript} disabled={isGeneratingScript}>
                {isGeneratingScript ? <><Loader size={20} className='animate-spin mr-2' /> Writing script</> : 'Generate script'}
            </Button>
        </div>
        <div className='mt-8 flex flex-col gap-2.5'>
            <Label className='text-16 font-bold text-white-1'>Narration script</Label>
            <Textarea 
                className='input-class font-light focus-visible:ring-offset-orange-1'
                placeholder='Generate a script above, or write and edit the narration yourself.'
                rows={8}
                value={props.voicePrompt}
                onChange={(e) => props.setVoicePrompt(e.target.value)}
            />
        </div>
        <div className='mt-5 w-full max-w-[200px]'>
            <Button type="button" className="text-16 py-4 font-bold text-white-1 bg-orange-1" onClick={generatePodcast} disabled={isGenerating}>
                {isGenerating ? (
                    <>
                    Generating
                    <Loader size={20} className='animate-spin ml-2' />
                    </>
                ) : (
                    <>
                    Generate
                    </>
                )}
            </Button>
        </div>
        {
            props.audio && (
                <audio
                    controls
                    src={props.audio}
                    autoPlay
                    className='mt-5'
                    onLoadedMetadata={(e) => props.setAudioDuration(e.currentTarget.duration)}
                />
            )
        }
    </div>
  )
}

export default GeneratePodcast
