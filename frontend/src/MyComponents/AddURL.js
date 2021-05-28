import React ,{useState} from 'react';
import Axios from 'axios';

export const AddURL = () => {
    const url="http://localhost:8086/addurl";

    const[data,setdata]=useState({
        seturl:""
    })

    function handle(e){
        const newdata ={...data};
        newdata[e.target.id]=e.target.value;
        setdata(newdata);
        console.log(newdata);
    }

    function submit(e){

        e.preventDefault();
        Axios.post(url,{
            seturl:data.seturl
        })
        .then(res=>{
            console.log(res.data);
        })
        // console.log(e);
    }

    return (
        <>
            <h1>Add URL</h1>
            <form onSubmit={(e)=>submit(e)}>
                <input onChange={(e)=>handle(e)} id="seturl" value={data.seturl} placeholder="seturl" type="text"></input>
                <button>Submit</button>
            </form>
        </>
    )
}
