import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";
import rigoImageUrl from "../../img/rigo-baby.jpg";
import "../../styles/home.css";

export const Home = () => {
	const { store, actions } = useContext(Context);
	const [allTerms, setAllTerms] = useState([]);
	const [definition, setDefinition] = useState("")
	const [searchAdd, setSearchAdd] = useState("")
	const [singleTerm, setSingleTerm] = useState({})

	const handleGetAll = async () => {
		//e.preventDefault()  necesario para que al hacer un submit desde un formulario, no se recargue/ refresque la página 
		const resp = await fetch("https://jseiglie-symmetrical-winner-q57vjgxrwvwc4w56-3001.preview.app.github.dev/api/terms")
		const data = await resp.json()
		setAllTerms(data)
		setSingleTerm("")
	}

	const handleAdd = async (e) => {
		e.preventDefault();
		const opt = {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				term: searchAdd,
				definition: definition
			})
		};
		const resp = await fetch("https://jseiglie-symmetrical-winner-q57vjgxrwvwc4w56-3001.preview.app.github.dev/api/terms", opt);
		const data = await resp.json();
		console.log(data);
	}


	const handleSearch = async (e) => {
		e.preventDefault();
		const resp = await fetch("https://jseiglie-symmetrical-winner-q57vjgxrwvwc4w56-3001.preview.app.github.dev/api/terms/" + searchAdd);
		const data = await resp.json();
		setSingleTerm(data);
		
	}

	const handleDelete = async (e, id) => {
		e.preventDefault();
		const opt = {
			method: "delete",
			headers: {
				"Content-Type": "application/json"
			}
		}
		const resp = await fetch("https://jseiglie-symmetrical-winner-q57vjgxrwvwc4w56-3001.preview.app.github.dev/api/terms/" + id, opt);
		const data = await resp.json();
		handleGetAll();

	}

const handleUpdate = async (e) =>{
	e.preventDefault();
		const opt = {
			method: "PUT",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				term: searchAdd,
				definition: definition
			})
		};
		const resp = await fetch("https://jseiglie-symmetrical-winner-q57vjgxrwvwc4w56-3001.preview.app.github.dev/api/terms/" + searchAdd, opt);
		const data = await resp.json();
		console.log(data);
}



	console.log(allTerms)

	return (
		<div className="container w-50 text-center">
			<h1>Urban Dictionary</h1>

			<button className="btn btn-success" onClick={e => handleGetAll()}>Just give me all the definitions!</button>
			<form className="form-control">
				<label htmlFor="term" className="form-text">Term</label>
				<div className="input-group">
					<input className="form-control" type="text" name="term" id="term" placeholder="term to search/add" value={searchAdd}
						onChange={e => setSearchAdd(e.target.value)}
					/>


				</div>
				<label htmlFor="definition" className="form-text">definition</label>
				<textarea id="definition" className="form-control" value={definition}
					name="definition"
					onChange={e => setDefinition(e.target.value)}
				></textarea>

				<div className="d-flex justify-content-between py-3">

					<button className="btn btn-primary"
						onClick={e => handleAdd(e)}
					>ADD</button>

					<button className="btn btn-primary"
						onClick={e => handleUpdate(e)}
					>Update</button>

					<button className="btn btn-success"
						onClick={e => handleSearch(e)}

					>Search </button>
				</div>
			</form>

			<div className="container">

				{allTerms && allTerms.map(el => <div key={el.id} className="container">
					<p className="fs-4">{el.term}</p>
					<p>{el.definition}</p>
					<button className="btn btn-danger"
						onClick={e => handleDelete(e, el.id)}
					>Delete</button>
				</div>)}

				{singleTerm && (
					<div className="container">
						<p className="fs-4">{singleTerm.term}</p>
						<p>{singleTerm.definition}</p>
						<button className="btn btn-danger"
							onClick={e => handleDelete(e, singleTerm.id)}
						>X</button>
					</div>
				)}


			</div>


		</div>
	);
};
