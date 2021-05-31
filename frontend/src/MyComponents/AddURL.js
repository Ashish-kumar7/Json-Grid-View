import React ,{useState} from 'react';
import Axios from 'axios';

export const AddURL = () => {
    const url="http://127.0.0.1:5000/url";

    const[data,setdata]=useState({
        seturl:""
    })

    function handle(e){
        const newdata ={...data};
        newdata[e.target.id]=e.target.value;
        setdata(newdata);
        // console.log(newdata);
    }

    function submit(e){

        e.preventDefault();
        Axios.post(url,{
            seturl:data.seturl
        })
        .then(res=>{
            console.log(data.seturl);
        })
    }

    return (
        <>
            <h1>Add URL</h1>
            <form onSubmit={(e)=>submit(e)}>
                <input onChange={(e)=>handle(e)} id="seturl" name="seturl" value={data.seturl} placeholder="seturl" type="text"></input>
                <button>Submit</button>
            </form>
        </>
    )
}