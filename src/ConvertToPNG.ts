export default async function ConvertToPNG(file: File): Promise<File> {
    return new Promise((res, rej) => {
      const img = new Image()
      
      img.onload = async () => {
        const canvas = document.createElement('canvas')
        canvas.width = 512;
        canvas.height = 512;
  
        const ctx = canvas.getContext('2d')
        ctx!.drawImage(img, 0, 0, 512, 512)
  
        canvas.toBlob(async (blob) => {
          const pngFile = new File([blob as Blob], 'output.png', { type: 'image/png' });
          res(pngFile)
        }, 'image/png')
      };
      
      img.onerror = (error) => {
        rej(error)
      }
  
      img.src = URL.createObjectURL(file)
    })
  }