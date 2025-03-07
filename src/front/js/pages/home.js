import React, { startTransition, useContext } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";
import homeImageUrl from "../../img/home.jpg";
import "../../styles/home.css";

export const Home = () => {
	const { store, actions } = useContext(Context);

	return (
		<div className="container-fluid mt-4 w-100">
			<div className="card text-white">
				<div className="row m-1">
					<div className="col">
						<img src={homeImageUrl} className="card-img img-fluid mw-100" alt="Regístrate ahora"></img>
						<div className="cio card-img-overlay d-flex flex-column mx-5 align-items-center">
							<div className="heading-group">
								<h1>Administra tus Eventos Deportivos</h1>
								<p className="heading-3 text-light">Organiza tus torneos en un solo click</p>
							</div>
							<div className="divider divider-default"></div>
							<p className="heading-5 m-1">Utiliza nuestra tecnología a tu favor. Estamos listos para dar a tus eventos una ventaja competitiva en la organización.</p>
							<div className="group-md button-group">
								<Link to="/organizadores">
									<span className="btn btn-primary btn-lg mt-4" href="#" role="button">
										VER MÁS
									</span>
								</Link>
							</div>
						</div>
						</div>
				</div>
			</div>
		</div>
	);
};