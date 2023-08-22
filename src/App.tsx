import { useRef, useState } from 'react'


function App() {


  const fileInput = useRef<HTMLInputElement>(null!)

  


  const fileDropped = (e:React.ChangeEvent<HTMLInputElement>) => {
    console.log(e)
  }

  return (
    <div className="App">
      <input 
        ref={fileInput} 
        type="file" 
        accept='image/*' 
        name="file" 
        id="file" 
        onChange={fileDropped}  
      />
    </div>
  )
}

export default App
