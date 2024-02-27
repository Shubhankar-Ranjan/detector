import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import Title from './Title';

function ImageUpload() {
    const [uploadedImage, setUploadedImage] = useState(null);
    const [apiResult, setApiResult] = useState(null);

    const onDrop = useCallback((acceptedFiles) => {
        let image = acceptedFiles[0];
        setUploadedImage(URL.createObjectURL(image));
        sendImageToServer(image);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    const sendImageToServer = (image) => {
        let formData = new FormData();
        formData.append('image', image);
        axios.post('http://127.0.0.1:8000/predict', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then((response) => {
            setApiResult(response.data);
        });
    };

    const closeImage = () => {
        setUploadedImage(null);
        setApiResult(null);
    };

    return (
        <div className={`flex flex-col h-screen bg-gray-200 p-8 space-y-8 overflow-hidden ${uploadedImage ? '' : 'justify-center'}`}>
            <Title />
            <div {...getRootProps()} className={`flex flex-col items-center justify-center border-4 border-dashed border-gray-500 rounded-lg p-4 text-center {uploadedImage ? '' : ''}` } >
                <input {...getInputProps()} />
                {
                    isDragActive ?
                        <p className="text-gray-500">Drop the image here ...</p> :
                        <p className="text-gray-500">Drag & drop some image here, or click to select image</p>
                }
                <em className="text-sm text-gray-500">(Only *.jpeg and *.png images will be accepted)</em>
            </div>
            {uploadedImage && (
                <div className="flex flex-row justify-center items-center flex-grow space-x-8">
                    <div className="w-1/2 h-full flex justify-center items-center relative">
                        <img src={uploadedImage} alt="Uploaded" className="max-w-[400px] max-h-[400px] object-contain" />
                        <button onClick={closeImage} className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1">X</button>
                    </div>
                    {apiResult && <div className="p-4 bg-white rounded shadow w-1/2 overflow-auto">{apiResult}</div>}
                </div>
            )}
        </div>
    );
}

export default ImageUpload;