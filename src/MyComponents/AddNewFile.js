// import React ,{useState} from 'react';
// import Axios from 'axios';

// export const AddNewFile = () => {
//     const url="http://localhost:8086/addfiles";
//     let fileReader;

//     const handleFileRead = (e) => {
//         const content = fileReader.result;
//         console.log(content);
//     }

//     const handleFileChosen = (file) => {
//         fileReader = new FileReader();
//         console.log(file);
//         fileReader.onloadend = handleFileRead;
//         fileReader.readAsText(file);
//     }

//     // const onFileUpload = (e) => {
//     //     handleFileChosen(e.target.file);
//     // }

//     return (<div>
//         <input type= "file" 
//             onChange = {e => {
//                 handleFileChosen(e.target.files[0]);
//                 console.log("We are here" + e.target.files)
//             }}
//         />
//         <button onClick={e => handleFileChosen(e.target.files[0])}> 
//             Upload! 
//         </button> 
//     </div>);
// }




// // export const PostForm = () => {
// //     const url="http://localhost:8086/addurl";

//     const[data,setdata]=useState({
//         seturl:""
//     })

//     function handle(e){
//         const newdata ={...data};
//         newdata[e.target.id]=e.target.value;
//         setdata(newdata);
//         console.log(newdata);
//     }

//     function submit(e){

//         e.preventDefault();
//         Axios.post(url,{
//             seturl:data.seturl
//         })
//         .then(res=>{
//             console.log(res.data);
//         })
//         // console.log(e);
//     }

//     return (
//         <>
//             <h1>AddURL</h1>
//             <form onSubmit={(e)=>submit(e)}>
//                 <input onChange={(e)=>handle(e)} id="seturl" value={data.seturl} placeholder="seturl" type="text"></input>
//                 <button>Submit</button>
//             </form>
//         </>
//     )
// }


// import React, { useState } from "react";

// export const AddNewFile = () => {
//   const [name, setName] = useState("");
//   const [selectedFile, setSelectedFile] = useState(null);

//   const submitForm = () => {};

//   return (
//     <div className="App">
//       <form>
//         <input
//           type="text"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//         />

//         <FileUploaded onFileSelectSuccess={(file) => setSelectedFile(file)}  onFileSelectError={({ error }) => alert(error)} />

//         <button onClick={submitForm}>Submit</button>
//       </form>
//     </div>
//   );
// };


// import Axios from 'axios';

// import React,{Component} from 'react';

// class AddNewFile extends Component {

// 	state = {

// 	// Initially, no file is selected
// 	selectedFile: null
// 	};
	
// 	// On file select (from the pop up)
// 	onFileChange = event => {
	
// 	// Update the state
// 	this.setState({ selectedFile: event.target.files[0] });
	
// 	};
	
	// On file upload (click the upload button)
	// onFileUpload = () => {

    //     const url="http://localhost:8086/addfiles";
	
    //     // Create an object of formData
    //     const formData = new FormData();
        
    //     // Update the formData object
    //     formData.append(
    //         "myFile",
    //         this.state.selectedFile,
    //         this.state.selectedFile.name
    //     );
        
    //     // Details of the uploaded file
    //     console.log(this.state.selectedFile);
        
    //     // Request made to the backend api
    //     // Send formData object
    //     console.log("request sent  started");
        
        
    //     Axios.post(url,{
    //         data: JSON.Stringify(formData)
    //     })
    //     .then(res=>{
    //         console.log(res.data);
    //     })


        // Axios({
        //     method: "post",
        //     url: "http://localhost:8086/addfiles",
        //     data: JSON.Stringify(formData),
        //     headers: { "Content-Type": "application/json" }
        //     });
        // axios.post("http://localhost:8086/addfiles", formData).then(res=>{
        //     console.log(res.data);
        // });
    //     console.log("request sent");
	// };

//     submitForm = () => {
//         const formData = new FormData();
//         formData.append("name", name);
//         formData.append("file", selectedFile);
      
//         Axios
//           .post("http://localhost:8086/addfiles", formData)
//           .then((res) => {
//             alert("File Upload success");
//           })
//           .catch((err) => alert("File Upload Error"));
//       };



// 	render() {
	
// 	return (
// 		<div>
// 			<h3>File Upload</h3>
// 			<div>
// 				<input type="file" onChange={this.onFileChange} />
// 				<button onClick={this.submitForm}>Upload!</button>
// 			</div>
// 		</div>
// 	);
// 	}
// }

// export default AddNewFile;



