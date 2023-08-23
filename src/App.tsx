import { useRef} from 'react'
import { toast } from 'react-hot-toast'
import './App.scss'
import ConvertToPNG from './ConvertToPNG'

function App() {


  const fileInputRef = useRef<HTMLInputElement>(null!)
  const inputCanvasRef = useRef<HTMLCanvasElement>(null!)
  const outputCanvasRef = useRef<HTMLCanvasElement>(null!)

  //Use FileReader


  const fileDropped = async (e:React.ChangeEvent<HTMLInputElement>) => {
    var file = e.target?.files?.[0]
    if(file){

      if (file.type !== 'image/png') {
        toast.error("Invalid image type, please use .png")
        try{
          file = await ConvertToPNG(file)
        }catch(error){
          console.log(error)
        }
      }

      const reader = new FileReader()

      reader.onload =  (e) => {

        if(!e.target?.result){
          return
        }

        const image = new Image()
        image.src = e.target.result as string

        image.onload = () => {

          var imageSide = 512

          if(image.width !== imageSide || image.height !== imageSide){
            toast.error("Image must be 512 x 512 px")
            return
          }

          const inputCanvas = inputCanvasRef.current
          const outputCanvas = outputCanvasRef.current

          inputCanvas.width = imageSide;
          inputCanvas.height = imageSide;

          outputCanvas.width = imageSide;
          outputCanvas.height = imageSide;

          const inputContext = inputCanvas.getContext('2d');
          const outputContext = outputCanvas.getContext('2d')

          if (inputContext && outputContext) {

            inputContext.drawImage(image, 0, 0);
            outputContext.drawImage(image,0,0)

            const pixelData = outputContext.getImageData(0, 0, inputCanvas.width, inputCanvas.height).data;

            outputContext.fillStyle = 'rgba(0, 255, 0, 0.3)'

            var pixelsInsideCircleCount = 0
            var pixelOutsideCircleCount = 0
            var hapinessIndicator = 0



            for(let x = 0;x<outputCanvas.width;x++){

              for(let y = 0; y<outputCanvas.height;y++){
                
                // x = position on x axis of tested pixel
                // y = position on y axis of tested pixel
                // (0,0) being the top left corner

                const pxIndex = (x * outputCanvas.height + y) * 4
                const r = pixelData[pxIndex]
                const g = pixelData[pxIndex+1]
                const b = pixelData[pxIndex+2]
                const a = pixelData[pxIndex+3]

                

                const distanceBetweenPxAndCenter = Math.sqrt( Math.pow((x-outputCanvas.width*0.5),2) + Math.pow((y-outputCanvas.height*0.5),2))

                if(distanceBetweenPxAndCenter>outputCanvas.width*0.5){

                  //Pixel isnt in the circle

                  pixelOutsideCircleCount+=1
                  if(a===255){
                    console.log(`Pixel (${x} ; ${y}) which is outside the circle isnt transparent`)
                    outputContext.fillStyle = 'rgba(0, 255, 0, 0.3)'
                    outputContext.fillRect(x,y,1,1)
                  }
                  
                }else{

                  //Pixel is in the circle

                  pixelsInsideCircleCount+=1
                  hapinessIndicator = hapinessIndicator + r + b + g

                  if(a !== 255){
                    console.log(`Pixel (${x} ; ${y}) which is inside the circle has transparency`)
                    outputContext.fillStyle = 'rgba(255, 213, 0, 0.6)'
                    outputContext.fillRect(x,y,1,1)
                  }
                }
              }
            }

            hapinessIndicator = hapinessIndicator / (pixelsInsideCircleCount * 3)
            if(hapinessIndicator<128){
              toast.error("It seems like your image isn't happy enough...")
            }else{
              toast.success("Nice picture !")
            }

          }



      } 

      

      

      
    }
    reader.readAsDataURL(file)
  }
}

  return (
    <div className="App">
      <header className="header">
        <h1>PlayMakers x Louis Cuenot</h1>
        <div className="fileInput">
          <span>
            Pick a 512 x 512 px image (format:.png)
          </span>
          <input 
            ref={fileInputRef} 
            type="file" 
            accept='image/*' 
            name="file" 
            id="file" 
            onChange={fileDropped}  
          />
        </div>
      </header>
      <main>
        <div className="canvasContainer">
          <canvas ref={inputCanvasRef} width={512} height={512} />
          <div className="caption">
            <h2>Input image</h2>
          </div>
        </div>
        <div className="canvasContainer">
          <canvas ref={outputCanvasRef} width={512} height={512} />
          <div className="caption">
            <h2>Problem(s) detected</h2>
            <div className="captionLine">
              <div className="color" style={{backgroundColor:'rgba(0, 255, 0, 0.3)'}}/>
              <span>Pixel outside the circle that are not transparent</span>
            </div>
            <div className="captionLine">
              <div className="color" style={{backgroundColor:'rgba(255, 213, 0, 0.6)'}}/>
              <span>Pixel inside the circle that have transparency</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
