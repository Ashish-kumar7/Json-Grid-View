import React ,{useState} from 'react';
import Axios from 'axios';

export const AddJSON = () => {
    const url="http://localhost:8086/addJson";

    const[data,setdata]=useState({
        setJson:""
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
            setJson:data.setJson
        })
        .then(res=>{
            console.log(res.data);
        })
        // console.log(e);
    }

    return (
        <>
            <h1>Add JSON</h1>
            <form onSubmit={(e)=>submit(e)}>
                <textarea onChange={(e)=>handle(e)} id="setJson" value={data.setJson} placeholder="setJson" type="text"></textarea>
                <button>Submit</button>
            </form>
        </>
    )
}
