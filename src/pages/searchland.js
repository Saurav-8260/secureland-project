import { useState } from "react";
import { getContract } from "../blockchain/contract";

function SearchLand(){

const [id,setId] = useState("");
const [data,setData] = useState(null);

async function search(){

const contract = await getContract();

const land = await contract.lands(id);

setData(land);

}

return(

<div style={{padding:"40px"}}>

<h1>Search Land</h1>

<input
placeholder="Enter Land ID"
onChange={(e)=>setId(e.target.value)}
/>

<button onClick={search}>
Search
</button>

{data && (

<div>

<p>ID: {data.id.toString()}</p>
<p>Location: {data.location}</p>
<p>Owner: {data.owner}</p>

</div>

)}

</div>

);

}

export default SearchLand;